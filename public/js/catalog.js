if (!user) {
    window.location.href = "/";
}
const queries = [
    "the",
    "love",
    "world",
    "man",
    "life",
    "dark",
    "light",
    "time",
    "night",
    "star",
];
const randomQuery = queries[Math.floor(Math.random() * queries.length)];
const randomOffset = Math.floor(Math.random() * 100);

async function loadBooks(retries = 3) {
    const container = document.getElementById("bookContainer");
    container.innerHTML = "Loading books...";

    try {
        const res = await fetch(
            `https://openlibrary.org/search.json?q=${randomQuery}&limit=24&offset=${randomOffset}`,
        );
        const data = await res.json();

        if (!data.docs || data.docs.length === 0) {
            if (retries > 0) return loadBooks(retries - 1);
            container.innerHTML = "No books found. Try refreshing.";
            return;
        }

        container.innerHTML = "";

        data.docs.forEach((book) => {
            const title = book.title || "Unknown Title";
            const author = book.author_name?.[0] || "Unknown Author";
            const year = book.first_publish_year || "";
            const book_key = book.key || "";
            const cover = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://placehold.co/128x193?text=No+Cover";

            const card = document.createElement("div");
            card.className = "book-card";
            card.innerHTML = `
        <img src="${cover}" alt="${title}" />
        <h3>${title}</h3>
        <p class="author">${author}</p>
        <p class="year">${year}</p>
        <button class="borrow-btn"
          data-key="${book_key}"
          data-title="${title}"
          data-author="${author}"
          data-cover="${cover}">
          Borrow
        </button>
      `;
            container.appendChild(card);
        });
    } catch (err) {
        if (retries > 0) return loadBooks(retries - 1);
        container.innerHTML = "Failed to load books. Try refreshing.";
        console.error(err);
    }
}

// Borrow button click handler
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("borrow-btn")) return;

    const btn = e.target;
    btn.disabled = true;
    btn.textContent = "Borrowing...";

    try {
        const res = await fetch("/api/borrow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_number: user.idNumber,
                book_key: btn.dataset.key,
                title: btn.dataset.title,
                author: btn.dataset.author,
                cover_url: btn.dataset.cover,
            }),
        });

        const result = await res.json();

        if (res.ok) {
            btn.textContent = "Borrowed ✓";
            btn.style.opacity = "0.5";
        } else if (res.status === 409) {
            btn.textContent = "Already borrowed";
            btn.style.opacity = "0.5";
        } else {
            btn.textContent = "Borrow";
            btn.disabled = false;
            alert(result.error || "Something went wrong.");
        }
    } catch (err) {
        btn.textContent = "Borrow";
        btn.disabled = false;
        console.error(err);
    }
});

loadBooks();
