const cron = require("node-cron");
const db = require("./db");

cron.schedule("*/5 * * * *", () => {
    const CONDITION =
        "isVerified = 0 AND timeCreated < DATE_SUB(NOW(), INTERVAL 1 HOUR)";

    db.query(
        `SELECT idNumber, userType FROM Visit WHERE ${CONDITION}`,
        (err, results) => {
            if (err) return console.error("Cleanup error (SELECT):", err);
            if (results.length === 0) return;

            const studentIds = results
                .filter((v) => v.userType === "Student")
                .map((v) => v.idNumber);

            const facultyIds = results
                .filter((v) => v.userType === "Faculty")
                .map((v) => v.idNumber);

            const allIds = results.map((v) => v.idNumber);

            const deleteStudents = (next) => {
                if (studentIds.length === 0) return next();
                db.query(
                    "DELETE FROM Student WHERE idNumber IN (?)",
                    [studentIds],
                    (err) => {
                        if (err)
                            return console.error(
                                "Cleanup error (Student):",
                                err,
                            );
                        next();
                    },
                );
            };

            const deleteFaculty = (next) => {
                if (facultyIds.length === 0) return next();
                db.query(
                    "DELETE FROM Faculty WHERE idNumber IN (?)",
                    [facultyIds],
                    (err) => {
                        if (err)
                            return console.error(
                                "Cleanup error (Faculty):",
                                err,
                            );
                        next();
                    },
                );
            };

            const deleteVisitors = () => {
                db.query(
                    "DELETE FROM Visit WHERE idNumber IN (?)",
                    [allIds],
                    (err) => {
                        if (err)
                            return console.error(
                                "Cleanup error (Visitor):",
                                err,
                            );
                        console.log(
                            `Cleaned up ${allIds.length} unverified account(s)`,
                        );
                    },
                );
            };

            deleteStudents(() => deleteFaculty(() => deleteVisitors()));
        },
    );
});
