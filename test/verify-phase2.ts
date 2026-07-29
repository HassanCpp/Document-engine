import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { processDocument, StructuredDocument } from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runPhase2Verification() {
  const samplePdf = path.join(__dirname, "../test-fixtures/01_clean_report.pdf");
  if (!fs.existsSync(samplePdf)) {
    console.log("Phase 2 test: sample PDF fixture not found.");
    return;
  }

  console.log(`\n==================================================`);
  console.log(` DOCLING ENGINE - PHASE 2 (AI VALIDATION) VERIFICATION`);
  console.log(`==================================================\n`);

  const doc: StructuredDocument = await processDocument(samplePdf, {
    engineMode: "ai",
    validationMode: "ai",
    enableLLMValidation: true,
  });

  console.log(`Document ID         : ${doc.documentId}`);
  console.log(`Engine Mode         : ${doc.processingStats.engineMode}`);
  console.log(`Rule Validation     : ${doc.validationReport.passed ? "PASSED" : "FAILED"}`);
  console.log(`AI Validation Ran   : ${doc.validationReport.aiValidationRan ? "YES ✅" : "NO ❌"}`);
  console.log(`AI Confidence Score : ${doc.validationReport.aiConfidenceScore}%`);
  console.log(`AI Warnings         : ${doc.validationReport.aiWarnings?.length || 0}`);
  console.log(`Suggested Corrections: ${doc.validationReport.aiSuggestedCorrections?.length || 0}\n`);

  if (!doc.validationReport.aiValidationRan) {
    console.error("Phase 2 Failure: AI validation failed to run!");
    process.exit(1);
  }

  console.log(`Phase 2 AI Validation Verification Passed! ✅\n`);
}

runPhase2Verification().catch((err) => {
  console.error("Phase 2 verification error:", err);
  process.exit(1);
});
