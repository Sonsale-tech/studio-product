/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - MCQ ONLINE TEST ENGINE (Code.gs)
 * =========================================================================
 * Description: Backend script for hosting online MCQ tests via Google Sheets.
 * Features:
 *  - Serves responsive HTML5 Web App with MathJax LaTeX equation rendering
 *  - Loads all test categories dynamically from the "Questions" sheet
 *  - Fetches questions, options, answers, and optional Google Drive diagrams
 *  - Automatically generates dedicated result tabs for each test and logs student scores
 *
 * Deployment Steps:
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
  var sheet = ss.getSheetByName("Questions");

  if (!sheet) {
    throw new Error(
      'Questions sheet not found. Please create a sheet named "Questions".'
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
  var sheet = ss.getSheetByName("Questions");

  if (!sheet) {
    throw new Error(
      'Questions sheet not found. Please create a sheet named "Questions".'
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
      "No questions found for test: \"" + testName + "\""
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

  var match = value.match(/\/d\/([a-zA-Z0-9_-]+)/);
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
