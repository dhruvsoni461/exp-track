const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Transaction = require("../models/Transaction");

// ➕ Add transaction
router.post("/", auth, async (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const tx = new Transaction({
      userId: req.user.id,
      type,
      category,
      amount,
      note,
      date,
    });
    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 📋 Get all transactions for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(100);
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ❌ Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
