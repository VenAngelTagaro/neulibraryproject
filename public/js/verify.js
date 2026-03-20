emailjs.init("WHYlqQX1kCjIFuVLI");
const firstName = localStorage.getItem("pendingFirstName");

const verifyButton = document.getElementById("verifyButton");
const codeInputs = document.querySelectorAll(".code-input");
const email = localStorage.getItem("pendingEmail");

codeInputs.forEach((input, index) => {
    input.addEventListener("focus", () => {
        const lastFilled = [...codeInputs].reduce(
            (last, i, idx) => (i.value !== "" ? idx : last),
            -1,
        );
        const focusTarget =
            lastFilled + 1 < codeInputs.length ? lastFilled + 1 : lastFilled;
        if (index > focusTarget) {
            codeInputs[focusTarget].focus();
        }
    });

    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value.length === 1 && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
            const lastFilled = [...codeInputs].reduce(
                (last, i, idx) => (i.value !== "" ? idx : last),
                -1,
            );
            if (lastFilled !== -1) {
                codeInputs[lastFilled].value = "";
                codeInputs[lastFilled].focus();
            }
            e.preventDefault();
        }
    });
});

function getCode() {
    return [...codeInputs].map((i) => i.value).join("");
}

verifyButton.addEventListener("click", async () => {
    const code = getCode();
    const res = await fetch("/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (data.valid) {
        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("pendingFirstName");
        localStorage.removeItem("codeSent");
        showPop("Email verified! Redirecting to Login page...", true);
        setTimeout(() => (window.location.href = "../"), 2000);
    } else {
        showPop(data.message, false);
    }
});

// SEND VERIFICATION CODE
async function sendVerificationEmail({ firstName, code, receiverEmail }) {
    try {
        await emailjs.send("service_9w3yytw", "template_1uodtkp", {
            receiverEmail,
            firstName,
            code,
        });
        console.log("Verification email sent");
    } catch (err) {
        console.error("Verification email error:", err);
        alert("Failed to send verification email.");
    }
}

// FOR RESENDIGN CODE
const resendButton = document.getElementById("resendCodeButton");
const resendTimer = document.getElementById("resendTimer");

let countdown;
const COOLDOWN = 60;

function startCooldown() {
    let seconds = COOLDOWN;
    resendButton.disabled = true;
    resendTimer.textContent = seconds;

    countdown = setInterval(() => {
        seconds--;
        resendTimer.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(countdown);
            resendTimer.textContent = 0;
            resendButton.disabled = false;
        }
    }, 1000);
}

resendButton.addEventListener("click", async () => {
    if (!email) return;

    const res = await fetch("/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.code) {
        await sendVerificationEmail({
            receiverEmail: email,
            firstName: firstName || "User",
            code: data.code,
        });

        // reset the flag so the new code is tracked
        localStorage.setItem("codeSent", "true");
        showPop("Verification code resent!", true);
        startCooldown();
    }
});

window.addEventListener("load", async () => {
    if (!email) return;

    // if already sent, don't send again
    if (localStorage.getItem("codeSent")) return;

    const res = await fetch("/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.code) {
        await sendVerificationEmail({
            receiverEmail: email,
            firstName: firstName || "User",
            code: data.code,
        });

        localStorage.setItem("codeSent", "true");
        startCooldown();
    }
});
