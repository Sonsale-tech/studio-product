import React from 'react';
import { BookOpen, CheckCircle, ExternalLink, AlertTriangle, Layers, FileSpreadsheet, Globe, Image, HelpCircle } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Create Google Sheet & "Questions" Tab',
      description:
        'Open Google Sheets (sheets.new) and rename the first sheet tab to exactly "Questions".',
      details: [
        'Add 9 columns in row 1 (Bold headers):',
        'Col A: Test Name | Col B: Q. No. | Col C: Question | Col D: Option A | Col E: Option B | Col F: Option C | Col G: Option D | Col H: Correct Answer | Col I: Image / Google Drive URL',
        'Tip: Use the "Copy TSV for Google Sheet" button in the Code Generator tab and paste into cell A1 directly.',
      ],
    },
    {
      number: '2',
      title: 'Open Google Apps Script Editor',
      description: 'Inside your Google Sheet, open the Extensions menu and select Apps Script.',
      details: [
        'Click on "Extensions" > "Apps Script" in the top menu bar.',
        'In the editor, open the default file named Code.gs.',
        'Delete any default boilerplate and paste the entire Code.gs generated in this studio.',
        'Press Ctrl+S (or Cmd+S) to save the file.',
      ],
    },
    {
      number: '3',
      title: 'Create the "index.html" File in Apps Script',
      description: 'Add the HTML user interface file in your Apps Script project.',
      details: [
        'In the Apps Script left sidebar, click the "+" (Add a file) icon next to Files.',
        'Select "HTML" and name the file exactly "index" (Apps Script will add .html automatically).',
        'Paste the entire index.html content generated in this studio.',
        'Press Ctrl+S to save.',
      ],
    },
    {
      number: '4',
      title: 'Deploy as Web App',
      description: 'Publish your interactive test portal so students can access it.',
      details: [
        'Click the blue "Deploy" button at the top right > "New deployment".',
        'Click the gear icon (Select type) > Choose "Web app".',
        'Description: e.g. "Semiconductor MCQ Test v1.0"',
        'Execute as: "Me (your email)"',
        'Who has access: "Anyone" (allows all students to take the test without requiring script editing rights).',
        'Click "Deploy", authorize Google permissions, and copy your live Web App URL!',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Deployment & Setup Tutorial
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Step-by-step instructions to deploy your Google Sheet and Google Apps Script MCQ online testing system.
            </p>
          </div>
        </div>
      </div>

      {/* Main Steps */}
      <div className="mt-8 space-y-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003366] text-white font-black text-lg flex items-center justify-center shrink-0">
              {step.number}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{step.description}</p>

              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                {step.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Guides: Google Drive Images & LaTeX Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Drive Image Guide */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-blue-900 font-bold mb-3">
            <Image className="w-5 h-5 text-blue-600" />
            <h4 className="text-base font-bold">Google Drive Image Linking Guide</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            To display circuit diagrams, graphs, or truth tables in test questions:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
            <li>Upload diagram to Google Drive.</li>
            <li>Right click &gt; Share &gt; Change General access to <strong>"Anyone with the link can view"</strong>.</li>
            <li>Copy link (e.g. <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">https://drive.google.com/file/d/FILE_ID/view</code>).</li>
            <li>Paste either the whole link or just the <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">FILE_ID</code> in Column I of your Sheet.</li>
            <li>The script automatically converts it into a base64 image data URI securely.</li>
          </ol>
        </div>

        {/* LaTeX Math Guide */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-purple-900 font-bold mb-3">
            <Layers className="w-5 h-5 text-purple-600" />
            <h4 className="text-base font-bold">LaTeX / MathJax Syntax Quick Reference</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Format math, chemical formulas, and physics quantities in questions and options:
          </p>
          <div className="space-y-1.5 text-xs font-mono text-slate-700 bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
            <div className="flex justify-between border-b border-purple-100 pb-1">
              <span>Band Gap:</span>
              <code className="text-purple-700 font-bold">{'\\(E_g = 1.1\\text{ eV}\\)'}</code>
            </div>
            <div className="flex justify-between border-b border-purple-100 pb-1">
              <span>Fractions:</span>
              <code className="text-purple-700 font-bold">{'\\(\\frac{I_C}{I_B}\\)'}</code>
            </div>
            <div className="flex justify-between border-b border-purple-100 pb-1">
              <span>Subscripts:</span>
              <code className="text-purple-700 font-bold">{'\\(n_e \\cdot n_h = n_i^2\\)'}</code>
            </div>
            <div className="flex justify-between border-b border-purple-100 pb-1">
              <span>Greek Letters:</span>
              <code className="text-purple-700 font-bold">{'\\(\\alpha, \\beta, \\Delta, \\nu, \\Omega\\)'}</code>
            </div>
            <div className="flex justify-between">
              <span>Boolean Bar:</span>
              <code className="text-purple-700 font-bold">{'\\(\\overline{A \\cdot B}\\)'}</code>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-8 bg-slate-900 text-slate-100 rounded-2xl p-6">
        <h4 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Frequently Asked Questions</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="font-bold text-amber-300 block mb-1">
              Q: Where are student results saved?
            </span>
            <p className="text-slate-300">
              When a student submits, Google Apps Script automatically creates a new tab with the exact test name (e.g. "Semiconductor Practice Test 1") and appends a new row with timestamp, student name, roll no, score, and percentage.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="font-bold text-amber-300 block mb-1">
              Q: How do I add new tests or modify existing ones?
            </span>
            <p className="text-slate-300">
              Simply add new rows in your "Questions" Google Sheet tab with a new Test Name in Column A. The web app automatically fetches all test names in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
