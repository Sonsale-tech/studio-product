import React, { useState } from 'react';
import { TestSuite } from '../types';
import { generateCodeGs, generateIndexHtml, generateSheetTSV, generateSheetCSV } from '../utils/codeGenerators';
import { Copy, Check, Download, FileCode, Code2, Table, ExternalLink, Settings, Sparkles } from 'lucide-react';

interface CodeExporterProps {
  testSuites: TestSuite[];
}

type CodeTab = 'gs' | 'html' | 'sheet';

export const CodeExporter: React.FC<CodeExporterProps> = ({ testSuites }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('gs');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Customization parameters
  const [sheetName, setSheetName] = useState<string>('Questions');
  const [mainTitle, setMainTitle] = useState<string>('Semiconductor MCQ Practice Test');
  const [subTitle, setSubTitle] = useState<string>('Std. XII Physics');

  const codeGsContent = generateCodeGs(sheetName);
  const indexHtmlContent = generateIndexHtml(mainTitle, subTitle);
  const sheetTsvContent = generateSheetTSV(testSuites);
  const sheetCsvContent = generateSheetCSV(testSuites);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Code & File Generation Hub
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Export ready-to-use Google Apps Script (<code className="text-slate-700 font-mono">Code.gs</code>), frontend (<code className="text-slate-700 font-mono">index.html</code>), and Google Sheet tabular data.
          </p>
        </div>

        {/* Quick action downloads */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => handleDownload(codeGsContent, 'Code.gs', 'application/javascript')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Code.gs</span>
          </button>
          <button
            onClick={() => handleDownload(indexHtmlContent, 'index.html', 'text/html')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download index.html</span>
          </button>
          <button
            onClick={() => handleDownload(sheetCsvContent, 'Questions_Template.csv', 'text/csv')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Questions CSV</span>
          </button>
        </div>
      </div>

      {/* Configuration Strip */}
      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-xs">
        <div className="flex items-center space-x-1.5 font-bold text-slate-700 shrink-0">
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Config Parameters:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">Questions Sheet Tab Name:</span>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              className="w-full bg-white px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs text-slate-800"
            />
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">Applet Main Title:</span>
            <input
              type="text"
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              className="w-full bg-white px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
            />
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">Applet Subtitle:</span>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full bg-white px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Code Tabs */}
      <div className="mt-6">
        <div className="flex items-center space-x-2 border-b border-slate-200">
          <button
            onClick={() => setActiveCodeTab('gs')}
            className={`flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition ${
              activeCodeTab === 'gs'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>1. Code.gs (Google Apps Script Backend)</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('html')}
            className={`flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition ${
              activeCodeTab === 'html'
                ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4 text-amber-600" />
            <span>2. index.html (Student Web App UI)</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('sheet')}
            className={`flex items-center space-x-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition ${
              activeCodeTab === 'sheet'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>3. Google Sheet Data (Questions Tab)</span>
          </button>
        </div>

        {/* Tab 1: Code.gs */}
        {activeCodeTab === 'gs' && (
          <div className="mt-4 bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-2 font-mono text-xs text-slate-400">Code.gs &bull; Google Apps Script</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(codeGsContent, 'gs')}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  {copiedKey === 'gs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'gs' ? 'Copied!' : 'Copy Code.gs'}</span>
                </button>
                <button
                  onClick={() => handleDownload(codeGsContent, 'Code.gs', 'application/javascript')}
                  className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .gs</span>
                </button>
              </div>
            </div>
            <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-slate-200 p-2 max-h-[580px]">
              <code>{codeGsContent}</code>
            </pre>
          </div>
        )}

        {/* Tab 2: index.html */}
        {activeCodeTab === 'html' && (
          <div className="mt-4 bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-2 font-mono text-xs text-slate-400">index.html &bull; HTML + MathJax CSS + JS</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(indexHtmlContent, 'html')}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  {copiedKey === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'html' ? 'Copied!' : 'Copy index.html'}</span>
                </button>
                <button
                  onClick={() => handleDownload(indexHtmlContent, 'index.html', 'text/html')}
                  className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .html</span>
                </button>
              </div>
            </div>
            <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-slate-200 p-2 max-h-[580px]">
              <code>{indexHtmlContent}</code>
            </pre>
          </div>
        )}

        {/* Tab 3: Google Sheet Data */}
        {activeCodeTab === 'sheet' && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Google Sheet "Questions" Tab Structure
                </h3>
                <p className="text-xs text-slate-500">
                  Copy this tab-separated data and paste directly into Cell A1 of your Google Sheet.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(sheetTsvContent, 'tsv')}
                  className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs"
                >
                  {copiedKey === 'tsv' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'tsv' ? 'Copied TSV (Paste to Sheet)!' : 'Copy TSV for Google Sheet'}</span>
                </button>
                <button
                  onClick={() => handleDownload(sheetCsvContent, 'Questions.csv', 'text/csv')}
                  className="inline-flex items-center space-x-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {/* Visual Column Mapping Banner */}
            <div className="my-4 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950">
              <strong>9-Column Layout Specification:</strong>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 mt-2 font-mono text-[11px]">
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col A: Test Name</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col B: Q. No</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col C: Question</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col D: Option A</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col E: Option B</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col F: Option C</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col G: Option D</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col H: Answer</span>
                <span className="bg-white p-1 rounded border border-emerald-300 text-center font-bold">Col I: Image URL</span>
              </div>
            </div>

            {/* Raw TSV Preview */}
            <textarea
              readOnly
              value={sheetTsvContent}
              rows={12}
              className="w-full font-mono text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800"
            />
          </div>
        )}
      </div>
    </div>
  );
};
