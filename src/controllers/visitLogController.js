const db = require("../config/db");

const addVisitLog = (req, res) => {
    const { id_number, reason } = req.body;

    if (!id_number || !reason) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        "INSERT INTO visit_logs (id_number, reason) VALUES (?, ?)",
        [id_number, reason],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Server error" });
            }
            res.json({ success: true });
        },
    );
};

const getVisitLogs = (req, res) => {
    db.query(
        `SELECT v.id_number, v.reason, v.visited_at, 
        vis.firstName, vis.lastName, vis.userType 
        FROM visit_logs v 
        JOIN Visit vis ON v.id_number = vis.idNumber 
        ORDER BY v.visited_at DESC`,
        (err, rows) => {
            if (err) return res.status(500).json({ error: "Server error" });
            res.json(rows);
        },
    );
};

const getFilteredVisitLogs = (req, res) => {
    const { period, dateFrom, dateTo, reason, userType } = req.query;

    let dateCondition = "";
    if (period === "today") {
        dateCondition = "AND DATE(v.visited_at) = CURDATE()";
    } else if (period === "week") {
        dateCondition = "AND v.visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    } else if (period === "range" && dateFrom && dateTo) {
        dateCondition = `AND DATE(v.visited_at) BETWEEN '${dateFrom}' AND '${dateTo}'`;
    }

    const reasonCondition = reason ? `AND v.reason = '${reason}'` : "";
    const userTypeCondition = userType
        ? `AND vis.userType = '${userType}'`
        : "";

    const sql = `
        SELECT v.id_number, v.reason, v.visited_at,
        vis.firstName, vis.lastName, vis.userType
        FROM visit_logs v
        JOIN Visit vis ON v.id_number = vis.idNumber
        WHERE 1=1
        ${dateCondition}
        ${reasonCondition}
        ${userTypeCondition}
        ORDER BY v.visited_at DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: "Server error" });
        res.json(rows);
    });
};

module.exports = { addVisitLog, getVisitLogs, getFilteredVisitLogs };
