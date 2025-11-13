import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/apiPaths";
import { Doughnut, Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";  // 👈 ensure Bar is imported

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
} from "chart.js";
import EmojiPicker from "emoji-picker-react";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement);

export default function Home() {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: "income", category: "", amount: "", note: "", emoji: "" });
  const [showPicker, setShowPicker] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${BASE_URL}/api/transactions`, { headers })
      .then((r) => r.json())
      .then(setTransactions)
      .catch(console.error);
  }, []);

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    const res = await fetch(`${BASE_URL}/api/transactions`, {
      method: "POST",
      headers,
      body: JSON.stringify(form),
    });
    const newTx = await res.json();
    setTransactions((prev) => [newTx, ...prev]);
    setForm({ type: "income", category: "", amount: "", note: "", emoji: "" });
    setShowPicker(false);
  };

  const del = async (id) => {
    await fetch(`${BASE_URL}/api/transactions/${id}`, { method: "DELETE", headers });
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const income = transactions.filter((t) => t.type === "income");
  const expense = transactions.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((a, c) => a + c.amount, 0);
  const totalExpense = expense.reduce((a, c) => a + c.amount, 0);
  const balance = totalIncome - totalExpense;

  const doughnutData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };

  const lineData = {
    labels: transactions.slice(0, 7).map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: "Transactions",
        data: transactions.slice(0, 7).map((t) => t.amount),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const recent = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Total Income</h3>
          <p className="text-2xl font-semibold text-green-600">₹{totalIncome}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Total Expense</h3>
          <p className="text-2xl font-semibold text-red-600">₹{totalExpense}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Balance</h3>
          <p className="text-2xl font-semibold text-indigo-600">₹{balance}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow flex justify-center">
          <Doughnut data={doughnutData} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <Line data={lineData} />
        </div>
      </div>


      {/* Last 30 Days Overview */}
<div className="bg-white p-4 rounded-2xl shadow">
  <h3 className="text-md font-semibold text-gray-700 mb-3">Last 30 Days Overview</h3>
  <Bar
    data={{
      labels: [...Array(30).keys()].map((i) =>
        new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Income",
          data: [...Array(30).keys()].map((i) => {
            const day = new Date();
            day.setDate(day.getDate() - (29 - i));
            const daily = transactions
              .filter((t) => new Date(t.date).toDateString() === day.toDateString() && t.type === "income")
              .reduce((a, c) => a + c.amount, 0);
            return daily;
          }),
          backgroundColor: "#4ade80",
        },
        {
          label: "Expense",
          data: [...Array(30).keys()].map((i) => {
            const day = new Date();
            day.setDate(day.getDate() - (29 - i));
            const daily = transactions
              .filter((t) => new Date(t.date).toDateString() === day.toDateString() && t.type === "expense")
              .reduce((a, c) => a + c.amount, 0);
            return daily;
          }),
          backgroundColor: "#f87171",
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { x: { ticks: { autoSkip: true, maxTicksLimit: 7 } } },
    }}
  />
</div>


      {/* Add Transaction */}
      <form onSubmit={addTransaction} className="bg-white p-4 rounded-2xl shadow grid sm:grid-cols-6 gap-3 items-end relative">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border rounded p-2"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          className="border rounded p-2"
        />
        <input
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="border rounded p-2"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="border rounded p-2 w-full"
          >
            {form.emoji || "😀 Emoji"}
          </button>
          {showPicker && (
            <div className="absolute top-12 z-50">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setForm({ ...form, emoji: emojiData.emoji });
                  setShowPicker(false);
                }}
                width={280}
                height={350}
              />
            </div>
          )}
        </div>
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Add
        </button>
      </form>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Recent Transactions</h3>
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th className="py-2">Emoji</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recent.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="py-2 text-lg">{t.emoji}</td>
                <td className={t.type === "income" ? "text-green-600" : "text-red-600"}>{t.type}</td>
                <td>{t.category}</td>
                <td>₹{t.amount}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.note}</td>
                <td>
                  <button onClick={() => del(t._id)} className="text-red-500 hover:text-red-700 text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
