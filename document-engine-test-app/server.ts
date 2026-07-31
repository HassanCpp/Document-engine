import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  processDocument,
  exportToMarkdown,
  exportToValidationReport,
  StructuredDocument,
  EngineMode,
  ProcessOptions,
} from "../document-engine/src/index.js";
import { renderPdfPageToImageBuffer, getPdfPageCount } from "../document-engine/src/utils/rasterize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from current folder, root folder, or library folder
dotenv.config();
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../document-engine/.env") });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

app.get("/api/config", (req, res) => {
  const envKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : "";
  const hasEnvApiKey = Boolean(envKey.length > 0);
  return res.json({
    hasEnvApiKey,
    model: process.env.OPENAI_MODEL || "gpt-4o",
  });
});

app.post("/api/process", upload.single("file"), async (req, res) => {
  const capturedLogs: string[] = [];

  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  const logCapture = (type: string, args: any[]) => {
    const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
    capturedLogs.push(`[${type}] ${msg}`);
  };

  console.log = (...args) => { origLog(...args); logCapture("INFO", args); };
  console.warn = (...args) => { origWarn(...args); logCapture("WARN", args); };
  console.error = (...args) => { origError(...args); logCapture("ERROR", args); };

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const {
      engineMode,
      apiKey,
      model,
      maxDpi,
      validationMode,
      enableLLMValidation,
      enableCache,
    } = req.body || {};

    const effectiveApiKey = process.env.OPENAI_API_KEY || apiKey || undefined;
    const selectedMode: EngineMode = (engineMode as EngineMode) || "offline";

    const options: ProcessOptions = {
      engineMode: selectedMode,
      originalFilename: req.file.originalname,
      apiKey: effectiveApiKey,
      model: model || process.env.OPENAI_MODEL || "gpt-4o",
      maxDpi: maxDpi ? parseInt(maxDpi, 10) : 200,
      validationMode: (validationMode as any) || (enableLLMValidation === "true" ? "ai" : "rule"),
      enableLLMValidation: enableLLMValidation === "true" || enableLLMValidation === true,
      enableCache: enableCache === "true" || enableCache === true,
    };

    console.log(`[API] Processing file '${req.file.originalname}' under Engine Mode: [${selectedMode.toUpperCase()}]...`);

    const doc = await processDocument(req.file.buffer, options);

    const pageImages: string[] = [];
    if (doc.documentType === "pdf") {
      try {
        const pageCount = await getPdfPageCount(req.file.buffer);
        for (let i = 1; i <= pageCount; i++) {
          const imgBuf = await renderPdfPageToImageBuffer(req.file.buffer, i, 150);
          pageImages.push(`data:image/png;base64,${imgBuf.toString("base64")}`);
        }
      } catch (err) {
        console.warn("[API] Page preview rendering fallback:", err);
      }
    } else if (doc.documentType === "image") {
      pageImages.push(`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`);
    }

    const markdownOutput = exportToMarkdown(doc);
    const validationReportOutput = exportToValidationReport(doc);

    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;

    return res.json({
      document: doc,
      pageImages,
      markdownOutput,
      validationReportOutput,
      logs: capturedLogs,
    });
  } catch (err: any) {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;

    console.error("[API] Document processing error:", err);
    return res.status(500).json({
      error: err.message || "Failed to process document",
      logs: capturedLogs,
    });
  }
});

app.post("/api/export/markdown", (req, res) => {
  const doc: StructuredDocument = req.body.document;
  if (!doc) return res.status(400).send("Missing document payload");
  const md = exportToMarkdown(doc);
  res.setHeader("Content-Type", "text/markdown");
  res.setHeader("Content-Disposition", `attachment; filename="${doc.metadata.originalFilename}.md"`);
  res.send(md);
});

app.post("/api/export/validation-report", (req, res) => {
  const doc: StructuredDocument = req.body.document;
  if (!doc) return res.status(400).send("Missing document payload");
  const report = exportToValidationReport(doc);
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment; filename="${doc.metadata.originalFilename}_validation.txt"`);
  res.send(report);
});

// Serve static client build
const clientDist = path.join(__dirname, "client/dist");
app.use(express.static(clientDist));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"));
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` DOCUMENT INTELLIGENCE TEST APP READY`);
    console.log(` URL: http://localhost:3001`);
    console.log(`==================================================\n`);
  });
}
