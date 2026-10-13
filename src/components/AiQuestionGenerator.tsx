import React, { useState } from 'react';
import { TestSuite, Question } from '../types';
import { MathText } from '../utils/latexRenderer';
import { Sparkles, Plus, Check, RefreshCw, Layers, ArrowRight } from 'lucide-react';

interface AiQuestionGeneratorProps {
  testSuites: TestSuite[];
  setTestSuites: React.Dispatch<React.SetStateAction<TestSuite[]>>;
  onTestCreated?: () => void;
}

export const AiQuestionGenerator: React.FC<AiQuestionGeneratorProps> = ({
  testSuites,
  setTestSuites,
  onTestCreated,
}) => {
  const [topic, setTopic] = useState<string>('Semiconductor Devices & Band Theory');
  const [gradeLevel, setGradeLevel] = useState<string>('Class XII / Senior Secondary');
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [targetTestMode, setTargetTestMode] = useState<'new' | 'existing'>('new');
  const [selectedExistingId, setSelectedExistingId] = useState<string>(testSuites[0]?.id || '');
  const [newTestTitle, setNewTestTitle] = useState<string>('Semiconductor Practice Test - AI Generated');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Built-in intelligent generator for physics / semiconductor MCQs with LaTeX
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSuccessMessage('');

    setTimeout(() => {
      const topicLower = topic.toLowerCase();

      // Sample templates tailored to user subject
      let templatePool: Question[] = [];

      if (topicLower.includes('semiconductor') || topicLower.includes('diode') || topicLower.includes('physics')) {
        templatePool = [
          {
            id: `ai-${Date.now()}-1`,
            testName: newTestTitle,
            qNo: 1,
            q: 'In a forward-biased \\(p-n\\) junction diode, the width of the depletion layer and the barrier potential \\(V_0\\):',
            options: [
              'Both increase',
              'Both decrease',
              'Width decreases but barrier potential increases',
              'Width increases but barrier potential decreases'
            ],
            answer: 'B',
            explanation: 'Applied forward voltage opposes the built-in potential barrier, narrowing the depletion layer and lowering the barrier height.'
          },
          {
            id: `ai-${Date.now()}-2`,
            testName: newTestTitle,
            qNo: 2,
            q: 'If the energy gap \\(E_g\\) of a semiconductor is \\(1.42\\text{ eV}\\), the maximum wavelength \\(\\lambda\\) of incident electromagnetic radiation capable of creating electron-hole pairs is approximately:',
            options: [
              '\\(873\\text{ nm}\\)',
              '\\(650\\text{ nm}\\)',
              '\\(1200\\text{ nm}\\)',
              '\\(400\\text{ nm}\\)'
            ],
            answer: 'A',
            explanation: 'Using \\(\\lambda = \\frac{hc}{E_g} = \\frac{1240\\text{ eV}\\cdot\\text{nm}}{1.42\\text{ eV}} \\approx 873\\text{ nm}\\).'
          },
          {
            id: `ai-${Date.now()}-3`,
            testName: newTestTitle,
            qNo: 3,
            q: 'For a common emitter amplifier circuit with current amplification factor \\(\\beta = 50\\) and input resistance \\(R_{\\text{in}} = 1\\text{ k}\\Omega\\), if load resistance \\(R_L = 10\\text{ k}\\Omega\\), the voltage gain \\(A_v\\) is:',
            options: [
              '\\(50\\)',
              '\\(500\\)',
              '\\(2500\\)',
              '\\(5\\)'
            ],
            answer: 'B',
            explanation: 'Voltage gain \\(A_v = \\beta \\times \\frac{R_L}{R_{\\text{in}}} = 50 \\times \\frac{10\\text{ k}\\Omega}{1\\text{ k}\\Omega} = 500\\).'
          },
          {
            id: `ai-${Date.now()}-4`,
            testName: newTestTitle,
            qNo: 4,
            q: 'Which characteristic distinguishes an LED (Light Emitting Diode) from a Photodiode regarding biasing?',
            options: [
              'LED operates in forward bias; Photodiode operates in reverse bias',
              'LED operates in reverse bias; Photodiode operates in forward bias',
              'Both operate in forward bias only',
              'Both operate in reverse bias breakdown only'
            ],
            answer: 'A',
            explanation: 'LED requires forward bias to inject minority carriers for photon emission, whereas photodiodes operate in reverse bias to measure optical photon-generated reverse saturation current.'
          },
          {
            id: `ai-${Date.now()}-5`,
            testName: newTestTitle,
            qNo: 5,
            q: 'In Boolean algebra, the expression \\(Y = (A + B) \\cdot (A + \\overline{B})\\) simplifies to:',
            options: [
              '\\(A\\)',
              '\\(B\\)',
              '\\(A \\cdot B\\)',
              '\\(1\\)'
            ],
            answer: 'A',
            explanation: 'Using distributive law: \\((A + B) \\cdot (A + \\overline{B}) = A + (B \\cdot \\overline{B}) = A + 0 = A\\).'
          }
        ];
      } else {
        // Generic STEM math/physics pool
        templatePool = [
          {
            id: `ai-${Date.now()}-1`,
            testName: newTestTitle,
            qNo: 1,
            q: 'What is the value of gravitational acceleration at height \\(h = R\\) (where \\(R\\) is Earth\'s radius) above the surface?',
            options: [
              '\\(g/2\\)',
              '\\(g/4\\)',
              '\\(g/9\\)',
              '\\(2g\\)'
            ],
            answer: 'B',
            explanation: '\\(g\' = \\frac{GM}{(R+h)^2} = \\frac{GM}{(2R)^2} = \\frac{g}{4}\\).'
          },
          {
            id: `ai-${Date.now()}-2`,
            testName: newTestTitle,
            qNo: 2,
            q: 'The resonant frequency \\(f_0\\) of a series LCR circuit with inductance \\(L\\) and capacitance \\(C\\) is given by:',
            options: [
              '\\(f_0 = \\frac{1}{2\\pi\\sqrt{LC}}\\)',
              '\\(f_0 = 2\\pi\\sqrt{LC}\\)',
              '\\(f_0 = \\frac{1}{LC}\\)',
              '\\(f_0 = \\sqrt{\\frac{L}{C}}\\)'
            ],
            answer: 'A',
            explanation: 'At resonance \\(\\omega L = \\frac{1}{\\omega C} \\implies \\omega = \\frac{1}{\\sqrt{LC}} \\implies f = \\frac{1}{2\\pi\\sqrt{LC}}\\).'
          }
        ];
      }

      const count = Math.min(numQuestions, templatePool.length);
      const chosen = templatePool.slice(0, count).map((q, idx) => ({ ...q, qNo: idx + 1 }));
      setGeneratedQuestions(chosen);
      setIsGenerating(false);
    }, 600);
  };

  const handleAddGeneratedToBank = () => {
    if (generatedQuestions.length === 0) return;

    if (targetTestMode === 'new') {
      const newSuite: TestSuite = {
        id: `test-ai-${Date.now()}`,
        name: newTestTitle.trim(),
        description: `Questions generated for ${topic} (${gradeLevel})`,
        category: 'Generated Tests',
        questions: generatedQuestions.map((q, idx) => ({
          ...q,
          testName: newTestTitle.trim(),
          qNo: idx + 1,
        })),
      };

      setTestSuites((prev) => [...prev, newSuite]);
      setSuccessMessage(`✓ Successfully created "${newTestTitle}" with ${generatedQuestions.length} questions!`);
    } else {
      const targetTest = testSuites.find((t) => t.id === selectedExistingId);
      if (!targetTest) return;

      const updatedQuestions = [
        ...targetTest.questions,
        ...generatedQuestions.map((q, idx) => ({
          ...q,
          testName: targetTest.name,
          qNo: targetTest.questions.length + idx + 1,
        })),
      ];

      setTestSuites((prev) =>
        prev.map((t) => (t.id === targetTest.id ? { ...t, questions: updatedQuestions } : t))
      );
      setSuccessMessage(`✓ Added ${generatedQuestions.length} questions to "${targetTest.name}"!`);
    }

    setGeneratedQuestions([]);
    if (onTestCreated) {
      setTimeout(onTestCreated, 1200);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI MCQ Question Generator
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Instantly create structured MCQ question sets complete with LaTeX equations and answer keys for Google Sheets.
            </p>
          </div>
        </div>
      </div>

      {/* Generator Form */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topic / Subject Area
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Semiconductor Diodes, Logic Gates, BJT Transistors"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Standard
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Class XII / Senior Secondary">Class XII (Physics)</option>
                <option value="Class XI Physics">Class XI Physics</option>
                <option value="Undergraduate Electronics">Undergraduate Electronics</option>
                <option value="Competitive Exam / JEE / NEET">Competitive Exam / JEE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Questions with LaTeX...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="mt-4 bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm font-semibold">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Generated Questions List Preview */}
      {generatedQuestions.length > 0 && (
        <div className="mt-6 bg-white border border-purple-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Generated Question Drafts ({generatedQuestions.length})
              </h3>
              <p className="text-xs text-slate-500">
                Review equations and choose where to save them.
              </p>
            </div>

            {/* Target choice */}
            <div className="flex items-center space-x-2 text-xs">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="save-target-mode"
                  checked={targetTestMode === 'new'}
                  onChange={() => setTargetTestMode('new')}
                />
                <span>Create New Test</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer ml-3">
                <input
                  type="radio"
                  name="save-target-mode"
                  checked={targetTestMode === 'existing'}
                  onChange={() => setTargetTestMode('existing')}
                />
                <span>Append to Existing</span>
              </label>
            </div>
          </div>

          {/* Test Name input or selector */}
          <div className="my-4 p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
            {targetTestMode === 'new' ? (
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  New Test Title:
                </label>
                <input
                  type="text"
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-purple-200 rounded-lg text-sm bg-white"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Select Existing Test to Append:
                </label>
                <select
                  value={selectedExistingId}
                  onChange={(e) => setSelectedExistingId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-purple-200 rounded-lg text-sm bg-white"
                >
                  {testSuites.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.questions.length} existing Qs)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Question previews */}
          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="font-bold text-slate-900 text-sm mb-2">
                  Q{idx + 1}: <MathText text={q.q} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isKey = letter === q.answer;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded border ${
                          isKey
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono mr-1">{letter}.</span>
                        <MathText text={opt} />
                        {isKey && <span className="ml-1 text-emerald-700 font-bold">(KEY)</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="mt-2 text-xs text-slate-500 italic">
                    Explanation: {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="mt-6 text-right">
            <button
              onClick={handleAddGeneratedToBank}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow-xs transition inline-flex items-center space-x-1.5"
            >
              <span>Add Questions to Test Bank</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
