import React, { useState } from "react";
import { Key, X } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  currentKey,
}) => {
  const [inputKey, setInputKey] = useState(currentKey);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "12px",
          width: "440px",
          padding: "24px",
          position: "relative",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Key size={20} color="#6366f1" />
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
            OpenAI API Key Required
          </h2>
        </div>

        <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px", lineHeight: "1.5" }}>
          Option 2 uses OpenAI Structured Outputs (`gpt-4o`) to run Kahn's Spatial DAG & Multimodal Vision layout extraction.
        </p>

        <input
          type="password"
          placeholder="sk-proj-..."
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "6px",
            color: "#f8fafc",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              background: "#334155",
              color: "#94a3b8",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSaveKey(inputKey);
              onClose();
            }}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Key & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
