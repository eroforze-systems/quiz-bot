import * as XLSX from "xlsx";

function downloadWorkbook(
  workbook: XLSX.WorkBook,
  filename: string
) {
  XLSX.writeFile(workbook, filename);
}

function formatExportDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type ParticipantRow = {
  name: string;
  phone: string;
  language?: string;
  startedAt: number;
};

type ResultRow = {
  name: string;
  phone: string;
  language?: string;
  score: number;
  answeredQuestions: number;
  completedAt: number;
};

export function exportParticipantsToExcel(participants: ParticipantRow[]) {
  const rows = participants.map((p, index) => ({
    "#": index + 1,
    Name: p.name,
    Phone: p.phone,
    Language: p.language === "english" ? "English" : "Tamil",
    Registered: formatExportDate(p.startedAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 24 },
    { wch: 16 },
    { wch: 12 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
  downloadWorkbook(
    workbook,
    `participants-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

export function exportResultsToExcel(results: ResultRow[]) {
  const rows = results.map((r, index) => ({
    "#": index + 1,
    Name: r.name,
    Phone: r.phone,
    Language: r.language === "english" ? "English" : "Tamil",
    Score: r.score,
    "Questions Answered": r.answeredQuestions,
    Completed: formatExportDate(r.completedAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 24 },
    { wch: 16 },
    { wch: 12 },
    { wch: 8 },
    { wch: 18 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");
  downloadWorkbook(
    workbook,
    `quiz-results-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}
