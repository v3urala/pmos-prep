const ETHNICITIES = [
  "South Asian",
  "East Asian",
  "Black / African",
  "Hispanic / Latina",
  "Middle Eastern",
  "White / European",
  "Mixed",
  "Prefer not to say",
]

export default function Step1({ formData, updateFormData, goNext }) {
  function handleSubmit(e) {
    e.preventDefault()
    goNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-base font-medium text-gray-900 mb-1">About you</h2>
      <p className="text-sm text-gray-400 mb-6">
        This helps contextualise your symptom pattern for your doctor.
      </p>

      <div className="space-y-4">

        <div>
          <label className="block text-sm text-gray-600 mb-1">Age</label>
          <input
            type="number"
            min="10"
            max="60"
            required
            value={formData.age}
            onChange={e => updateFormData({ age: e.target.value })}
            placeholder="e.g. 28"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ethnicity</label>
          <select
            required
            value={formData.ethnicity}
            onChange={e => updateFormData({ ethnicity: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
          >
            <option value="">Select...</option>
            {ETHNICITIES.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Symptoms present since
          </label>
          <input
            type="month"
            required
            value={formData.symptomsSince}
            onChange={e => updateFormData({ symptomsSince: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Have you been diagnosed with PCOS or PMOS before?
          </label>
          <div className="flex gap-2">
            {["Yes", "No", "Unsure"].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ priorDiagnosis: opt })}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors
                  ${formData.priorDiagnosis === opt
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="bg-purple-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </form>
  )
}