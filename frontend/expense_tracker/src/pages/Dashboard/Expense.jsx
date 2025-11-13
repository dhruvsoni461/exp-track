import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/apiPaths";
import { Doughnut, Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

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

export default function Expense() {
  const { token } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", note: "", emoji: "" });
  const [showPicker, setShowPicker] = useState(false);
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${BASE_URL}/api/transactions`, { headers })
      .then((r) => r.json())
      .then((data) => setExpenses(data.filter((t) => t.type === "expense")))
      .catch(console.error);
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    const res = await fetch(`${BASE_URL}/api/transactions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...form, type: "expense" }),
    });
    const newTx = await res.json();
    setExpenses((prev) => [newTx, ...prev]);
    setForm({ category: "", amount: "", note: "", emoji: "" });
    setShowPicker(false);
  };

  const del = async (id) => {
    await fetch(`${BASE_URL}/api/transactions/${id}`, { method: "DELETE", headers });
    setExpenses((prev) => prev.filter((t) => t._id !== id));
  };

  const total = expenses.reduce((a, c) => a + c.amount, 0);
  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const donutData = {
    labels: Object.keys(categoryTotals),
    datasets: [{ data: Object.values(categoryTotals), backgroundColor: ["#f87171", "#fb923c", "#facc15", "#60a5fa", "#a78bfa"] }],
  };

  const lineData = {
    labels: expenses.slice(0, 7).map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [{ label: "Expense Trend", data: expenses.slice(0, 7).map((t) => t.amount), borderColor: "#f87171", tension: 0.4, fill: true }],
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-700">Total Expense</h2>
        <span className="text-2xl font-bold text-red-600">₹{total}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow flex justify-center max-h-[300px]">
          <Doughnut data={donutData} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <Line data={lineData} />
        </div>
      </div>

      {/* Last 30 Days Expense Overview */}
<div className="bg-white p-4 rounded-2xl shadow">
  <h3 className="text-md font-semibold text-gray-700 mb-3">Last 30 Days Expense Trend</h3>
  <Bar
    data={{
      labels: [...Array(30).keys()].map((i) =>
        new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Daily Expense",
          data: [...Array(30).keys()].map((i) => {
            const day = new Date();
            day.setDate(day.getDate() - (29 - i));
            const daily = expenses
              .filter((t) => new Date(t.date).toDateString() === day.toDateString())
              .reduce((a, c) => a + c.amount, 0);
            return daily;
          }),
          backgroundColor: "#f87171",
          borderRadius: 6,
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


      <form onSubmit={addExpense} className="bg-white p-4 rounded-2xl shadow grid sm:grid-cols-5 gap-3 items-end relative">
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded p-2" />
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="border rounded p-2" />
        <input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="border rounded p-2" />
        <div className="relative">
          <button type="button" onClick={() => setShowPicker(!showPicker)} className="border rounded p-2 w-full">{form.emoji || "😀 Emoji"}</button>
          {showPicker && <div className="absolute top-12 z-50"><EmojiPicker onEmojiClick={(emojiData)=>{setForm({...form, emoji:emojiData.emoji});setShowPicker(false);}} width={280} height={350}/></div>}
        </div>
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Add</button>
      </form>

      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-left"><tr><th>Emoji</th><th>Category</th><th>Amount</th><th>Date</th><th>Note</th><th></th></tr></thead>
          <tbody>{expenses.map((t)=>(<tr key={t._id} className="border-b hover:bg-gray-50"><td>{t.emoji}</td><td>{t.category}</td><td className="text-red-600 font-medium">₹{t.amount}</td><td>{new Date(t.date).toLocaleDateString()}</td><td>{t.note}</td><td><button onClick={()=>del(t._id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
