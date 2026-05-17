const SYMPTOMS = [
  { id: "irreg_periods", label: "Irregular periods", category: "reproductive" },
  { id: "absent_periods", label: "Absent periods", category: "reproductive" },
  { id: "facial_hair", label: "Excess facial hair", category: "dermatological" },
  { id: "acne", label: "Persistent acne", category: "dermatological" },
  { id: "hair_thinning", label: "Hair thinning", category: "dermatological" },
  { id: "weight_gain", label: "Unexplained weight gain", category: "metabolic" },
  { id: "fatigue", label: "Fatigue", category: "metabolic" },
  { id: "blood_sugar", label: "Blood sugar issues", category: "metabolic" },
  { id: "high_bp", label: "High blood pressure", category: "metabolic" },
  { id: "sleep", label: "Sleep issues", category: "metabolic" },
  { id: "infertility", label: "Difficulty conceiving", category: "reproductive" },
  { id: "cramps", label: "Severe cramps", category: "reproductive" },
  { id: "anxiety", label: "Anxiety or depression", category: "psychological" },
  { id: "low_qol", label: "Poor quality of life", category: "psychological" },
  { id: "eating", label: "Disordered eating", category: "psychological" },
]

const CATEGORIES = ["reproductive", "metabolic", "dermatological", "psychological"]

const CATEGORY_LABELS = {
  reproductive: "Reproductive",
  metabolic: "Metabolic",
  dermatological: "Skin & hair",
  psychological: "Psychological",
}

const SEVERITY_OPTIONS = ["Mild", "Moderate", "Severe"]

const DURATION_OPTIONS = [
  "Less than 3 months",
  "3–6 months",
  "6–12 months",
  "1–2 years",
  "2+ years",
]

export default function Step3({ formData, updateFormData, goNext, goBack }) {
  function isSelected(id) {
    return formData.symptoms.some(s => s.id === id)
  }

  function getSymptom(id) {
    return formData.symptoms.find(s => s.id === id)
  }

  function toggleSymptom(id) {
    if (isSelected(id)) {
      updateFormData({ symptoms: formData.symptoms.filter(s => s.id !== id) })
    } else {
      updateFormData({
        symptoms: [
          ...formData.symptoms,
          { id, severity: "Moderate", duration: "3–6 months", worsening: "Same" },
        ],
      })
    }
  }

  function updateSymptomDetail(id, fields) {
    updateFormData({
      symptoms: formData.symptoms.map(s =>
        s.id === id ? { ...s, ...fields } : s
      ),
    })
  }

  return (
    <div>
      <h2 className="text-base font-medium text-gray-900 mb-1">Symptoms</h2>
      <p className="text-sm text-gray-400 mb-6">
        Select all that apply. You can add detail for each one.
      </p>

      {CATEGORIES.map(cat => (
        <div key={cat} className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            {CATEGORY_LABELS[cat]}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SYMPTOMS.filter(s => s.category === cat).map(symptom => {
              const selected = isSelected(symptom.id)
              const detail = getSymptom(symptom.id)
              return (
                <div key={symptom.id}>
                  <button
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors
                      ${selected
                        ? "bg-purple-50 border-purple-300 text-purple-700 font-medium"
                        : "bg-white border-gray-200 text-gray-600 hover:border-purple-200"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${selected ? "bg-purple-500" : "bg-gray-200"}`} />
                      {symptom.label}
                    </span>
                  </button>

                

                  {selected && (
                    <div className="mt-1 p-3 bg-purple-50 rounded-lg border border-purple-100 space-y-2">
                      <div>
                        <p className="text-xs text-purple-400 mb-1">Severity</p>
                        <div className="flex gap-1">
                          {SEVERITY_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => updateSymptomDetail(symptom.id, { severity: opt })}
                              className={`flex-1 text-xs py-1 rounded border transition-colors
                                ${detail.severity === opt
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"
                                }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-purple-400 mb-1">How long</p>
                        <select
                          value={detail.duration}
                          onChange={e => updateSymptomDetail(symptom.id, { duration: e.target.value })}
                          className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-purple-300"
                        >
                          {DURATION_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-xs text-purple-400 mb-1">Getting worse?</p>
                        <div className="flex gap-1">
                          {["Yes", "No", "Same"].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => updateSymptomDetail(symptom.id, { worsening: opt })}
                              className={`flex-1 text-xs py-1 rounded border transition-colors
                                ${detail.worsening === opt
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"
                                }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                    Anything else to mention <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                    value={formData.extraNotes}
                    onChange={e => updateFormData({ extraNotes: e.target.value })}
                    placeholder="Any other context you think your doctor should know..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
        </div>

      <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={goBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </button>
        <span className="text-xs text-gray-400">
          {formData.symptoms.length} selected
        </span>
        <button
          onClick={goNext}
          disabled={formData.symptoms.length === 0}
          className="bg-purple-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  )
}