const db = require("../config/db");

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

const codes = {};

const verifyCode = (req, res) => {
    const { email, code } = req.body;
    const record = codes[email];

    if (!record) return res.json({ valid: false, message: "No code found" });
    if (Date.now() > record.expiresAt)
        return res.json({ valid: false, message: "Code expired" });
    if (record.code !== code)
        return res.json({ valid: false, message: "Wrong code" });

    db.query(
        "UPDATE Visit SET isVerified = 1 WHERE email = ?",
        [email],
        (err) => {
            if (err) return res.json({ valid: false });

            // Also update the subclass table
            db.query(
                "UPDATE Student SET isVerified = 1 WHERE email = ?",
                [email],
                () => {}, // ignore if not a student
            );
            db.query(
                "UPDATE Faculty SET isVerified = 1 WHERE email = ?",
                [email],
                () => {}, // ignore if not a faculty
            );

            delete codes[email];
            res.json({ valid: true });
        },
    );
};

const requestCode = (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes[email] = {
        code,
        expiresAt: Date.now() + 60 * 60 * 1000,
    };
    res.json({ code });
};

function generateIdNumber() {
    const year = new Date().getFullYear().toString().slice(-2);
    const part1 = Math.floor(10000 + Math.random() * 90000);
    const part2 = Math.floor(100 + Math.random() * 900);
    return `${year}-${part1}-${part2}`;
}

function generateUniqueIdNumber(callback) {
    const idNumber = generateIdNumber();
    db.query(
        "SELECT * FROM Visit WHERE idNumber = ?",
        [idNumber],
        (err, results) => {
            if (err) return callback(err);
            if (results.length > 0) {
                generateUniqueIdNumber(callback);
            } else {
                callback(null, idNumber);
            }
        },
    );
}

const getVisitors = (req, res) => {
    db.query("SELECT * FROM Visit", (err, results) => {
        if (err) {
            return res.json({ error: err });
        }
        res.json(results);
    });
};

const addVisitor = (req, res) => {
    const {
        lastName,
        firstName,
        email,
        password,
        userType,
        course,
        yearLevel,
        facultyDepartment,
        position,
    } = req.body;

    generateUniqueIdNumber((err, idNumber) => {
        if (err) return res.json({ error: err });

        let visitor;

        if (userType === "Student") {
            visitor = new Student(
                idNumber,
                lastName,
                firstName,
                email,
                password,
                course,
                yearLevel,
            );
            db.query(
                "INSERT INTO Visit (idNumber, userType, email, password, lastName, firstName, timeCreated, isVerified, isBlocked) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)",
                [
                    visitor.getIdNumber(),
                    visitor.getUserType(),
                    visitor.getEmail(),
                    visitor.getPassword(),
                    visitor.getLastName(),
                    visitor.getFirstName(),
                    visitor.getIsVerified(),
                    visitor.getIsBlocked(),
                ],
                (err) => {
                    if (err) return res.json({ error: err });
                    db.query(
                        "INSERT INTO Student (idNumber, email, password, lastName, firstName, timeCreated, course, yearLevel, isVerified, isBlocked) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)",
                        [
                            visitor.getIdNumber(),
                            visitor.getEmail(),
                            visitor.getPassword(),
                            visitor.getLastName(),
                            visitor.getFirstName(),
                            visitor.getCourse(),
                            visitor.getYearLevel(),
                            visitor.getIsVerified(),
                            visitor.getIsBlocked(),
                        ],
                        (err) => {
                            if (err) return res.json({ error: err });
                            const code = Math.floor(
                                100000 + Math.random() * 900000,
                            ).toString();
                            codes[email] = {
                                code,
                                expiresAt: Date.now() + 60 * 60 * 1000,
                            };
                            res.json({
                                message: "Student added successfully",
                                idNumber: visitor.getIdNumber(),
                                code: code,
                            });
                        },
                    );
                },
            );
        } else if (userType === "Faculty") {
            visitor = new Faculty(
                idNumber,
                lastName,
                firstName,
                email,
                password,
                facultyDepartment,
                position,
            );
            db.query(
                "INSERT INTO Visit (idNumber, userType, email, password, lastName, firstName, timeCreated, isVerified, isBlocked) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)",
                [
                    visitor.getIdNumber(),
                    visitor.getUserType(),
                    visitor.getEmail(),
                    visitor.getPassword(),
                    visitor.getLastName(),
                    visitor.getFirstName(),
                    visitor.getIsVerified(),
                    visitor.getIsBlocked(),
                ],
                (err) => {
                    if (err) return res.json({ error: err });
                    db.query(
                        "INSERT INTO Faculty (idNumber, email, password, lastName, firstName, timeCreated, facultyDepartment, position, isVerified, isBlocked) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)",
                        [
                            visitor.getIdNumber(),
                            visitor.getEmail(),
                            visitor.getPassword(),
                            visitor.getLastName(),
                            visitor.getFirstName(),
                            visitor.getFacultyDepartment(),
                            visitor.getPosition(),
                            visitor.getIsVerified(),
                            visitor.getIsBlocked(),
                        ],
                        (err) => {
                            if (err) return res.json({ error: err });
                            const code = Math.floor(
                                100000 + Math.random() * 900000,
                            ).toString();
                            codes[email] = {
                                code,
                                expiresAt: Date.now() + 60 * 60 * 1000,
                            };
                            res.json({
                                message: "Faculty added successfully",
                                idNumber: visitor.getIdNumber(),
                                code: code,
                            });
                        },
                    );
                },
            );
        } else {
            return res.json({ error: "Invalid user type" });
        }
    });
};

module.exports = { getVisitors, addVisitor, verifyCode, requestCode };
