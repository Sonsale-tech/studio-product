export interface Question {
  id: string;
  testName: string;
  qNo: number;
  q: string;
  options: [string, string, string, string]; // [A, B, C, D]
  answer: 'A' | 'B' | 'C' | 'D';
  image?: string; // Google Drive link or Image URL or base64
  explanation?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  category: string;
  durationMinutes?: number;
  questions: Question[];
}

export interface StudentSubmission {
  id: string;
  timestamp: string;
  testName: string;
  rollNo: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  studentAnswers: string[];
}

export type ActiveTab = 'runner' | 'editor' | 'code' | 'sheet' | 'guide' | 'ai-generator';
