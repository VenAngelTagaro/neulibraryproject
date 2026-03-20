const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.get("/statistics", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/statistics.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/register.html"));
});

router.get("/verify", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/verify.html"));
});

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/dashboard.html"));
});

router.get("/catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/catalog.html"));
});

const {
    getVisitors,
    addVisitor,
    verifyCode,
    requestCode,
} = require("../controllers/visitorController");
router.get("/visitors", getVisitors);
router.post("/visitors", addVisitor);
router.post("/verify-code", verifyCode);
router.post("/request-code", requestCode);

const {
    borrowBook,
    getBorrowedBooks,
    returnBook,
} = require("../controllers/borrowController");
router.post("/api/borrow", borrowBook);
router.get("/api/borrow/:id_number", getBorrowedBooks);
router.delete("/api/borrow", returnBook);

const {
    getStatistics,
    getUsers,
    toggleBlock,
} = require("../controllers/statisticsController");
router.get("/api/statistics", getStatistics);
router.get("/api/users", getUsers);
router.patch("/api/users/block", toggleBlock);

const {
    addVisitLog,
    getVisitLogs,
    getFilteredVisitLogs,
} = require("../controllers/visitLogController");
router.post("/api/visit-log", addVisitLog);
router.get("/api/visit-log", getVisitLogs);
router.get("/api/visit-log/filter", getFilteredVisitLogs);

module.exports = router;
