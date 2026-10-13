import React from 'react';
import { PlayCircle, FileCode, Table, Sparkles, BookOpen, PenTool } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  testCount: number;
  totalQuestions: number;
  submissionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  testCount,
  totalQuestions,
  submissionCount,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'runner',
      label: 'Live Test Runner',
      icon: <PlayCircle className="w-4 h-4" />,
      badge: `${testCount} Tests`,
    },
    {
      id: 'editor',
      label: 'Test & Question Builder',
      icon: <PenTool className="w-4 h-4" />,
      badge: `${totalQuestions} Qs`,
    },
    {
      id: 'code',
      label: 'Code.gs & index.html Files',
      icon: <FileCode className="w-4 h-4" />,
    },
    {
      id: 'sheet',
      label: 'Google Sheet & Results',
      icon: <Table className="w-4 h-4" />,
      badge: submissionCount > 0 ? `${submissionCount} Submissions` : undefined,
    },
    {
      id: 'ai-generator',
      label: 'AI Question Generator',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'guide',
      label: 'Setup & Deployment Guide',
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow">
              ∑
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">MCQ Test Studio</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-medium px-2 py-0.5 rounded border border-amber-500/30">
                  Google Apps Script
                </span>
              </div>
              <p className="text-xs text-slate-400">Class XII Physics • LaTeX Equations • Google Drive Diagrams</p>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 space-x-2 scrollbar-none border-t border-slate-800/80">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-300 bg-slate-800/70 hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
