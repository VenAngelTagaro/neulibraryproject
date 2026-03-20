const db = require("../config/db");

const getStatistics = (req, res) => {
    const stats = {};

    const totalStudents = (next) => {
        db.query(
            "SELECT COUNT(*) AS count FROM Student WHERE isVerified = 1",
            (err, rows) => {
                if (err) return res.status(500).json({ error: "Server error" });
                stats.totalStudents = rows[0].count;
                next();
            },
        );
    };

    const totalFaculty = (next) => {
        db.query(
            "SELECT COUNT(*) AS count FROM Faculty WHERE isVerified = 1",
            (err, rows) => {
                if (err) return res.status(500).json({ error: "Server error" });
                stats.totalFaculty = rows[0].count;
                next();
            },
        );
    };

    const totalBorrowed = (next) => {
        db.query(
            "SELECT COUNT(*) AS count FROM borrowed_books",
            (err, rows) => {
                if (err) return res.status(500).json({ error: "Server error" });
                stats.totalBorrowed = rows[0].count;
                next();
            },
        );
    };

    const blockedUsers = (next) => {
        db.query(
            "SELECT COUNT(*) AS count FROM Visit WHERE isBlocked = 1",
            (err, rows) => {
                if (err) return res.status(500).json({ error: "Server error" });
                stats.blockedUsers = rows[0].count;
                next();
            },
        );
    };

    const totalUsers = (next) => {
        db.query(
            "SELECT COUNT(*) AS count FROM Visit WHERE isVerified = 1",
            (err, rows) => {
                if (err) return res.status(500).json({ error: "Server error" });
                stats.totalUsers = rows[0].count;
                next();
            },
        );
    };

    totalStudents(() =>
        totalFaculty(() =>
            totalBorrowed(() =>
                blockedUsers(() =>
                    totalUsers(() => {
                        res.json(stats);
                    }),
                ),
            ),
        ),
    );
};

const getUsers = (req, res) => {
    db.query(
        "SELECT idNumber, firstName, lastName, email, userType, isBlocked FROM Visit WHERE userType != 'Admin' ORDER BY userType, lastName",
        (err, rows) => {
            if (err) return res.status(500).json({ error: "Server error" });
            res.json(rows);
        },
    );
};

const toggleBlock = (req, res) => {
    const { idNumber, isBlocked } = req.body;
    if (!idNumber) return res.status(400).json({ error: "Missing idNumber" });

    db.query(
        "UPDATE Visit SET isBlocked = ? WHERE idNumber = ?",
        [isBlocked, idNumber],
        (err) => {
            if (err) return res.status(500).json({ error: "Server error" });

            db.query(
                "UPDATE Student SET isBlocked = ? WHERE idNumber = ?",
                [isBlocked, idNumber],
                () => {},
            );
            db.query(
                "UPDATE Faculty SET isBlocked = ? WHERE idNumber = ?",
                [isBlocked, idNumber],
                () => {},
            );

            res.json({ success: true });
        },
    );
};

module.exports = { getStatistics, getUsers, toggleBlock };
