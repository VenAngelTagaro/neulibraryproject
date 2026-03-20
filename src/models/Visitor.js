class Visitor {
    idNumber;
    lastName;
    firstName;
    email;
    password;
    timeCreated;
    userType;
    isVerified = false;
    isBlocked = false;

    constructor(idNumber, lastName, firstName, email, password) {
        this.idNumber = idNumber;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.timeCreated = new Date();
    }

    getIdNumber() {
        return this.idNumber;
    }

    getLastName() {
        return this.lastName;
    }

    getFirstName() {
        return this.firstName;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    getTimeCreated() {
        return this.timeCreated;
    }

    getUserType() {
        return this.userType;
    }

    getIsVerified() {
        return this.isVerified;
    }

    getIsBlocked() {
        return this.isBlocked;
    }
}

module.exports = Visitor;
