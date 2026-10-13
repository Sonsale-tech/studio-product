import React, { useState } from 'react';
import { TestSuite, StudentSubmission } from '../types';
import { MathText } from '../utils/latexRenderer';
import { Table, Search, Download, Trash2, FileSpreadsheet, Users, CheckCircle2 } from 'lucide-react';

interface SheetViewerProps {
  testSuites: TestSuite[];
  submissions: StudentSubmission[];
  onClearSubmissions?: () => void;
}

export const SheetViewer: React.FC<SheetViewerProps> = ({
  testSuites,
  submissions,
  onClearSubmissions,
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<string>('Questions');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Collect all questions for the "Questions" master sheet tab
  const allQuestions = testSuites.flatMap((suite) =>
    suite.questions.map((q, idx) => ({
      ...q,
      testName: suite.name,
      qNo: q.qNo || idx + 1,
    }))
  );

  // Submissions filtered for current active test result tab
  const activeTestSubmissions = submissions.filter(
    (sub) => sub.testName === activeSheetTab
  );

  const filteredSubmissions = activeTestSubmissions.filter((sub) => {
    const q = searchFilter.toLowerCase();
    return (
      sub.studentName.toLowerCase().includes(q) ||
      sub.rollNo.toLowerCase().includes(q)
    );
  });

  const handleDownloadSubmissionsCsv = (testName: string) => {
    const subs = submissions.filter((s) => s.testName === testName);
    if (subs.length === 0) {
      alert('No student submissions to export for this test.');
      return;
    }

    const header = ['Date & Time', 'Test Name', 'Roll No.', 'Student Name', 'Score', 'Total Questions', 'Percentage'];
    const rows = [header.join(',')];

    subs.forEach((s) => {
      rows.push(
        [
          `"${s.timestamp}"`,
          `"${s.testName}"`,
          `"${s.rollNo}"`,
          `"${s.studentName}"`,
          s.score,
          s.totalQuestions,
          `"${s.percentage}%"`,
        ].join(',')
      );
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Google Sheet Emulator & Live Database
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Simulating the Google Spreadsheet with the "Questions" tab and dynamic result tabs generated on student submissions.
            </p>
          </div>
        </div>

        {submissions.length > 0 && onClearSubmissions && (
          <button
            onClick={onClearSubmissions}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Submissions</span>
          </button>
        )}
      </div>

      {/* Spreadsheet Workspace Container */}
      <div className="mt-6 bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Spreadsheet Top Bar */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-bold text-slate-900">Spreadsheet:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">
              Semiconductor_MCQ_Test_Database.xlsx
            </span>
          </div>

          {activeSheetTab !== 'Questions' && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter student or roll no..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-white pl-8 pr-3 py-1 border border-slate-300 rounded-md text-xs focus:outline-none"
                />
              </div>

              <button
                onClick={() => handleDownloadSubmissionsCsv(activeSheetTab)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 transition"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Questions Table */}
        {activeSheetTab === 'Questions' && (
          <div className="overflow-x-auto max-h-[580px]">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-[#003366] text-white sticky top-0 z-10 font-bold select-none">
                <tr>
                  <th className="p-2.5 border border-slate-600 text-center w-10">#</th>
                  <th className="p-2.5 border border-slate-600 whitespace-nowrap min-w-[200px]">A: Test Name</th>
                  <th className="p-2.5 border border-slate-600 text-center whitespace-nowrap w-16">B: Q. No</th>
                  <th className="p-2.5 border border-slate-600 min-w-[260px]">C: Question</th>
                  <th className="p-2.5 border border-slate-600 min-w-[140px]">D: Option A</th>
                  <th className="p-2.5 border border-slate-600 min-w-[140px]">E: Option B</th>
                  <th className="p-2.5 border border-slate-600 min-w-[140px]">F: Option C</th>
                  <th className="p-2.5 border border-slate-600 min-w-[140px]">G: Option D</th>
                  <th className="p-2.5 border border-slate-600 text-center whitespace-nowrap w-20">H: Answer</th>
                  <th className="p-2.5 border border-slate-600 min-w-[160px]">I: Image / Drive URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allQuestions.map((q, rIdx) => (
                  <tr key={rIdx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-2 border border-slate-200 text-center font-mono text-slate-400 bg-slate-50">
                      {rIdx + 1}
                    </td>
                    <td className="p-2 border border-slate-200 font-semibold text-slate-800">
                      {q.testName}
                    </td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-slate-700">
                      {q.qNo}
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-900 leading-relaxed">
                      <MathText text={q.q} />
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-700">
                      <MathText text={q.options[0]} />
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-700">
                      <MathText text={q.options[1]} />
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-700">
                      <MathText text={q.options[2]} />
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-700">
                      <MathText text={q.options[3]} />
                    </td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-emerald-700 bg-emerald-50/50">
                      {q.answer}
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-500 font-mono truncate max-w-[180px]">
                      {q.image || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2+: Dynamic Test Result Tabs */}
        {activeSheetTab !== 'Questions' && (
          <div className="overflow-x-auto min-h-[320px]">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">No student submissions recorded for this test yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Run the test in the "Live Test Runner" tab and submit to see results automatically populated here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead className="bg-[#003366] text-white sticky top-0 font-bold select-none">
                  <tr>
                    <th className="p-2.5 border border-slate-600 text-center w-10">#</th>
                    <th className="p-2.5 border border-slate-600 min-w-[150px]">Date & Time</th>
                    <th className="p-2.5 border border-slate-600 min-w-[180px]">Test Name</th>
                    <th className="p-2.5 border border-slate-600 min-w-[120px]">Roll No.</th>
                    <th className="p-2.5 border border-slate-600 min-w-[160px]">Student Name</th>
                    <th className="p-2.5 border border-slate-600 text-center w-20">Score</th>
                    <th className="p-2.5 border border-slate-600 text-center w-24">Total Questions</th>
                    <th className="p-2.5 border border-slate-600 text-center w-24">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSubmissions.map((sub, sIdx) => (
                    <tr key={sub.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="p-2 border border-slate-200 text-center font-mono text-slate-400 bg-slate-50">
                        {sIdx + 1}
                      </td>
                      <td className="p-2 border border-slate-200 text-slate-600 font-mono">
                        {sub.timestamp}
                      </td>
                      <td className="p-2 border border-slate-200 font-medium text-slate-800">
                        {sub.testName}
                      </td>
                      <td className="p-2 border border-slate-200 font-bold text-[#003366]">
                        {sub.rollNo}
                      </td>
                      <td className="p-2 border border-slate-200 font-semibold text-slate-900">
                        {sub.studentName}
                      </td>
                      <td className="p-2 border border-slate-200 text-center font-bold text-blue-700">
                        {sub.score}
                      </td>
                      <td className="p-2 border border-slate-200 text-center text-slate-600">
                        {sub.totalQuestions}
                      </td>
                      <td className="p-2 border border-slate-200 text-center font-bold text-emerald-700 bg-emerald-50/50">
                        {sub.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Bottom Sheet Tab Bar (mimics Google Sheets bottom tabs) */}
        <div className="bg-slate-200 border-t border-slate-300 p-1 flex items-center space-x-1 overflow-x-auto select-none">
          <button
            onClick={() => setActiveSheetTab('Questions')}
            className={`px-3 py-1.5 rounded-t font-semibold text-xs transition flex items-center space-x-1.5 shrink-0 ${
              activeSheetTab === 'Questions'
                ? 'bg-white text-emerald-700 font-bold shadow-xs border-t-2 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-300'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Questions (Master Bank)</span>
          </button>

          {testSuites.map((suite) => {
            const count = submissions.filter((s) => s.testName === suite.name).length;
            const isActive = activeSheetTab === suite.name;
            return (
              <button
                key={suite.id}
                onClick={() => setActiveSheetTab(suite.name)}
                className={`px-3 py-1.5 rounded-t text-xs transition flex items-center space-x-1.5 shrink-0 ${
                  isActive
                    ? 'bg-white text-blue-800 font-bold shadow-xs border-t-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-300 font-medium'
                }`}
              >
                <span>{suite.name}</span>
                {count > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
