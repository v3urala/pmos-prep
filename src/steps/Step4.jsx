import { useState } from "react"

const CATEGORY_LABELS = {
  reproductive: "Reproductive",
  metabolic: "Metabolic",
  dermatological: "Skin & hair",
  psychological: "Psychological",
}

async function callGemini(prompt) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 5096 },
    }),
  })

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received."
}

function buildPrompt(formData) {
  const cyclesSummary = formData.cycles
    .map(c => `${c.date}: ${c.length} days${c.cramps ? `, cramps ${c.cramps}/5` : ""}${c.notes ? `, notes: ${c.notes}` : ""}`)
    .join("\n")

  const symptomsSummary = formData.symptoms
    .map(s => `- ${s.id.replace(/_/g, " ")} (${s.severity}, ${s.duration}, worsening: ${s.worsening})`)
    .join("\n")

  const familyHistorySummary = formData.familyHistory.length
    ? formData.familyHistory.join(", ")
    : "None reported"

  return `You are helping a patient prepare for a doctor's appointment about potential PMOS (Polyendocrine Metabolic Ovarian Syndrome, previously called PCOS).

    Patient profile:
    - Age: ${formData.age}
    - Ethnicity: ${formData.ethnicity}
    - Symptoms present since: ${formData.symptomsSince}
    - Prior diagnosis: ${formData.priorDiagnosis}

    Cycle log (${formData.cycles.length} cycles):
    ${cyclesSummary}

    Lifestyle context:
    - Sleep: ${formData.sleepHours || "not provided"}, quality: ${formData.sleepQuality || "not provided"}
    - Stress level: ${formData.stressLevel || "not provided"}
    - Exercise: ${formData.exerciseFrequency || "not provided"}
    - Diet: ${formData.dietPattern || "not provided"}${formData.isVegetarian ? ", vegetarian/vegan" : ""}

    Family history:
    - Conditions: ${familyHistorySummary}
    ${formData.familyNotes ? `- Additional notes: ${formData.familyNotes}` : ""}

    Reported symptoms:
    ${symptomsSummary}
    ${formData.extraNotes ? `\nAdditional patient notes:\n${formData.extraNotes}` : ""}

    Please provide:
    1. A 2-3 sentence plain-English summary of this patient's symptom pattern, written as if summarising for a GP. Factor in lifestyle and family history where relevant.
    2. A list of 5-6 specific questions the patient should ask their doctor, informed by their full profile including lifestyle and family history.
    3. A list of 3-4 tests they should request (e.g. hormone panel, fasting insulin).

    Format your response in three clearly labelled sections:
    SUMMARY:
    QUESTIONS TO ASK:
    TESTS TO REQUEST:

    Keep language simple, clear and non-alarmist. Do not diagnose. Remind the patient this is a preparation tool, not medical advice.`
}

function parseResponse(text) {
  const cleaned = text.replace(/\*\*/g, "")

  const summaryMatch = cleaned.match(/SUMMARY:\s*([\s\S]*?)(?=QUESTIONS TO ASK:|$)/i)
  const questionsMatch = cleaned.match(/QUESTIONS TO ASK:\s*([\s\S]*?)(?=TESTS TO REQUEST:|$)/i)
  const testsMatch = cleaned.match(/TESTS TO REQUEST:\s*([\s\S]*?)$/i)

  function parseList(block) {
    if (!block) return []
    return block
      .split("\n")
      .map(l => l.replace(/^[-•*\d.]+\s*/, "").trim())
      .filter(l => l.length > 0)
  }

  return {
    summary: summaryMatch?.[1]?.trim() || "",
    questions: parseList(questionsMatch?.[1]),
    tests: parseList(testsMatch?.[1]),
  }
}

export default function Step4({ formData, goBack }) {
  const [status, setStatus] = useState("idle") // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")

  async function generate() {
    setStatus("loading")
    try {
      const prompt = buildPrompt(formData)
      const text = await callGemini(prompt)
      const parsed = parseResponse(text)
      setResult(parsed)
      setStatus("done")
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.")
      setStatus("error")
    }
  }

  function handlePrint() {
    window.print()
  }

  const avgCycle = formData.cycles.length
    ? Math.round(formData.cycles.reduce((s, c) => s + c.length, 0) / formData.cycles.length)
    : null

  const irregular = formData.cycles.filter(c => c.length > 35).length

  return (
    <div>
      <h2 className="text-base font-medium text-gray-900 mb-1">Your summary</h2>
      <p className="text-sm text-gray-400 mb-6">
        Review your information, then generate your appointment summary.
      </p>

      {/* Overview cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-lg font-medium text-gray-900">{formData.age}</div>
          <div className="text-xs text-gray-400 mt-0.5">age</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-lg font-medium text-gray-900">{avgCycle ?? "—"}</div>
          <div className="text-xs text-gray-400 mt-0.5">avg cycle days</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className={`text-lg font-medium ${irregular > 0 ? "text-amber-500" : "text-green-500"}`}>
            {formData.symptoms.length}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">symptoms</div>
        </div>
      </div>

      {/* Symptom summary by category */}
      <div className="mb-5">
        {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
          const catSymptoms = formData.symptoms.filter(s => {
            const SYMPTOM_CATS = {
              irreg_periods: "reproductive", absent_periods: "reproductive",
              infertility: "reproductive", cramps: "reproductive",
              facial_hair: "dermatological", acne: "dermatological", hair_thinning: "dermatological",
              weight_gain: "metabolic", fatigue: "metabolic", blood_sugar: "metabolic",
              high_bp: "metabolic", sleep: "metabolic",
              anxiety: "psychological", low_qol: "psychological", eating: "psychological",
            }
            return SYMPTOM_CATS[s.id] === cat
          })
          if (catSymptoms.length === 0) return null
          return (
            <div key={cat} className="mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                {label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {catSymptoms.map(s => (
                  <span key={s.id} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100">
                    {s.id.replace(/_/g, " ")} · {s.severity.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Generate button */}
      {status === "idle" && (
        <button
          onClick={generate}
          className="w-full bg-purple-600 text-white text-sm py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
        >
          Generate appointment summary ✦
        </button>
      )}

      {/* Loading */}
      {status === "loading" && (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400">Generating your summary...</p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600 mb-2">Something went wrong: {errorMsg}</p>
          <button onClick={generate} className="text-sm text-red-500 underline">Try again</button>
        </div>
      )}

      {/* Result */}
      {status === "done" && result && (
  <div id="print-summary">

    {/* print header — only visible when printing */}
    <div className="hidden print:block mb-6 pb-4 border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-900">PMOS Appointment Summary</h1>
      <p className="text-sm text-gray-500 mt-1">
        Generated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        {formData.age ? ` · Age ${formData.age}` : ""}
        {formData.ethnicity ? ` · ${formData.ethnicity}` : ""}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        This document was generated by a preparation tool that uses AI and does not constitute medical advice or diagnosis.
        Share with your doctor to support your consultation.
      </p>
    </div>

    <div className="mt-2 space-y-5">

      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
        <p className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-2">
          Symptom pattern summary
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Questions to ask your doctor
        </p>
        <div className="space-y-2">
          {result.questions.map((q, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Tests to request
        </p>
        <div className="space-y-2">
          {result.tests.map((t, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-purple-400 shrink-0 mt-0.5">✦</span>
              <p className="text-sm text-gray-700 leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* lifestyle snapshot — shown on print */}
      {(formData.sleepHours || formData.stressLevel || formData.exerciseFrequency) && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Lifestyle snapshot
          </p>
          <div className="grid grid-cols-2 gap-2">
            {formData.sleepHours && (
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-400">Sleep</p>
                <p className="text-sm text-gray-700">{formData.sleepHours} · {formData.sleepQuality || "—"}</p>
              </div>
            )}
            {formData.stressLevel && (
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-400">Stress</p>
                <p className="text-sm text-gray-700">{formData.stressLevel}</p>
              </div>
            )}
            {formData.exerciseFrequency && (
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-400">Exercise</p>
                <p className="text-sm text-gray-700">{formData.exerciseFrequency}</p>
              </div>
            )}
            {formData.dietPattern && (
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-400">Diet</p>
                <p className="text-sm text-gray-700">
                  {formData.dietPattern}{formData.isVegetarian ? ", vegetarian/vegan" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* family history — shown on print */}
      {formData.familyHistory.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Family history
          </p>
          <div className="flex flex-wrap gap-1.5">
            {formData.familyHistory.map(id => (
              <span key={id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {id.replace(/_/g, " ")}
              </span>
            ))}
          </div>
          {formData.familyNotes && (
            <p className="text-sm text-gray-600 mt-2">{formData.familyNotes}</p>
          )}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-xs text-amber-700 leading-relaxed">
          This summary is a preparation tool only — not medical advice or a diagnosis.
          Please share it with your doctor and let them guide next steps.
        </p>
      </div>

      <div className="no-print flex flex-col gap-2">
        <button
          onClick={handlePrint}
          className="w-full border border-purple-300 text-purple-600 text-sm py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
        >
          Print / save as PDF ↓
        </button>
        <button
          onClick={generate}
          className="w-full border border-gray-200 text-gray-400 text-sm py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Regenerate
        </button>
      </div>

    </div>
  </div>
)}

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
        <button onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </button>
      </div>
    </div>
  )}