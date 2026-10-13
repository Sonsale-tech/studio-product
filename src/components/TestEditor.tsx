import React, { useState } from 'react';
import { TestSuite, Question } from '../types';
import { MathText } from '../utils/latexRenderer';
import { Plus, Trash2, Edit3, Image, Sparkles, MoveUp, MoveDown, Check, Download, Upload, Eye } from 'lucide-react';

interface TestEditorProps {
  testSuites: TestSuite[];
  setTestSuites: React.Dispatch<React.SetStateAction<TestSuite[]>>;
  onOpenAiGenerator?: () => void;
}

export const TestEditor: React.FC<TestEditorProps> = ({
  testSuites,
  setTestSuites,
  onOpenAiGenerator,
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(testSuites[0]?.id || '');
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newTestModalOpen, setNewTestModalOpen] = useState<boolean>(false);
  const [newTestName, setNewTestName] = useState<string>('');
  const [newTestDesc, setNewTestDesc] = useState<string>('');

  // Active question form state
  const [formQText, setFormQText] = useState<string>('');
  const [formOptA, setFormOptA] = useState<string>('');
  const [formOptB, setFormOptB] = useState<string>('');
  const [formOptC, setFormOptC] = useState<string>('');
  const [formOptD, setFormOptD] = useState<string>('');
  const [formAnswer, setFormAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [formImage, setFormImage] = useState<string>('');
  const [formExplanation, setFormExplanation] = useState<string>('');

  const currentTest = testSuites.find((t) => t.id === selectedTestId) || testSuites[0];

  // Helper to insert LaTeX symbol into current active question textarea
  const insertLatexSnippet = (snippet: string) => {
    setFormQText((prev) => prev + snippet);
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;

    const newSuite: TestSuite = {
      id: `test-${Date.now()}`,
      name: newTestName.trim(),
      description: newTestDesc.trim() || 'Custom test generated via editor',
      category: 'General Physics',
      questions: [],
    };

    setTestSuites((prev) => [...prev, newSuite]);
    setSelectedTestId(newSuite.id);
    setNewTestName('');
    setNewTestDesc('');
    setNewTestModalOpen(false);
  };

  const handleDeleteTest = (testId: string) => {
    if (testSuites.length <= 1) {
      alert('You must have at least one test in the question bank.');
      return;
    }
    if (confirm('Are you sure you want to delete this test?')) {
      const remaining = testSuites.filter((t) => t.id !== testId);
      setTestSuites(remaining);
      setSelectedTestId(remaining[0].id);
    }
  };

  const openAddQuestion = () => {
    setFormQText('');
    setFormOptA('');
    setFormOptB('');
    setFormOptC('');
    setFormOptD('');
    setFormAnswer('A');
    setFormImage('');
    setFormExplanation('');
    setEditingQuestionId(null);
    setIsAddingQuestion(true);
  };

  const openEditQuestion = (q: Question) => {
    setFormQText(q.q);
    setFormOptA(q.options[0] || '');
    setFormOptB(q.options[1] || '');
    setFormOptC(q.options[2] || '');
    setFormOptD(q.options[3] || '');
    setFormAnswer(q.answer);
    setFormImage(q.image || '');
    setFormExplanation(q.explanation || '');
    setEditingQuestionId(q.id);
    setIsAddingQuestion(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTest) return;

    if (!formQText.trim()) {
      alert('Please enter question text.');
      return;
    }
    if (!formOptA.trim() || !formOptB.trim() || !formOptC.trim() || !formOptD.trim()) {
      alert('Please fill out all 4 options (A, B, C, and D).');
      return;
    }

    if (editingQuestionId) {
      // Edit existing
      setTestSuites((prev) =>
        prev.map((t) => {
          if (t.id !== currentTest.id) return t;
          return {
            ...t,
            questions: t.questions.map((q) => {
              if (q.id !== editingQuestionId) return q;
              return {
                ...q,
                q: formQText.trim(),
                options: [formOptA.trim(), formOptB.trim(), formOptC.trim(), formOptD.trim()],
                answer: formAnswer,
                image: formImage.trim() || undefined,
                explanation: formExplanation.trim() || undefined,
              };
            }),
          };
        })
      );
    } else {
      // Add new
      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        testName: currentTest.name,
        qNo: currentTest.questions.length + 1,
        q: formQText.trim(),
        options: [formOptA.trim(), formOptB.trim(), formOptC.trim(), formOptD.trim()],
        answer: formAnswer,
        image: formImage.trim() || undefined,
        explanation: formExplanation.trim() || undefined,
      };

      setTestSuites((prev) =>
        prev.map((t) => {
          if (t.id !== currentTest.id) return t;
          return {
            ...t,
            questions: [...t.questions, newQuestion],
          };
        })
      );
    }

    setIsAddingQuestion(false);
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!currentTest) return;
    if (confirm('Delete this question?')) {
      setTestSuites((prev) =>
        prev.map((t) => {
          if (t.id !== currentTest.id) return t;
          const updatedQs = t.questions
            .filter((q) => q.id !== qId)
            .map((q, idx) => ({ ...q, qNo: idx + 1 }));
          return {
            ...t,
            questions: updatedQs,
          };
        })
      );
    }
  };

  const handleMoveQuestion = (qIndex: number, direction: 'up' | 'down') => {
    if (!currentTest) return;
    const questions = [...currentTest.questions];
    const targetIndex = direction === 'up' ? qIndex - 1 : qIndex + 1;

    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const temp = questions[qIndex];
    questions[qIndex] = questions[targetIndex];
    questions[targetIndex] = temp;

    // re-index qNo
    const reindexed = questions.map((q, idx) => ({ ...q, qNo: idx + 1 }));

    setTestSuites((prev) =>
      prev.map((t) => (t.id === currentTest.id ? { ...t, questions: reindexed } : t))
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top action header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Test & Question Builder</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage test suites, add LaTeX equations, insert Google Drive images, and structure your Google Sheet question bank.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {onOpenAiGenerator && (
            <button
              onClick={onOpenAiGenerator}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Question Generator</span>
            </button>
          )}

          <button
            onClick={() => setNewTestModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Test</span>
          </button>
        </div>
      </div>

      {/* Main layout: Test Selector Tabs + Question Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Left column: Tests list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Tests ({testSuites.length})
            </span>
          </div>

          <div className="space-y-2">
            {testSuites.map((test) => {
              const isSelected = test.id === selectedTestId;
              return (
                <div
                  key={test.id}
                  onClick={() => {
                    setSelectedTestId(test.id);
                    setIsAddingQuestion(false);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-left ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {test.questions.length} Qs
                    </span>
                    {testSuites.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTest(test.id);
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete test"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm mt-2 line-clamp-2">
                    {test.name}
                  </h4>
                  {test.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{test.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Questions editor */}
        <div className="lg:col-span-3">
          {currentTest && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              {/* Test Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentTest.name}</h3>
                  <p className="text-xs text-slate-500">{currentTest.description}</p>
                </div>

                <button
                  onClick={openAddQuestion}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#003366] hover:bg-[#005599] text-white font-bold text-xs transition shadow-xs self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              {/* Question Add/Edit Form */}
              {isAddingQuestion && (
                <form
                  onSubmit={handleSaveQuestion}
                  className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingQuestion(false)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Math / LaTeX Quick Snippets */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Quick LaTeX Equation Snippets (Click to insert):
                    </label>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {[
                        { label: 'Band Gap (Eg)', code: '\\(E_g = 1.1\\text{ eV}\\)' },
                        { label: 'Fraction', code: '\\(\\frac{A}{B}\\)' },
                        { label: 'Current Gain (β)', code: '\\(\\beta = \\frac{\\Delta I_C}{\\Delta I_B}\\)' },
                        { label: 'Alpha (α)', code: '\\(\\alpha = 0.98\\)' },
                        { label: 'Mass Action', code: '\\(n_e \\cdot n_h = n_i^2\\)' },
                        { label: 'Square Root', code: '\\(\\sqrt{x}\\)' },
                        { label: 'Ohm (Ω)', code: '\\(100\\ \\Omega\\)' },
                        { label: 'Temperature (T)', code: '\\(T = 300\\text{ K}\\)' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertLatexSnippet(` ${item.code} `)}
                          className="px-2 py-1 bg-white border border-slate-300 hover:border-slate-400 rounded text-slate-700 text-xs font-mono"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Question Text (Supports LaTeX: <code className="text-blue-600">\( ... \)</code> or <code className="text-blue-600">$ ... $</code>)
                    </label>
                    <textarea
                      value={formQText}
                      onChange={(e) => setFormQText(e.target.value)}
                      rows={3}
                      placeholder="e.g. What is the approximate energy band gap \(E_g\) for Silicon at \(300\text{ K}\)?"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />

                    {/* Live Preview */}
                    {formQText && (
                      <div className="mt-2 p-2.5 bg-white rounded border border-slate-200 text-xs text-slate-800">
                        <span className="font-bold text-slate-500 block mb-1">Live Render Preview:</span>
                        <MathText text={formQText} />
                      </div>
                    )}
                  </div>

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option A</label>
                      <input
                        type="text"
                        value={formOptA}
                        onChange={(e) => setFormOptA(e.target.value)}
                        placeholder="Option A content or formula"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option B</label>
                      <input
                        type="text"
                        value={formOptB}
                        onChange={(e) => setFormOptB(e.target.value)}
                        placeholder="Option B content or formula"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option C</label>
                      <input
                        type="text"
                        value={formOptC}
                        onChange={(e) => setFormOptC(e.target.value)}
                        placeholder="Option C content or formula"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option D</label>
                      <input
                        type="text"
                        value={formOptD}
                        onChange={(e) => setFormOptD(e.target.value)}
                        placeholder="Option D content or formula"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Correct Answer & Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Correct Answer Key
                      </label>
                      <select
                        value={formAnswer}
                        onChange={(e) => setFormAnswer(e.target.value as 'A' | 'B' | 'C' | 'D')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold bg-white"
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Optional Diagram URL (Google Drive link or Image URL)
                      </label>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://drive.google.com/file/d/FILE_ID/view or URL"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Optional Solution Explanation (Shown in review)
                    </label>
                    <input
                      type="text"
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      placeholder="e.g. Energy band gap in Si is 1.1 eV and Ge is 0.72 eV at 300K."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingQuestion(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      {editingQuestionId ? 'Update Question' : 'Save Question'}
                    </button>
                  </div>
                </form>
              )}

              {/* Questions List */}
              <div className="mt-6 space-y-4">
                {currentTest.questions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                    <p className="text-sm">No questions in this test yet.</p>
                    <button
                      onClick={openAddQuestion}
                      className="mt-3 text-xs font-bold text-[#003366] hover:underline"
                    >
                      + Add the first question
                    </button>
                  </div>
                ) : (
                  currentTest.questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 transition bg-white"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-3">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="text-sm text-slate-900 font-medium">
                            <MathText text={q.q} />
                          </div>
                        </div>

                        {/* Reorder and Action buttons */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => handleMoveQuestion(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveQuestion(idx, 'down')}
                            disabled={idx === currentTest.questions.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditQuestion(q)}
                            className="p-1 text-slate-500 hover:text-blue-600 ml-1"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image preview */}
                      {q.image && (
                        <div className="mt-3 pl-9">
                          <img
                            src={q.image}
                            alt="Diagram"
                            className="max-h-36 rounded border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Options grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-9">
                        {q.options.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isCorrect = letter === q.answer;
                          return (
                            <div
                              key={optIdx}
                              className={`p-2 rounded text-xs flex items-start space-x-1.5 ${
                                isCorrect
                                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold'
                                  : 'bg-slate-50 border border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="font-mono font-bold">{letter}.</span>
                              <MathText text={opt} />
                              {isCorrect && (
                                <span className="ml-auto text-emerald-700 font-bold text-[10px]">
                                  (KEY)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="mt-2.5 pl-9 text-xs text-slate-500 italic">
                          Explanation: {q.explanation}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Test Modal */}
      {newTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Create New Practice Test</h3>
            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Test Title / Topic
                </label>
                <input
                  type="text"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  placeholder="e.g. Semiconductor Practice Test 4 - Optoelectronic Devices"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newTestDesc}
                  onChange={(e) => setNewTestDesc(e.target.value)}
                  placeholder="e.g. Photodiode, Solar cell, and LED characteristics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTestModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-[#005599] text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
