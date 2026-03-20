// TO PREVENM THE LOGGED IN USER FROM GOING BACK TO THE LANDING PAGE
if (user) {
    window.location.href = "/dashboard";
}

// FOR LOGGING IN
const idNumberInput = document.getElementById("idNumberInput");
const passwordInput = document.getElementById("passwordInput");

const loginBtn = document.getElementById("loginButton");
const showPasswordBtn = document.getElementById("togglePassword");

// FOR SHOWING PASSWORD INPUT (index page)
function showPassword() {
    showButtonText = showPasswordBtn.textContent;

    if (passwordInput.type === "password") {
        showPasswordBtn.textContent = "Hide";
        passwordInput.type = "text";
    } else {
        showPasswordBtn.textContent = "Show";
        passwordInput.type = "password";
    }
}

// =========================================================
const person = [];

// FOR VALIDATING LOGIN INPUT (index page)
function validateIdNumber(idNumber) {
    if (idNumber.trim().length === 0) {
        return false;
    }
    return true;
}

function validatePassword(password) {
    if (password.trim().length === 0) {
        return false;
    }
    return true;
}

async function validateLogin() {
    const res = await fetch("/visitors");
    const data = await res.json();
    const idNumber = idNumberInput.value;
    const password = passwordInput.value;
    let found = false;
    for (let i = 0; i < data.length; i++) {
        if (data[i].idNumber == idNumber || data[i].email == idNumber) {
            found = true;
            if (data[i].password == password) {
                if (data[i].isBlocked == 1) {
                    showPop("Your account has been banned.", false);
                    return;
                }
                if (data[i].isVerified == 0) {
                    localStorage.setItem("pendingEmail", data[i].email);
                    localStorage.setItem("pendingFirstName", data[i].firstName);
                    showPop(
                        "Please verify your account first.\nRedirecting to verification page...",
                        false,
                    );
                    setTimeout(() => {
                        window.location.href = "/verify";
                    }, 3000);
                    return;
                }
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        idNumber: data[i].idNumber,
                        firstName: data[i].firstName,
                        lastName: data[i].lastName,
                        userType: data[i].userType,
                    }),
                );
                if (data[i].userType === "Admin") {
                    window.location.href = "/statistics";
                    return;
                }
                // Show visit modal for Students and Faculty
                document.getElementById("visitModal").style.display = "flex";
                return;
            } else {
                showPop("Incorrect password.", false);
                return;
            }
        }
    }
    if (!found) {
        showPop("Account does not exist.", false);
    }
}

function showLoginButton() {
    const idNumber = idNumberInput.value;
    const password = passwordInput.value;

    const isValidIdNumber = validateIdNumber(idNumber);
    const isValidPassword = validatePassword(password);

    if (isValidIdNumber && isValidPassword) {
        loginBtn.style.display = "flex";
    } else {
        loginBtn.style.display = "none";
    }
}

// FOR VISIT SUBMIT BUTTON
document
    .getElementById("visitSubmitBtn")
    .addEventListener("click", async () => {
        const reason = document.getElementById("visitReason").value;
        if (!reason) {
            alert("Please select a reason for visiting.");
            return;
        }

        const btn = document.getElementById("visitSubmitBtn");
        btn.disabled = true;
        btn.textContent = "Saving...";

        const currentUser = JSON.parse(localStorage.getItem("user"));

        try {
            const res = await fetch("/api/visit-log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_number: currentUser.idNumber,
                    reason,
                }),
            });

            if (res.ok) {
                window.location.href = "/dashboard";
            } else {
                btn.disabled = false;
                btn.textContent = "Enter Library";
            }
        } catch (err) {
            btn.disabled = false;
            btn.textContent = "Enter Library";
            console.error(err);
        }
    });

idNumberInput.addEventListener("input", showLoginButton);
passwordInput.addEventListener("input", showLoginButton);
showPasswordBtn.addEventListener("click", showPassword);
loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await validateLogin();
});
