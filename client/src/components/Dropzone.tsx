import React, { useRef } from "react";
import { Upload, FileText, Zap, Sparkles, Lock, ShieldCheck } from "lucide-react";
import { EngineMode } from "../../src/types";

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  engineMode: EngineMode;
  setEngineMode: (mode: EngineMode) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelected,
  isProcessing,
  engineMode,
  setEngineMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "40px 20px",
      }}
    >
      {/* Pipeline Engine Mode Switcher */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
          background: "rgba(15, 23, 42, 0.7)",
          padding: "6px",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => setEngineMode("offline")}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "10px",
            border: engineMode === "offline" ? "2px solid #06b6d4" : "1px solid transparent",
            background: engineMode === "offline" ? "rgba(6, 182, 212, 0.18)" : "transparent",
            color: "#fff",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8" }}>
            <Zap size={16} /> Option 1: Offline Engine
          </div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
            100% Local libraries (Docling, Tesseract.js). <b>Zero LLM / zero API calls.</b>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setEngineMode("ai")}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "10px",
            border: engineMode === "ai" ? "2px solid #a855f7" : "1px solid transparent",
            background: engineMode === "ai" ? "rgba(168, 85, 247, 0.18)" : "transparent",
            color: "#fff",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", color: "#c084fc" }}>
            <Sparkles size={16} /> Option 2: Full AI Engine
          </div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
            Docling + OpenAI Vision OCR + LLM Discrepancy Audit.
          </div>
        </button>
      </div>

      <div
        className="dropzone-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.csv,.tsv,.png,.jpg,.jpeg,.webp,.txt,.json,.py,.ts,.js,.md"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFileSelected(e.target.files[0]);
            }
          }}
        />

        {isProcessing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="spinner" />
            <p style={{ marginTop: "16px", fontSize: "14px", fontWeight: "600", color: "#38bdf8" }}>
              Processing Document under [{engineMode === "offline" ? "OPTION 1: OFFLINE ENGINE" : "OPTION 2: FULL AI ENGINE"}]...
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
              {engineMode === "offline"
                ? "Parsing local layout & running Tesseract OCR (Zero LLM calls)..."
                : "Extracting native layout & running OpenAI Vision OCR..."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: engineMode === "offline" ? "rgba(6, 182, 212, 0.1)" : "rgba(168, 85, 247, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: engineMode === "offline" ? "#06b6d4" : "#a855f7",
              }}
            >
              <Upload size={28} />
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>
              Drop Document Here or Click to Upload
            </h3>

            <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", maxWidth: "380px" }}>
              Supports PDF, DOCX, PPTX, XLSX, CSV, Images (PNG, JPG), Markdown, Code, and Text files up to 50MB.
            </p>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <span className="badge-source source-native" style={{ fontSize: "11px" }}>PDF / DOCX</span>
              <span className="badge-source source-docling" style={{ fontSize: "11px" }}>XLSX / CSV / PPTX</span>
              <span className="badge-source source-ocr" style={{ fontSize: "11px" }}>
                {engineMode === "offline" ? "OFFLINE TESSERACT OCR" : "OPENAI VISION OCR"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
