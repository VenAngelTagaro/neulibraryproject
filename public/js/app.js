const notifier = document.getElementById("popupNotifier");

function showPop(message, status) {
    notifier.textContent = message;

    notifier.style.display = "flex";
    if (status) {
        notifier.style.borderColor = "#00FA9A";
    } else {
        notifier.style.borderColor = "#ef233c";
    }

    setTimeout(() => {
        notifier.style.display = "none";
    }, 5000);
}

const user = JSON.parse(localStorage.getItem("user"));

// THIS IS FOR THE RIGHT NAVBAR SIDE
const dropdownButton = document.getElementById("dropdownButton");

if (dropdownButton) {
    const userName = document.getElementById("userName");
    const firstLetter = document.getElementById("firstLetter");
    userName.textContent = user.firstName;
    firstLetter.textContent = user.firstName.trimStart().charAt(0);
    const dropdownContent = document.getElementById("dropdownContent");
    const dropdownArrow = document.getElementById("dropdownArrow");
    const randomColors = [
        "#E74C3C",
        "#3498DB",
        "#2ECC71",
        "#F39C12",
        "#9B59B6",
        "#1ABC9C",
    ];
    const displayColor =
        randomColors[Math.floor(Math.random() * randomColors.length)];
    dropdownButton.style.backgroundColor = displayColor;

    function showDropDown() {
        const dropdownDisplay = getComputedStyle(dropdownContent).display;
        if (dropdownDisplay === "none") {
            dropdownContent.style.display = "block";
            dropdownArrow.style.transform = "rotate(180deg)";
        } else {
            dropdownContent.style.display = "none";
            dropdownArrow.style.transform = "";
        }
    }
    dropdownButton.addEventListener("click", showDropDown);

    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    });
}

const sidebarButton = document.getElementById("openSidebarButton");
const closeSidebarButton = document.getElementById("closeSidebarButton");

if (sidebarButton && closeSidebarButton) {
    const sidebar = document.getElementById("sidebar");

    sidebarButton.addEventListener("click", () => {
        sidebar.style.left = "0";
    });

    closeSidebarButton.addEventListener("click", () => {
        sidebar.style.left = "-100%";
    });
}

const adminDashboardSection = document.getElementById("adminDashboardSection");

if (adminDashboardSection) {
    if (user.userType === "Admin") {
        adminDashboardSection.style.display = "flex";
    } else {
        adminDashboardSection.style.display = "none";
    }
}
