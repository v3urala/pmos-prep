import { useState } from "react"
import Step1 from "./steps/Step1"
import Step2 from "./steps/Step2"
import Step2a from "./steps/Step2a"
import Step2b from "./steps/Step2b"
import Step3 from "./steps/Step3"
import Step4 from "./steps/Step4"

const STEPS = ["About you", "Cycle log", "Lifestyle", "Family history", "Symptoms", "Your summary"]

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // step 1
    age: "",
    ethnicity: "",
    symptomsSince: "",
    priorDiagnosis: "",
    // step 2
    cycles: [],
    //step 2a
    sleepHours: "",
    sleepQuality: "",
    stressLevel: "",
    exerciseFrequency: "",
    dietPattern: "",
    isVeg: "false",
    // step 2b
    familyHistory: [],
    familyNotes: "",
    // step 3
    symptoms: [],
    extraNotes: "",
  })

  function updateFormData(fields) {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  function goNext() {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }

  function goBack() {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const steps = [Step1, Step2, Step2a, Step2b, Step3, Step4]
  const CurrentStepComponent = steps[currentStep]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* persistent disclaimer banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex gap-3 items-start">
          <span className="text-amber-500 text-base mt-0.5 shrink-0">⚠</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>This is a preparation tool only.</strong> It does not provide medical diagnoses or advice.
            The summary generated is intended to help you have a more informed conversation with your doctor.
            Always consult a qualified healthcare professional for medical concerns.
          </p>
        </div>

        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            Appointment prep
          </h1>
          <p className="text-sm text-gray-500">
            Build a summary to share with your doctor
          </p>
        </div>

        {/* step progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                  ${i === currentStep
                    ? "bg-purple-600 text-white"
                    : i < currentStep
                    ? "bg-purple-200 text-purple-700"
                    : "bg-gray-200 text-gray-400"}`}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block transition-colors
                  ${i === currentStep ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 transition-colors ${i < currentStep ? "bg-purple-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            goNext={goNext}
            goBack={goBack}
          />
        </div>

      </div>
    </div>
  )
}