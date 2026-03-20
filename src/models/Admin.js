const Visitor = require("./Visitor");

class Admin extends Visitor {
    userType = "Employee";

    constructor(idNumber, lastName, firstName, email, password) {
        super(idNumber, lastName, firstName, email, password);
    }
}

module.exports = Employee;
