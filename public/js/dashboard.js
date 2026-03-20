if (!user) {
    window.location.href = "/";
}

async function loadBorrowedBooks() {
    const container = document.getElementById("loansContainer");
    container.innerHTML = "Loading...";

    try {
        const res = await fetch(`/api/borrow/${user.idNumber}`);
        const data = await res.json();

        if (!data.length) {
            container.innerHTML = "No borrowed books yet.";
            return;
        }

        container.innerHTML = "";

        data.forEach((book) => {
            const card = document.createElement("div");
            card.className = "loan-card";
            card.innerHTML = `
                <img src="${book.cover_url}" alt="${book.title}" />
                <div class="loan-card-info">
                    <h3>${book.title}</h3>
                    <p>${book.author || "Unknown Author"}</p>
                    <p class="due-date">Due: ${formatDate(book.due_date)}</p>
                    <button class="unloan-btn" data-key="${book.book_key}">Return</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = "Failed to load borrowed books.";
        console.error(err);
    }
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(2);
    return `${dd}/${mm}/${yy}`;
}

document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("unloan-btn")) return;

    const btn = e.target;
    btn.disabled = true;
    btn.textContent = "Returning...";

    try {
        const res = await fetch("/api/borrow", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_number: user.idNumber,
                book_key: btn.dataset.key,
            }),
        });

        if (res.ok) {
            btn.closest(".loan-card").remove();
        } else {
            btn.disabled = false;
            btn.textContent = "Return";
        }
    } catch (err) {
        btn.disabled = false;
        btn.textContent = "Return";
        console.error(err);
    }
});

loadBorrowedBooks();
