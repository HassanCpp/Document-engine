import React from "react";
import { Cpu, RefreshCw } from "lucide-react";
import { EngineMode } from "../../src/types";

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
    <header className="app-header">
      <div className="brand-container">
        <div className="brand-logo">
          <Cpu size={22} color="#fff" />
        </div>
        <div>
          <h1 className="brand-title">Document Intelligence Engine</h1>
          <div className="brand-subtitle">STANDALONE PARSING & OCR LIBRARY</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {hasDocument && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "4px 10px",
                borderRadius: "6px",
                background: engineMode === "offline" ? "rgba(6, 182, 212, 0.15)" : "rgba(168, 85, 247, 0.15)",
                color: engineMode === "offline" ? "#38bdf8" : "#c084fc",
                border: engineMode === "offline" ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid rgba(168, 85, 247, 0.3)",
              }}
            >
              {engineMode === "offline" ? "⚡ OPTION 1: OFFLINE ENGINE" : "🤖 OPTION 2: FULL AI ENGINE"}
            </span>

            <button className="btn-icon" onClick={onReset} style={{ fontSize: "12px" }}>
              <RefreshCw size={14} /> New Upload
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
