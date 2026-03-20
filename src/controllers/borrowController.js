const db = require("../config/db");

const borrowBook = (req, res) => {
    const { id_number, book_key, title, author, cover_url } = req.body;

    if (!id_number || !book_key || !title) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const due = new Date();
    due.setDate(due.getDate() + 14);
    const due_date = due.toISOString().split("T")[0];

    const sql = `
    INSERT INTO borrowed_books (id_number, book_key, title, author, cover_url, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(
        sql,
        [id_number, book_key, title, author, cover_url, due_date],
        (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ error: "Already borrowed" });
                }
                console.error(err);
                return res.status(500).json({ error: "Server error" });
            }
            res.json({ success: true, due_date });
        },
    );
};

const getBorrowedBooks = (req, res) => {
    const sql =
        "SELECT * FROM borrowed_books WHERE id_number = ? ORDER BY borrowed_at DESC";

    db.query(sql, [req.params.id_number], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
        }
        res.json(rows);
    });
};

const returnBook = (req, res) => {
    const { id_number, book_key } = req.body;
    if (!id_number || !book_key) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    db.query(
        "DELETE FROM borrowed_books WHERE id_number = ? AND book_key = ?",
        [id_number, book_key],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Server error" });
            }
            res.json({ success: true });
        },
    );
};

module.exports = { borrowBook, getBorrowedBooks, returnBook };
