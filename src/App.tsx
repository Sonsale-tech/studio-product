/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, TestSuite, StudentSubmission } from './types';
import { DEFAULT_TEST_SUITES } from './data/defaultTests';
import { Navbar } from './components/Navbar';
import { TestRunner } from './components/TestRunner';
import { TestEditor } from './components/TestEditor';
import { CodeExporter } from './components/CodeExporter';
import { SheetViewer } from './components/SheetViewer';
import { SetupGuide } from './components/SetupGuide';
import { AiQuestionGenerator } from './components/AiQuestionGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('runner');
  const [testSuites, setTestSuites] = useState<TestSuite[]>(DEFAULT_TEST_SUITES);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: 'sub-sample-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(),
      testName: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
      rollNo: 'XII-PHY-01',
      studentName: 'Aarav Patel',
      score: 5,
      totalQuestions: 5,
      percentage: 100.0,
      studentAnswers: ['A', 'C', 'C', 'B', 'C'],
    },
    {
      id: 'sub-sample-2',
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      testName: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
      rollNo: 'XII-PHY-14',
      studentName: 'Priya Verma',
      score: 4,
      totalQuestions: 5,
      percentage: 80.0,
      studentAnswers: ['A', 'C', 'A', 'B', 'C'],
    },
    {
      id: 'sub-sample-3',
      timestamp: new Date(Date.now() - 1800000).toLocaleString(),
      testName: 'Semiconductor Practice Test 2 - P-N Junction & Diodes',
      rollNo: 'XII-PHY-08',
      studentName: 'Vikram Singh',
      score: 4,
      totalQuestions: 5,
      percentage: 80.0,
      studentAnswers: ['B', 'B', 'C', 'B', 'B'],
    },
  ]);

  const handleSaveSubmission = (newSub: StudentSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const handleClearSubmissions = () => {
    if (confirm('Clear all recorded student submissions in this session?')) {
      setSubmissions([]);
    }
  };

  const totalQuestionsCount = testSuites.reduce(
    (acc, suite) => acc + suite.questions.length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        testCount={testSuites.length}
        totalQuestions={totalQuestionsCount}
        submissionCount={submissions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'runner' && (
          <TestRunner
            testSuites={testSuites}
            onSaveSubmission={handleSaveSubmission}
          />
        )}

        {activeTab === 'editor' && (
          <TestEditor
            testSuites={testSuites}
            setTestSuites={setTestSuites}
            onOpenAiGenerator={() => setActiveTab('ai-generator')}
          />
        )}

        {activeTab === 'code' && (
          <CodeExporter testSuites={testSuites} />
        )}

        {activeTab === 'sheet' && (
          <SheetViewer
            testSuites={testSuites}
            submissions={submissions}
            onClearSubmissions={handleClearSubmissions}
          />
        )}

        {activeTab === 'ai-generator' && (
          <AiQuestionGenerator
            testSuites={testSuites}
            setTestSuites={setTestSuites}
            onTestCreated={() => setActiveTab('runner')}
          />
        )}

        {activeTab === 'guide' && <SetupGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-5 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-200">
              MCQ Test Studio for Google Apps Script & Google Sheets
            </span>
            <p className="text-slate-500 mt-0.5">
              Includes Code.gs backend, responsive index.html with MathJax & KaTeX LaTeX formatting, and dynamic spreadsheet results logging.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('guide')}
              className="text-amber-400 hover:text-amber-300 font-medium transition"
            >
              Deployment Guide
            </button>
            <span className="text-slate-700">&bull;</span>
            <button
              onClick={() => setActiveTab('code')}
              className="text-slate-300 hover:text-white font-medium transition"
            >
              Export Files
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
