import React from "react";
import { FileText, RotateCcw } from "lucide-react";
import { EngineMode } from "../../../../document-engine/src/types";

interface HeaderProps {
  onReset: () => void;
  hasDocument: boolean;
  engineMode: EngineMode;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasDocument,
  engineMode,
}) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #334155",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #38bdf8, #6366f1)",
            padding: "8px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileText size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
            Document Intelligence Engine — Test Application
          </h1>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
            Interactive Frontend App Testing <code style={{ color: "#38bdf8" }}>doc-intel-engine</code> Library
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            background: engineMode === "ai" ? "rgba(99, 102, 241, 0.2)" : "rgba(56, 189, 248, 0.2)",
            color: engineMode === "ai" ? "#818cf8" : "#38bdf8",
            border: `1px solid ${engineMode === "ai" ? "rgba(99, 102, 241, 0.4)" : "rgba(56, 189, 248, 0.4)"}`,
          }}
        >
          Active: {engineMode === "ai" ? "Option 2 (5-Stage SoM + Multimodal AI)" : "Option 1 (100% Local JS Parsers)"}
        </div>

        {hasDocument && (
          <button
            onClick={onReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: "#334155",
              color: "#f8fafc",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>
    </header>
  );
};
