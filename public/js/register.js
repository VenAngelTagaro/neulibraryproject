// THIS IS FOR THE FIRST NAME AND LAST NAME
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");

let nameTimeout;

function validateName() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;

    if (firstName.length > 0 && lastName.length > 0) {
        firstNameInput.style.color = "#00FA94";
        firstNameInput.style.borderColor = "#00FA94";
        lastNameInput.style.color = "#00FA94";
        lastNameInput.style.borderColor = "#00FA94";
        return true;
    }

    if (firstName.length > 0 && lastName.length == 0) {
        firstNameInput.style.color = "#00FA94";
        firstNameInput.style.borderColor = "#00FA94";
        lastNameInput.style.color = "#ef233c";
        lastNameInput.style.borderColor = "#ef233c";
    } else if (lastName.length > 0 && firstName.length == 0) {
        lastNameInput.style.color = "#00FA94";
        lastNameInput.style.borderColor = "#00FA94";
        firstNameInput.style.color = "#ef233c";
        firstNameInput.style.borderColor = "#ef233c";
    } else {
        // both empty
        firstNameInput.style.color = "#ef233c";
        firstNameInput.style.borderColor = "#ef233c";
        lastNameInput.style.color = "#ef233c";
        lastNameInput.style.borderColor = "#ef233c";
    }

    clearTimeout(nameTimeout);
    nameTimeout = setTimeout(() => {
        firstNameInput.style.color = "#8d99ae";
        firstNameInput.style.borderColor = "#8d99ae";
        lastNameInput.style.color = "#8d99ae";
        lastNameInput.style.borderColor = "#8d99ae";
    }, 3000);

    return false;
}

// THIS IS FOR USER SPEC INFO
const courseInput = document.getElementById("courseInput");
const yearLevelInput = document.getElementById("yearLevelInput");
const facultyDepartmentInput = document.getElementById(
    "facultyDepartmentInput",
);
const positionInput = document.getElementById("positionInput");

let userSpecificTimeout;

function validateUserSpecificInformation() {
    const course = courseInput.value;
    const yearLevel = yearLevelInput.value;
    const facultyDepartment = facultyDepartmentInput.value;
    const position = positionInput.value;
    const type = userType.value;

    if (type == "Student") {
        if (course.length > 0 && yearLevel.length > 0) {
            courseInput.style.borderColor = "#00FA9A";
            yearLevelInput.style.borderColor = "#00FA9A";
            return true;
        }
        if (course.length == 0) courseInput.style.borderColor = "#ef233c";
        if (yearLevel.length == 0) yearLevelInput.style.borderColor = "#ef233c";
        clearTimeout(userSpecificTimeout);
        userSpecificTimeout = setTimeout(() => {
            courseInput.style.borderColor = "#8d99ae";
            yearLevelInput.style.borderColor = "#8d99ae";
        }, 3000);

        return false;
    } else if (type == "Faculty") {
        if (facultyDepartment.length > 0 && position.length > 0) {
            facultyDepartmentInput.style.borderColor = "#00FA9A";
            positionInput.style.borderColor = "#00FA9A";
            return true;
        }
        if (facultyDepartment.length == 0)
            facultyDepartmentInput.style.borderColor = "#ef233c";
        if (position.length == 0) positionInput.style.borderColor = "#ef233c";
        clearTimeout(userSpecificTimeout);
        userSpecificTimeout = setTimeout(() => {
            facultyDepartmentInput.style.borderColor = "#8d99ae";
            positionInput.style.borderColor = "#8d99ae";
        }, 3000);

        return false;
    } else {
        return false;
    }
}

// THIS IS FOR THE USER TYPE OPTION
let userTypeTimeout;
const userType = document.getElementById("userTypeSelect");

function userTypeSpecificInformation() {
    const type = userType.value;

    const studentSpecificInfo = document.getElementById(
        "studentAdditionalInformation",
    );
    const facultySpecificInfo = document.getElementById(
        "facultyAdditionalInformation",
    );

    if (type.length > 0) {
        userType.style.color = "#00FA94";
        userType.style.borderColor = "#00FA94";

        if (type == "Student") {
            document.getElementById("facultyDepartmentInput").value = "";
            document.getElementById("positionInput").value = "";
            studentSpecificInfo.style.display = "grid";
            facultySpecificInfo.style.display = "none";
        } else if (type == "Faculty") {
            document.getElementById("courseInput").value = "";
            document.getElementById("yearLevelInput").value = "";
            studentSpecificInfo.style.display = "none";
            facultySpecificInfo.style.display = "grid";
        }
    } else {
        document.getElementById("courseInput").value = "";
        document.getElementById("yearLevelInput").value = "";
        document.getElementById("facultyDepartmentInput").value = "";
        document.getElementById("positionInput").value = "";
        studentSpecificInfo.style.display = "none";
        facultySpecificInfo.style.display = "none";
        userType.style.color = "#8d99ae";
        userType.style.borderColor = "#8d99ae";
    }

    progressBarHandler();
}

function doubleCheckUserType() {
    const type = userType.value;

    if (type.length > 0) {
        return true;
    } else {
        userType.style.color = "#ef233c";
        userType.style.borderColor = "#ef233c";

        clearTimeout(userTypeTimeout);
        userTypeTimeout = setTimeout(() => {
            userType.style.color = "#8d99ae";
            userType.style.borderColor = "#8d99ae";
        }, 3000);

        return false;
    }
}

userType.addEventListener("change", userTypeSpecificInformation);

// THIS IS FOR THE PROGRESS BAR

const inputs = [
    document.getElementById("firstNameInput"),
    document.getElementById("lastNameInput"),
    document.getElementById("emailInput"),
    document.getElementById("passwordInput"),
    document.getElementById("passwordInputChecker"),
    userType,
    document.getElementById("courseInput"),
    document.getElementById("yearLevelInput"),
    document.getElementById("facultyDepartmentInput"),
    document.getElementById("positionInput"),
];

const progressSteps = document.querySelectorAll(".light");

function progressPointsHandler(filled) {
    for (let i = 0; i < progressSteps.length; i++) {
        if (i < filled) {
            progressSteps[i].style.backgroundColor = "#ef233c";
        } else {
            progressSteps[i].style.backgroundColor = "";
        }
    }
}

const progressBar = document.getElementById("registrationProgressIndicator");

function progressBarHandler() {
    let filled = 1;

    if (inputs[0].value && inputs[1].value) filled++;
    if (inputs[2].value && inputs[3].value) filled++;
    if (inputs[4].value) filled++;
    if (inputs[5].value) filled++;

    if (
        (inputs[6].value && inputs[7].value) ||
        (inputs[8].value && inputs[9].value)
    ) {
        filled++;
    }

    const progressPoints = ["0", "0%", "45%", "80%", "120%", "160%", "200%"];
    progressBar.style.height = progressPoints[filled];

    progressPointsHandler(filled);
}

inputs.forEach((el) => el.addEventListener("input", progressBarHandler));

window.addEventListener("DOMContentLoaded", () => {
    inputs.forEach((input) => (input.value = ""));
});

// Exising Email Finder
const emailInput = document.getElementById("emailInput");

let emailTimeout;

async function validateEmail() {
    const res = await fetch("/visitors");
    const data = await res.json();
    console.log(data);

    const email = emailInput.value;

    const emailTypes = ["neu.edu.ph", "gmail.com"];
    const emailParts = emailInput.value.split("@");
    const firstPart = emailParts[0];
    const secondPart = emailParts[1];

    let isEmail = firstPart.length >= 6 && emailTypes.includes(secondPart);

    if (isEmail) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].email == email) {
                emailInput.style.color = "#ef233c";
                emailInput.style.borderColor = "#ef233c";

                clearTimeout(emailTimeout);
                emailTimeout = setTimeout(() => {
                    emailInput.style.borderColor = "#8d99ae";
                    emailInput.style.color = "#8d99ae";
                }, 3000);
                return false;
            }
        }

        emailInput.style.color = "#00FA94";
        emailInput.style.borderColor = "#00FA9A";
        return true;
    } else {
        emailInput.style.color = "#ef233c";
        emailInput.style.borderColor = "#ef233c";

        clearTimeout(emailTimeout);
        emailTimeout = setTimeout(() => {
            emailInput.style.color = "#8d99ae";
            emailInput.style.borderColor = "#8d99ae";
        }, 3000);
        return false;
    }
}

// Password checker
const passwordInput = document.getElementById("passwordInput");
const passwordMatch = document.getElementById("passwordInputChecker");

let passwordTimeout;

function passwordValidation() {
    const password = passwordInput.value;
    const passwordMatchValue = passwordMatch.value;

    if (password.length === 0 || passwordMatchValue.length === 0) {
        passwordInput.style.borderColor = "#ef233c";
        passwordMatch.style.borderColor = "#ef233c";
        clearTimeout(passwordTimeout);
        passwordTimeout = setTimeout(() => {
            passwordInput.style.borderColor = "#8d99ae";
            passwordMatch.style.borderColor = "#8d99ae";
        }, 3000);
        return false;
    }

    if (password !== passwordMatchValue) {
        passwordInput.style.borderColor = "#ef233c";
        passwordMatch.style.borderColor = "#ef233c";
        clearTimeout(passwordTimeout);
        passwordTimeout = setTimeout(() => {
            passwordInput.style.borderColor = "#8d99ae";
            passwordMatch.style.borderColor = "#8d99ae";
        }, 3000);
        return false;
    }

    passwordInput.style.borderColor = "#00FA9A";
    passwordMatch.style.borderColor = "#00FA9A";
    return true;
}

// THIS IS FOR EMAIL SENDING
emailjs.init("WHYlqQX1kCjIFuVLI");

async function sendCredentialsEmail({
    firstName,
    idNumber,
    password,
    receiverEmail,
}) {
    try {
        await emailjs.send("service_9w3yytw", "template_gevf3v8", {
            receiverEmail,
            firstName,
            idNumber,
            password,
        });
        console.log("Credentials email sent");
    } catch (err) {
        console.error("Credentials email error:", err);
        alert("Failed to send credentials email.");
    }
}

// REGISTER BUTTON
async function handleRegister(e) {
    e.preventDefault();

    const validEmail = await validateEmail();
    const validPassword = passwordValidation();
    const validType = doubleCheckUserType();
    const validName = validateName();
    const validUserSpecificInformation = validateUserSpecificInformation();

    if (
        !validEmail ||
        !validPassword ||
        !validType ||
        !validName ||
        !validUserSpecificInformation
    )
        return;

    const body = {
        lastName: lastNameInput.value,
        firstName: firstNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        userType: userType.value,
        course: courseInput.value,
        yearLevel: yearLevelInput.value,
        facultyDepartment: facultyDepartmentInput.value,
        position: positionInput.value,
    };

    const res = await fetch("/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log(data);

    if (data.message) {
        await sendCredentialsEmail({
            receiverEmail: emailInput.value,
            firstName: firstNameInput.value,
            idNumber: data.idNumber,
            password: passwordInput.value,
        });
        showPop(
            "Account registered successfully.\nRedirecting to Login page...",
            true,
        );
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    }
}

document
    .getElementById("registerButton")
    .addEventListener("click", handleRegister);
