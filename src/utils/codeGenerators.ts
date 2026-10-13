import { TestSuite } from '../types';

/**
 * Generates the clean Code.gs file for Google Apps Script
 */
export function generateCodeGs(sheetName = 'Questions'): string {
  return `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - MCQ ONLINE TEST ENGINE (Code.gs)
 * =========================================================================
 * Description: Backend script for hosting online MCQ tests via Google Sheets.
 * Features:
 *  - Serves responsive HTML5 Web App with MathJax LaTeX equation rendering
 *  - Loads all test categories dynamically from the "${sheetName}" sheet
 *  - Fetches questions, options, answers, and optional Google Drive diagrams
 *  - Automatically generates dedicated result tabs for each test and logs student scores
 *
 * Deployment:
 *  1. Open your Google Sheet > Extensions > Apps Script
 *  2. Replace Code.gs with this code
 *  3. Create an HTML file named "index" and paste the index.html code
 *  4. Click Deploy > New deployment > Select type: Web App
 *  5. Execute as: "Me" | Who has access: "Anyone"
 * =========================================================================
 */

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('Semiconductor MCQ Practice Test')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/* =====================================================
   GET ALL UNIQUE TEST NAMES
===================================================== */
function getTestNames() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("${sheetName}");

  if (!sheet) {
    throw new Error(
      'Questions sheet not found. Please create a sheet named "${sheetName}".'
    );
  }

  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  var tests = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i] || data[i].length === 0) continue;
    var testName = String(data[i][0] || "").trim();

    if (
      testName !== "" &&
      tests.indexOf(testName) === -1
    ) {
      tests.push(testName);
    }
  }

  return tests;
}

/* =====================================================
   GET QUESTIONS FOR A SELECTED TEST
===================================================== */
function getQuestions(testName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("${sheetName}");

  if (!sheet) {
    throw new Error(
      'Questions sheet not found. Please create a sheet named "${sheetName}".'
    );
  }

  var data = sheet.getDataRange().getValues();
  var questions = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i] || data[i].length === 0) continue;

    var rowTestName = String(data[i][0] || "").trim();

    if (rowTestName === String(testName).trim()) {
      var imageData = "";

      // Column I (Index 8): Google Drive image URL, ID, or direct image link
      if (data[i].length > 8 && String(data[i][8] || "").trim() !== "") {
        var rawImage = String(data[i][8]).trim();
        var fileId = extractDriveFileId(rawImage);

        if (fileId !== "" && !rawImage.startsWith("http://") && !rawImage.startsWith("https://") && !rawImage.startsWith("data:")) {
          try {
            imageData = getDriveImageData(fileId);
          } catch (error) {
            imageData = "";
          }
        } else if (fileId !== "" && (rawImage.includes("drive.google.com") || rawImage.includes("drive.usercontent"))) {
          try {
            imageData = getDriveImageData(fileId);
          } catch (error) {
            // Fallback to direct web link
            imageData = rawImage;
          }
        } else {
          imageData = rawImage;
        }
      }

      questions.push({
        qNo: data[i][1] || (questions.length + 1),
        q: data[i][2] || "",
        options: [
          data[i][3] || "",
          data[i][4] || "",
          data[i][5] || "",
          data[i][6] || ""
        ],
        answer: String(data[i][7] || "")
          .trim()
          .toUpperCase(),
        image: imageData
      });
    }
  }

  if (questions.length === 0) {
    throw new Error(
      "No questions found for test: \\"" + testName + "\\""
    );
  }

  return questions;
}

/* =====================================================
   GET IMAGE FROM GOOGLE DRIVE (Base64 Data URI)
===================================================== */
function getDriveImageData(fileId) {
  var file = DriveApp.getFileById(fileId);
  var blob = file.getBlob();
  var contentType = blob.getContentType();

  if (contentType.indexOf("image/") !== 0) {
    throw new Error(
      "The Drive file is not an image: " + fileId
    );
  }

  var bytes = blob.getBytes();
  var base64 = Utilities.base64Encode(bytes);

  return "data:" + contentType + ";base64," + base64;
}

/* =====================================================
   EXTRACT DRIVE FILE ID FROM SHAREABLE LINKS
===================================================== */
function extractDriveFileId(value) {
  value = String(value || "").trim();

  if (value === "") {
    return "";
  }

  var match = value.match(/\\/d\\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return match[1];
  }

  match = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) {
    return match[1];
  }

  return value;
}

/* =====================================================
   SAVE STUDENT RESULT TO TEST-SPECIFIC TAB
===================================================== */
function saveResult(
  testName,
  rollNo,
  studentName,
  score,
  totalQuestions
) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(testName);

  if (!sheet) {
    sheet = ss.insertSheet(testName);

    sheet.appendRow([
      "Date & Time",
      "Test Name",
      "Roll No.",
      "Student Name",
      "Score",
      "Total Questions",
      "Percentage"
    ]);

    sheet
      .getRange(1, 1, 1, 7)
      .setFontWeight("bold")
      .setBackground("#003366")
      .setFontColor("#ffffff");
      
    sheet.setFrozenRows(1);
  }

  var percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  sheet.appendRow([
    new Date(),
    testName,
    rollNo,
    studentName,
    score,
    totalQuestions,
    percentage.toFixed(2) + "%"
  ]);

  return "Result saved successfully.";
}
`;
}

/**
 * Generates the clean index.html file for Google Apps Script
 */
export function generateIndexHtml(title = 'Semiconductor MCQ Practice Test', subtitle = 'Std. XII Physics'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  <!-- =====================================================
       MATHJAX FOR LATEX EQUATION RENDERING
       ===================================================== -->
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],
        displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']]
      },
      svg: {
        fontCache: 'global'
      }
    };
  </script>
  <script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background: #fff9cc;
      margin: 0;
      padding: 15px;
      color: #333333;
    }
    .container {
      max-width: 720px;
      margin: auto;
    }
    h1 {
      text-align: center;
      color: #003366;
      font-size: 24px;
      line-height: 1.4;
      margin-top: 10px;
    }
    .screen {
      background: white;
      border: 2px solid #003366;
      border-radius: 10px;
      padding: 24px;
      margin-top: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .hidden {
      display: none !important;
    }
    .info-label {
      display: block;
      font-weight: bold;
      margin-top: 15px;
      color: #003366;
    }
    .info-input {
      width: 100%;
      padding: 12px;
      margin-top: 6px;
      border: 1.5px solid #aaa;
      border-radius: 6px;
      font-size: 16px;
    }
    .info-input:focus {
      outline: none;
      border-color: #003366;
    }
    .button-area {
      text-align: center;
      margin-top: 25px;
    }
    button {
      background: #003366;
      color: white;
      border: none;
      padding: 13px 32px;
      border-radius: 7px;
      cursor: pointer;
      font-size: 17px;
      font-weight: bold;
      margin: 5px;
      transition: background 0.2s ease;
    }
    button:hover {
      background: #005599;
    }
    .next-test-button {
      background: #2e7d32;
      font-size: 18px;
      padding: 14px 40px;
      margin-top: 20px;
    }
    .next-test-button:hover {
      background: #1b5e20;
    }
    .loading {
      text-align: center;
      color: #003366;
      font-weight: bold;
      margin: 15px;
    }
    .error {
      color: #d32f2f;
      font-weight: bold;
    }
    .success {
      color: #2e7d32;
      font-weight: bold;
    }
    .test-title {
      text-align: center;
      color: #003366;
      font-weight: bold;
      font-size: 17px;
      margin-bottom: 15px;
    }
    .test-card {
      background: #e6ffff;
      border: 1px solid #b2ebf2;
      border-radius: 8px;
      padding: 16px;
      margin: 14px 0;
    }
    .test-card h3 {
      color: #003366;
      margin-top: 0;
      font-size: 18px;
    }
    .test-card button {
      width: 100%;
    }
    .question-number {
      text-align: center;
      color: #003366;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }
    .question-text {
      font-size: 18px;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .question-text mjx-container {
      margin: 5px 0 !important;
    }
    .question-image {
      max-width: 100%;
      height: auto;
      margin: 15px auto;
      display: block;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
    .option {
      display: block;
      background: #e6ffff;
      border: 1.5px solid #b2ebf2;
      border-radius: 7px;
      padding: 13px;
      margin: 10px 0;
      cursor: pointer;
      font-size: 16px;
      line-height: 1.7;
      transition: background 0.15s ease;
    }
    .option:hover {
      background: #d0f7f7;
    }
    .option input {
      margin-right: 10px;
      transform: scale(1.2);
    }
    .result {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #003366;
      line-height: 1.7;
    }
    .result-heading {
      text-align: center;
      color: #2e7d32;
    }
    .review {
      margin-top: 25px;
    }
    .review-card {
      border: 1px solid #999;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
      background: #f8ffff;
    }
    .review-question {
      font-size: 17px;
      font-weight: bold;
      line-height: 1.7;
      margin-bottom: 12px;
    }
    .review-option {
      padding: 8px 12px;
      margin: 6px 0;
      border-radius: 5px;
      line-height: 1.7;
    }
    .correct-answer {
      font-weight: bold;
      color: #1b5e20;
      background: #e8f5e9;
      border: 1px solid #a5d6a7;
    }
    .wrong-answer {
      font-weight: bold;
      color: #c62828;
      background: #ffebee;
      border: 1px solid #ef9a9a;
    }
    .review-correct {
      border-left: 6px solid #2e7d32;
      background: #e8f8e8;
    }
    .review-wrong {
      border-left: 6px solid #d32f2f;
      background: #ffecec;
    }
    .review-unanswered {
      border-left: 6px solid #f57c00;
      background: #fff5df;
    }
    .answer-summary {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px dashed #ccc;
      font-size: 15px;
      line-height: 1.6;
    }
    @media(max-width:500px) {
      body { padding: 8px; }
      h1 { font-size: 20px; }
      .screen { padding: 16px; }
      .question-text { font-size: 17px; }
      .option { font-size: 15px; }
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>
      ${subtitle}<br>
      ${title}
    </h1>

    <!-- 1. STUDENT INFO SCREEN -->
    <div id="studentScreen" class="screen">
      <h2 style="color: #003366; margin-top:0;">Student Information</h2>
      <label class="info-label">Student Name</label>
      <input type="text" id="studentName" class="info-input" placeholder="Enter your full name">
      
      <label class="info-label">Roll No.</label>
      <input type="text" id="rollNo" class="info-input" placeholder="Enter your Roll No.">
      
      <div class="button-area">
        <button onclick="continueToTests()">CONTINUE</button>
      </div>
      <div id="studentLoading" class="loading"></div>
    </div>

    <!-- 2. TEST SELECTION SCREEN -->
    <div id="testScreen" class="screen hidden">
      <h2 style="color: #003366; margin-top:0;">Select Test</h2>
      <div id="studentDisplay" class="test-title"></div>
      <div id="testList"></div>
      <div id="testLoading" class="loading"></div>
    </div>

    <!-- 3. QUESTION SCREEN -->
    <div id="questionScreen" class="screen hidden">
      <div id="selectedTest" class="test-title"></div>
      <div id="questionNumber" class="question-number"></div>
      <div id="questionText" class="question-text"></div>
      <div id="questionImage"></div>
      <div id="optionsContainer"></div>
      <div class="button-area">
        <button id="nextButton" onclick="nextQuestion()">NEXT</button>
      </div>
    </div>

    <!-- 4. RESULT SCREEN -->
    <div id="resultScreen" class="screen hidden">
      <h2 class="result-heading">✓ Test Completed</h2>
      <div id="result" class="result"></div>
      <div id="savingMessage" style="text-align:center;margin-top:20px;"></div>
      <div id="review" class="review"></div>
      <div class="button-area">
        <button class="next-test-button" onclick="goToNextTest()">NEXT TEST</button>
      </div>
    </div>
  </div>

  <script>
    let questions = [];
    let currentQuestion = 0;
    let studentName = "";
    let rollNo = "";
    let testName = "";
    let score = 0;
    let testSubmitted = false;
    let studentAnswers = [];

    function continueToTests() {
      studentName = document.getElementById("studentName").value.trim();
      rollNo = document.getElementById("rollNo").value.trim();

      if (studentName === "") {
        alert("Please enter your Student Name.");
        return;
      }
      if (rollNo === "") {
        alert("Please enter your Roll No.");
        return;
      }
      loadTests();
    }

    function loadTests() {
      document.getElementById("studentLoading").innerHTML = "Loading tests...";

      google.script.run
        .withSuccessHandler(function(tests) {
          document.getElementById("studentLoading").innerHTML = "";
          document.getElementById("studentScreen").classList.add("hidden");
          document.getElementById("testScreen").classList.remove("hidden");
          document.getElementById("studentDisplay").innerHTML =
            "Student: " + studentName + "<br>Roll No.: " + rollNo;
          displayTests(tests);
        })
        .withFailureHandler(function(error) {
          document.getElementById("studentLoading").innerHTML =
            "<span class='error'>" + error.message + "</span>";
        })
        .getTestNames();
    }

    function displayTests(tests) {
      const list = document.getElementById("testList");
      list.innerHTML = "";

      if (!tests || tests.length === 0) {
        list.innerHTML = "<p style='text-align:center;'>No tests found in the Questions sheet.</p>";
        return;
      }

      tests.forEach(function(test) {
        const card = document.createElement("div");
        card.className = "test-card";
        card.innerHTML =
          "<h3>" + test + "</h3>" +
          "<button onclick='openTest(" + JSON.stringify(test) + ")'>START TEST</button>";
        list.appendChild(card);
      });
    }

    function openTest(selectedTest) {
      testName = selectedTest;
      currentQuestion = 0;
      score = 0;
      testSubmitted = false;
      studentAnswers = [];

      document.getElementById("testScreen").classList.add("hidden");
      document.getElementById("questionScreen").classList.remove("hidden");
      document.getElementById("selectedTest").innerHTML = "Test: " + testName;
      document.getElementById("questionText").innerHTML = "Loading questions...";

      google.script.run
        .withSuccessHandler(function(data) {
          questions = data;
          currentQuestion = 0;
          score = 0;
          studentAnswers = new Array(questions.length).fill("");
          showQuestion();
        })
        .withFailureHandler(function(error) {
          alert("Unable to load questions.\\n\\n" + error.message);
          goToTestSelection();
        })
        .getQuestions(testName);
    }

    function renderMath() {
      if (window.MathJax && typeof MathJax.typesetPromise === "function") {
        MathJax.typesetPromise().catch(function(err) {
          console.error("MathJax error:", err);
        });
      }
    }

    function showQuestion() {
      const question = questions[currentQuestion];
      document.getElementById("questionNumber").innerHTML =
        "Question " + (currentQuestion + 1) + " / " + questions.length;
      document.getElementById("questionText").innerHTML = question.q;

      const imageBox = document.getElementById("questionImage");
      imageBox.innerHTML = "";

      if (question.image && String(question.image).trim() !== "") {
        const img = document.createElement("img");
        img.className = "question-image";
        img.src = String(question.image).trim();
        img.alt = "Question diagram";
        img.onerror = function() {
          imageBox.innerHTML = "<span class='error'>Unable to load question diagram.</span>";
        };
        imageBox.appendChild(img);
      }

      const box = document.getElementById("optionsContainer");
      box.innerHTML = "";

      question.options.forEach(function(option, index) {
        const label = document.createElement("label");
        label.className = "option";
        const letter = String.fromCharCode(65 + index);

        label.innerHTML =
          "<input type='radio' name='answer' value='" + letter + "' " +
          (studentAnswers[currentQuestion] === letter ? "checked" : "") + ">" +
          "<b>" + letter + ".</b> " + option;

        box.appendChild(label);
      });

      document.getElementById("nextButton").innerHTML =
        currentQuestion === questions.length - 1 ? "SUBMIT TEST" : "NEXT";

      renderMath();
    }

    function nextQuestion() {
      const selected = document.querySelector("input[name='answer']:checked");
      if (!selected) {
        alert("Please select an answer before continuing.");
        return;
      }

      studentAnswers[currentQuestion] = selected.value;

      if (currentQuestion === questions.length - 1) {
        submitTest();
        return;
      }

      currentQuestion++;
      showQuestion();
    }

    function submitTest() {
      if (testSubmitted) return;
      testSubmitted = true;

      score = questions.reduce(function(acc, q, idx) {
        return acc + (studentAnswers[idx] === q.answer ? 1 : 0);
      }, 0);

      const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;

      document.getElementById("questionScreen").classList.add("hidden");
      document.getElementById("resultScreen").classList.remove("hidden");

      document.getElementById("result").innerHTML =
        "Test: " + testName + "<br><br>" +
        "Student Name: " + studentName + "<br><br>" +
        "Roll No.: " + rollNo + "<br><br>" +
        "Your Score: " + score + " / " + questions.length + "<br><br>" +
        "Percentage: " + percentage.toFixed(2) + "%";

      document.getElementById("savingMessage").innerHTML = "Saving result to Google Sheet...";

      google.script.run
        .withSuccessHandler(function(message) {
          document.getElementById("savingMessage").innerHTML =
            "<span class='success'>✓ " + message + "</span>";
        })
        .withFailureHandler(function(error) {
          document.getElementById("savingMessage").innerHTML =
            "<span class='error'>Result saving error: " + error.message + "</span>";
        })
        .saveResult(testName, rollNo, studentName, score, questions.length);

      displayReview();
    }

    function displayReview() {
      const review = document.getElementById("review");
      let html =
        "<h2>Answer Review</h2>" +
        "<p style='margin-bottom:15px;'><b>" +
        "<span style='color:#1b5e20;'>Green = Correct answer</span>&nbsp;&nbsp;|&nbsp;&nbsp;" +
        "<span style='color:#c62828;'>Red = Wrong answer</span>&nbsp;&nbsp;|&nbsp;&nbsp;" +
        "<span style='color:#f57c00;'>Orange = Not answered</span>" +
        "</b></p>";

      questions.forEach(function(question, index) {
        const correct = question.answer;
        const student = studentAnswers[index];
        let cardClass = "review-unanswered";

        if (student === correct) {
          cardClass = "review-correct";
        } else if (student !== "") {
          cardClass = "review-wrong";
        }

        html +=
          "<div class='review-card " + cardClass + "'>" +
          "<div class='review-question'>Question " + (index + 1) + ": " + question.q + "</div>";

        if (question.image && String(question.image).trim() !== "") {
          html +=
            "<img class='question-image' src='" + String(question.image).trim() +
            "' alt='Question diagram' onerror=\\"this.style.display='none';\\">";
        }

        question.options.forEach(function(option, optionIndex) {
          const letter = String.fromCharCode(65 + optionIndex);
          let extraClass = "";

          if (letter === correct) {
            extraClass = "correct-answer";
          }
          if (letter === student && student !== correct) {
            extraClass = "wrong-answer";
          }

          html +=
            "<div class='review-option " + extraClass + "'>" +
            "<b>" + letter + ".</b> " + option;

          if (letter === correct) {
            html += " ✓ <b>(Correct Answer)</b>";
          }
          if (letter === student && student !== correct) {
            html += " ✗ <b>(Your Wrong Answer)</b>";
          }
          if (letter === student && student === correct) {
            html += " ← <b>Your Answer</b>";
          }
          html += "</div>";
        });

        html +=
          "<div class='answer-summary'>" +
          "<b>Your answer:</b> " + (student === "" ? "Not answered" : student) + "<br>" +
          "<b>Correct answer:</b> " + correct +
          "</div></div>";
      });

      review.innerHTML = html;
      renderMath();
    }

    function goToNextTest() {
      document.getElementById("resultScreen").classList.add("hidden");
      document.getElementById("testScreen").classList.remove("hidden");
      document.getElementById("studentDisplay").innerHTML =
        "Student: " + studentName + "<br>Roll No.: " + rollNo;
      document.getElementById("testLoading").innerHTML = "Loading tests...";

      google.script.run
        .withSuccessHandler(function(tests) {
          document.getElementById("testLoading").innerHTML = "";
          displayTests(tests);
        })
        .withFailureHandler(function(error) {
          document.getElementById("testLoading").innerHTML =
            "<span class='error'>" + error.message + "</span>";
        })
        .getTestNames();
    }

    function goToTestSelection() {
      document.getElementById("questionScreen").classList.add("hidden");
      document.getElementById("testScreen").classList.remove("hidden");
      loadTests();
    }
  </script>
</body>
</html>
`;
}

/**
 * Generates the TSV (Tab Separated Values) format for direct copy-paste into Google Sheets
 */
export function generateSheetTSV(tests: TestSuite[]): string {
  const header = ['Test Name', 'Q. No.', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Image / Google Drive URL'];
  const rows: string[] = [header.join('\t')];

  tests.forEach((test) => {
    test.questions.forEach((q, idx) => {
      const row = [
        test.name,
        q.qNo || idx + 1,
        (q.q || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
        (q.options[0] || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
        (q.options[1] || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
        (q.options[2] || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
        (q.options[3] || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
        q.answer || 'A',
        q.image || ''
      ];
      rows.push(row.join('\t'));
    });
  });

  return rows.join('\n');
}

/**
 * Generates CSV string for downloading
 */
export function generateSheetCSV(tests: TestSuite[]): string {
  const escapeCsv = (str: string | number) => {
    const val = String(str ?? '');
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const header = ['Test Name', 'Q. No.', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Image / Google Drive URL'];
  const rows: string[] = [header.map(escapeCsv).join(',')];

  tests.forEach((test) => {
    test.questions.forEach((q, idx) => {
      const row = [
        escapeCsv(test.name),
        escapeCsv(q.qNo || idx + 1),
        escapeCsv(q.q || ''),
        escapeCsv(q.options[0] || ''),
        escapeCsv(q.options[1] || ''),
        escapeCsv(q.options[2] || ''),
        escapeCsv(q.options[3] || ''),
        escapeCsv(q.answer || 'A'),
        escapeCsv(q.image || '')
      ];
      rows.push(row.join(','));
    });
  });

  return rows.join('\n');
}
