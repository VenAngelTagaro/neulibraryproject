if (!user || user.userType !== "Admin") {
    window.location.href = "/";
}

async function loadStatistics() {
    try {
        const res = await fetch("/api/statistics");
        const data = await res.json();

        document.getElementById("totalUsers").textContent = data.totalUsers;
        document.getElementById("totalStudents").textContent =
            data.totalStudents;
        document.getElementById("totalFaculty").textContent = data.totalFaculty;
        document.getElementById("totalBorrowed").textContent =
            data.totalBorrowed;
        document.getElementById("blockedUsers").textContent = data.blockedUsers;

        renderUserChart(data);
        renderActivityChart(data);
    } catch (err) {
        console.error("Failed to load statistics", err);
    }
}

function renderUserChart(data) {
    const ctx = document.getElementById("userChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Students", "Faculty"],
            datasets: [
                {
                    data: [data.totalStudents, data.totalFaculty],
                    backgroundColor: ["#d90429", "#2b2d42"],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            cutout: "70%",
            plugins: {
                legend: { position: "bottom" },
            },
        },
    });
}

function renderActivityChart(data) {
    const ctx = document.getElementById("activityChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Borrowed Books", "Blocked Users"],
            datasets: [
                {
                    data: [data.totalBorrowed, data.blockedUsers],
                    backgroundColor: ["#d90429", "#8d99ae"],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            cutout: "70%",
            plugins: {
                legend: { position: "bottom" },
            },
        },
    });
}

loadStatistics();

let allUsers = [];

async function loadUsers() {
    try {
        const res = await fetch("/api/users");
        allUsers = await res.json();
        renderUsers(allUsers);
    } catch (err) {
        console.error("Failed to load users", err);
    }
}

function renderUsers(users) {
    const tbody = document.getElementById("usersTableBody");

    if (!users.length) {
        tbody.innerHTML = `<tr><td colspan="6">No users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.idNumber}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td><span class="type-badge ${user.userType.toLowerCase()}">${user.userType}</span></td>
            <td><span class="status-badge ${user.isBlocked ? "blocked" : "active"}">${user.isBlocked ? "Blocked" : "Active"}</span></td>
            <td>
                <button class="block-btn ${user.isBlocked ? "unblock" : "block"}" 
                    data-id="${user.idNumber}" 
                    data-blocked="${user.isBlocked}">
                    ${user.isBlocked ? "Unblock" : "Block"}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("block-btn")) return;

    const btn = e.target;
    const idNumber = btn.dataset.id;
    const isCurrentlyBlocked =
        btn.dataset.blocked === "1" || btn.dataset.blocked === "true";
    const newBlockedState = isCurrentlyBlocked ? 0 : 1;

    btn.disabled = true;
    btn.textContent = "Updating...";

    try {
        const res = await fetch("/api/users/block", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idNumber, isBlocked: newBlockedState }),
        });

        if (res.ok) {
            await loadUsers();
        } else {
            btn.disabled = false;
            btn.textContent = isCurrentlyBlocked ? "Unblock" : "Block";
        }
    } catch (err) {
        btn.disabled = false;
        btn.textContent = isCurrentlyBlocked ? "Unblock" : "Block";
        console.error(err);
    }
});

loadUsers();

async function loadVisitLogs() {
    const period = document.getElementById("filterPeriod").value;
    const reason = document.getElementById("filterReason").value;
    const userType = document.getElementById("filterUserType").value;
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;

    const params = new URLSearchParams({ period, reason, userType });
    if (period === "range") {
        params.append("dateFrom", dateFrom);
        params.append("dateTo", dateTo);
    }

    const tbody = document.getElementById("visitLogsTableBody");
    tbody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

    try {
        const res = await fetch(`/api/visit-log/filter?${params}`);
        const data = await res.json();

        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="5">No visit logs found.</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        data.forEach((log) => {
            const tr = document.createElement("tr");
            const date = new Date(log.visited_at).toLocaleString();
            tr.innerHTML = `
                <td>${log.id_number}</td>
                <td>${log.firstName} ${log.lastName}</td>
                <td><span class="type-badge ${log.userType.toLowerCase()}">${log.userType}</span></td>
                <td>${log.reason}</td>
                <td>${date}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5">Failed to load visit logs.</td></tr>`;
        console.error(err);
    }
}

document.getElementById("filterPeriod").addEventListener("change", (e) => {
    document.getElementById("dateRangeInputs").style.display =
        e.target.value === "range" ? "flex" : "none";
});

document
    .getElementById("applyFiltersBtn")
    .addEventListener("click", loadVisitLogs);

loadVisitLogs();
