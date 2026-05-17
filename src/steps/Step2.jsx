import { useState } from "react"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

export default function Step2({ formData, updateFormData, goNext, goBack }) {
  const [entry, setEntry] = useState({
    date: "",
    length: "",
    cramps: "",
    notes: "",
  })

  function updateEntry(fields) {
    setEntry(prev => ({ ...prev, ...fields }))
  }

  function addCycle() {
    if (!entry.date || !entry.length) return
    const newCycle = {
      date: entry.date,
      length: parseInt(entry.length),
      cramps: entry.cramps ? parseInt(entry.cramps) : null,
      notes: entry.notes,
    }
    updateFormData({
      cycles: [...formData.cycles, newCycle].sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
    })
    setEntry({ date: "", length: "", cramps: "", notes: "" })
  }

  function removeCycle(index) {
    updateFormData({ cycles: formData.cycles.filter((_, i) => i !== index) })
  }

  function getCycleTag(length) {
    if (length <= 35) return { label: "Normal", color: "text-green-600 bg-green-50" }
    if (length <= 45) return { label: "Watch", color: "text-amber-600 bg-amber-50" }
    return { label: "Irregular", color: "text-red-500 bg-red-50" }
  }

  const avgLength = formData.cycles.length
    ? Math.round(
        formData.cycles.reduce((sum, c) => sum + c.length, 0) /
          formData.cycles.length
      )
    : null

  const irregularCount = formData.cycles.filter(c => c.length > 35).length

  const chartData = {
    labels: formData.cycles.map(c => c.date.slice(5)),
    datasets: [
      {
        data: formData.cycles.map(c => c.length),
        borderColor: "#9333ea",
        backgroundColor: "rgba(147,51,234,0.1)",
        pointBackgroundColor: formData.cycles.map(c =>
          c.length > 35 ? "#f59e0b" : "#9333ea"
        ),
        pointRadius: 4,
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 15,
        max: Math.max(50, ...formData.cycles.map(c => c.length)) + 5,
        ticks: { font: { size: 11 } },
      },
      x: { ticks: { font: { size: 11 } } },
    },
  }

  return (
    <div>
      <h2 className="text-base font-medium text-gray-900 mb-1">Cycle log</h2>
      <p className="text-sm text-gray-400 mb-6">
        Add your last 3–6 cycles. Date and length are required.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Start date</label>
          <input
            type="date"
            value={entry.date}
            onChange={e => updateEntry({ date: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Length (days)</label>
          <input
            type="number"
            min="15"
            max="90"
            value={entry.length}
            onChange={e => updateEntry({ length: e.target.value })}
            placeholder="e.g. 34"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Cramp severity (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={entry.cramps}
            onChange={e => updateEntry({ cramps: e.target.value })}
            placeholder="optional"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Notes</label>
          <input
            type="text"
            value={entry.notes}
            onChange={e => updateEntry({ notes: e.target.value })}
            placeholder="stress, travel..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>

      <button
        onClick={addCycle}
        disabled={!entry.date || !entry.length}
        className="w-full border border-purple-300 text-purple-600 text-sm py-2 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-6"
      >
        + Add cycle
      </button>

      {formData.cycles.length === 0 && (
        <p className="text-center text-sm text-gray-300 py-4">
          No cycles logged yet
        </p>
      )}

      {formData.cycles.length > 0 && (
        <>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl font-medium text-gray-900">{avgLength}</div>
              <div className="text-xs text-gray-400 mt-0.5">avg days</div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl font-medium text-gray-900">
                {formData.cycles.length}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">cycles logged</div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <div
                className={`text-xl font-medium ${
                  irregularCount > 0 ? "text-amber-500" : "text-green-500"
                }`}
              >
                {irregularCount}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">irregular</div>
            </div>
          </div>

          {formData.cycles.length >= 2 && (
            <div className="mb-4 h-36">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          <div className="space-y-2 mb-6">
            {formData.cycles.map((c, i) => {
              const tag = getCycleTag(c.length)
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs text-gray-400 w-24">{c.date}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {c.length} days
                  </span>
                  <span className="text-xs text-gray-400">
                    {c.cramps ? `cramps ${c.cramps}/5` : ""}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                  <button
                    onClick={() => removeCycle(i)}
                    className="text-gray-200 hover:text-red-400 text-base leading-none"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className="flex justify-between mt-2">
        <button
          onClick={goBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={goNext}
          disabled={formData.cycles.length === 0}
          className="bg-purple-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  )
}