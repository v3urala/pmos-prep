# PMOS Appointment Prep

A web app that helps people with suspected PMOS (Polyendocrine Metabolic Ovarian Syndrome) prepare for a doctor's appointment. Instead of walking in with a vague list of symptoms, users walk out with a structured, AI-generated summary their GP can actually use.

## Why this exists

Most people with suspected PMOS spend years undiagnosed — partly because symptoms are easy to dismiss in isolation, and partly because a 10-minute GP appointment doesn't leave room to articulate a complex, multi-system symptom pattern clearly. This tool structures that conversation before it happens.

## What it does

- **Basic information about you** - details such as age and ethnicity that can factor into the diagnosis
- **Cycle log** — track the last 3–6 cycles with length, cramp severity, and notes. Flags irregular cycles and visualises patterns over time
- **Lifestyle context** — captures sleep, stress, exercise, and diet, which directly influence hormonal health and inform the doctor's recommendations
- **Family history** — records first-degree family conditions like PCOS, type 2 diabetes, thyroid conditions, and insulin resistance — one of the most overlooked but clinically significant inputs
- **Symptom selector** — categorised by reproductive, metabolic, dermatological, and psychological — with severity, duration, and progression per symptom
- **AI-generated summary** — sends the full profile to Gemini and returns a plain-English symptom summary, 5–6 specific questions to ask the doctor, and 3–4 tests to request
- **Print to PDF** — clean one-page output the user can hand to their GP

## Tech stack

- React + Vite
- Tailwind CSS
- Chart.js via react-chartjs-2
- Google Gemini API

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/pmos-prep.git
cd pmos-prep
npm install
```

Create a `.env` file in the root:

VITE_GEMINI_API_KEY=your_gemini_api_key_here

Then run:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Important

This tool is for appointment preparation only. It does not provide medical diagnoses or advice. Always consult a qualified healthcare professional. This currently does not store any personal identifying information. It runs on the context provided in a session.

## What's next

- Lab results interpreter — enter your hormone panel numbers and get a plain-English breakdown
- Save and restore session data