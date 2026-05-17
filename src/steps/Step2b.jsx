const FAMILY_CONDITIONS = [
  { id: "pmos_pcos", label: "PMOS / PCOS" },
  { id: "type2_diabetes", label: "Type 2 diabetes" },
  { id: "insulin_resistance", label: "Insulin resistance" },
  { id: "thyroid", label: "Thyroid conditions" },
  { id: "cardiovascular", label: "Heart disease" },
  { id: "obesity", label: "Obesity" },
  { id: "endometrial_cancer", label: "Endometrial cancer" },
  { id: "depression_anxiety", label: "Depression / anxiety" },
]

export default function Step2c({ formData, updateFormData, goNext, goBack }) {
  function toggle(id) {
    if (formData.familyHistory.includes(id)) {
      updateFormData({ familyHistory: formData.familyHistory.filter(x => x !== id) })
    } else {
      updateFormData({ familyHistory: [...formData.familyHistory, id] })
    }
  }

  return (
    <div>
      <h2 className="text-base font-medium text-gray-900 mb-1">Family history</h2>
      <p className="text-sm text-gray-400 mb-6">
        Select any conditions that run in your immediate family — parents or siblings.
        This is one of the most overlooked but important pieces of context for a GP.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {FAMILY_CONDITIONS.map(cond => {
          const selected = formData.familyHistory.includes(cond.id)
          return (
            <button
              key={cond.id}
              type="button"
              onClick={() => toggle(cond.id)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm border transition-colors flex items-center gap-2
                ${selected
                  ? "bg-purple-50 border-purple-300 text-purple-700 font-medium"
                  : "bg-white border-gray-200 text-gray-600 hover:border-purple-200"}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${selected ? "bg-purple-500" : "bg-gray-200"}`} />
              {cond.label}
            </button>
          )
        })}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Any other relevant family history <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={formData.familyNotes}
          onChange={e => updateFormData({ familyNotes: e.target.value })}
          placeholder="e.g. maternal aunt had ovarian cysts, father has high cholesterol..."
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
        />
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </button>
        <button
          onClick={goNext}
          className="bg-purple-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}