import React from "react";
import { X, Key, ShieldCheck, Zap, Code, Sparkles } from "lucide-react";
import { EngineMode } from "../../src/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineMode: EngineMode;
  setEngineMode: (mode: EngineMode) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (m: string) => void;
  maxDpi: number;
  setMaxDpi: (dpi: number) => void;
  validationMode: "rule" | "ai";
  setValidationMode: (mode: "rule" | "ai") => void;
  enableCache: boolean;
  setEnableCache: (cache: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  engineMode,
  setEngineMode,
  apiKey,
  setApiKey,
  model,
  setModel,
  maxDpi,
  setMaxDpi,
  validationMode,
  setValidationMode,
  enableCache,
  setEnableCache,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Engine & Pipeline Settings</h2>
          <button className="btn-icon" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px", display: "block" }}>
              Engine Mode Pipeline Selection
            </label>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setEngineMode("offline")}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: engineMode === "offline" ? "2px solid #06b6d4" : "1px solid rgba(255,255,255,0.1)",
                  background: engineMode === "offline" ? "rgba(6, 182, 212, 0.15)" : "rgba(0,0,0,0.3)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8" }}>
                  <Zap size={14} /> Option 1: Pure Offline Engine (No LLM Calls)
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                  100% local libraries (Docling, Tesseract.js, pdfjs-dist). Zero API keys required.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setEngineMode("ai")}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: engineMode === "ai" ? "2px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
                  background: engineMode === "ai" ? "rgba(168, 85, 247, 0.15)" : "rgba(0,0,0,0.3)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#c084fc" }}>
                  <Sparkles size={14} /> Option 2: Full AI Document Engine
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                  Docling primary layout parsing + OpenAI Vision OCR fallback + LLM discrepancy audit.
                </div>
              </button>
            </div>
          </div>

          {engineMode === "ai" && (
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", display: "flex", alignItems: "center", gap: "6px" }}>
                <Key size={14} /> OpenAI API Key (Option 2 Vision OCR & Audit)
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                Leave blank to use OPENAI_API_KEY from .env
              </p>
            </div>
          )}

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", display: "flex", justifyContent: "space-between" }}>
              <span>Page Rasterization Resolution</span>
              <span>{maxDpi} DPI</span>
            </label>
            <input
              type="range"
              min="150"
              max="300"
              step="25"
              value={maxDpi}
              onChange={(e) => setMaxDpi(parseInt(e.target.value, 10))}
              style={{ width: "100%", marginTop: "8px" }}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={onClose} style={{ width: "100%", marginTop: "24px" }}>
          Save Settings
        </button>
      </div>
    </div>
  );
};
