const Visitor = require("./Visitor");

class Student extends Visitor {
    userType = "Student";
    course;
    yearLevel;

    constructor(
        idNumber,
        lastName,
        firstName,
        email,
        password,
        course,
        yearLevel,
    ) {
        super(idNumber, lastName, firstName, email, password);
        this.course = course;
        this.yearLevel = yearLevel;
    }

    getCourse() {
        return this.course;
    }

    getYearLevel() {
        return this.yearLevel;
    }
}

module.exports = Student;
