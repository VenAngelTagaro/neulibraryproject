const Visitor = require("./Visitor");

class Faculty extends Visitor {
    userType = "Faculty";
    facultyDepartment;
    position;

    constructor(
        idNumber,
        lastName,
        firstName,
        email,
        password,
        facultyDepartment,
        position,
    ) {
        super(idNumber, lastName, firstName, email, password);
        this.facultyDepartment = facultyDepartment;
        this.position = position;
    }

    getFacultyDepartment() {
        return this.facultyDepartment;
    }

    getPosition() {
        return this.position;
    }
}

module.exports = Faculty;
