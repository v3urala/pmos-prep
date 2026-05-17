const SLEEP_QUALITY = ["Poor", "Fair", "Good"]
const STRESS_LEVELS = ["Low", "Moderate", "High", "Very high"]
const EXERCISE_OPTIONS = ["Rarely / never", "1–2x a week", "3–4x a week", "Daily"]
const DIET_OPTIONS = ["Mostly whole foods", "Mixed / balanced", "Mostly processed foods", "Other"]

export default function Step2b({ formData, updateFormData, goNext, goBack }) {
  return (
    <div>
      <h2 className="text-base font-medium text-gray-900 mb-1">Lifestyle context</h2>
      <p className="text-sm text-gray-400 mb-6">
        Lifestyle factors directly affect hormonal health. This helps your doctor see the full picture.
      </p>

      <div className="space-y-5">

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Average sleep per night
          </label>
          <div className="flex gap-2">
            {["Under 5 hrs", "5–6 hrs", "6–8 hrs", "8+ hrs"].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ sleepHours: opt })}
                className={`flex-1 py-2 rounded-lg text-xs border transition-colors
                  ${formData.sleepHours === opt
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Sleep quality</label>
          <div className="flex gap-2">
            {SLEEP_QUALITY.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ sleepQuality: opt })}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors
                  ${formData.sleepQuality === opt
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">General stress level</label>
          <div className="flex gap-2">
            {STRESS_LEVELS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ stressLevel: opt })}
                className={`flex-1 py-2 rounded-lg text-xs border transition-colors
                  ${formData.stressLevel === opt
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Exercise frequency</label>
          <div className="grid grid-cols-2 gap-2">
            {EXERCISE_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ exerciseFrequency: opt })}
                className={`py-2 rounded-lg text-xs border transition-colors
                  ${formData.exerciseFrequency === opt
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Diet pattern</label>
          <div className="grid grid-cols-2 gap-2">
            {DIET_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ dietPattern: opt })}
                className={`py-2 rounded-lg text-xs border transition-colors
                  ${formData.dietPattern === opt
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {/* vegetarian/vegan as a standalone checkbox */}
            <button
                type="button"
                onClick={() => updateFormData({ isVegetarian: !formData.isVegetarian })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border w-full transition-colors
                ${formData.isVegetarian
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : "bg-white border-gray-200 text-gray-500 hover:border-purple-200"}`}
            >
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                ${formData.isVegetarian
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-300"}`}>
                {formData.isVegetarian && <span className="text-white text-xs">✓</span>}
                </span>
                Vegetarian / vegan
            </button>
        </div>



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