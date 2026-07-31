import React, { useRef } from "react";
import { UploadCloud, Zap, Cpu, Sparkles } from "lucide-react";
import { EngineMode } from "../../../../document-engine/src/types";

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
        padding: "40px",
      }}
    >
      {/* Mode Selection Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "32px", maxWidth: "800px", width: "100%" }}>
        <div
          onClick={() => setEngineMode("offline")}
          style={{
            flex: 1,
            padding: "20px",
            borderRadius: "12px",
            background: engineMode === "offline" ? "rgba(56, 189, 248, 0.1)" : "#1e293b",
            border: `2px solid ${engineMode === "offline" ? "#38bdf8" : "#334155"}`,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Cpu size={20} color="#38bdf8" />
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
              Option 1: 100% Local JS Parsers
            </h3>
          </div>
          <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
            Uses native JavaScript parsers (PDF.js, Mammoth, Tesseract.js). Fast, 100% local, zero API cost.
          </p>
        </div>

        <div
          onClick={() => setEngineMode("ai")}
          style={{
            flex: 1,
            padding: "20px",
            borderRadius: "12px",
            background: engineMode === "ai" ? "rgba(99, 102, 241, 0.1)" : "#1e293b",
            border: `2px solid ${engineMode === "ai" ? "#6366f1" : "#334155"}`,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Sparkles size={20} color="#818cf8" />
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
              Option 2: 5-Stage Set-of-Marks AI Engine
            </h3>
          </div>
          <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
            Overlays visual badges, runs Kahn's Spatial DAG Topological Sorter, and uses GPT-4o Multimodal Vision.
          </p>
        </div>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "260px",
          border: "2px dashed #334155",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e293b",
          cursor: "pointer",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.csv,.png,.jpg,.jpeg,.txt,.json,.md,.ts,.py"
          onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])}
          style={{ display: "none" }}
        />

        {isProcessing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <Zap size={40} color="#38bdf8" style={{ animation: "pulse 1.5s infinite" }} />
            <h4 style={{ color: "#f8fafc", fontSize: "15px" }}>Processing Document...</h4>
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>
              Executing {engineMode === "ai" ? "Option 2 AI Multimodal Vision Pipeline" : "Option 1 Local JS Engine"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <UploadCloud size={48} color="#38bdf8" />
            <h3 style={{ color: "#f8fafc", fontSize: "16px" }}>Drop document file here or click to browse</h3>
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>
              Supports PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), CSV, Images (.png, .jpg), Code & Text
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
