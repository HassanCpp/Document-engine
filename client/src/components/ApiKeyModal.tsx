import React, { useState } from "react";
import { Key, Lock, X } from "lucide-react";

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
  const [apiKeyInput, setApiKeyInput] = useState(currentKey);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      onSaveKey(apiKeyInput.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: "450px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c084fc", fontWeight: "700", fontSize: "16px" }}>
            <Key size={20} /> OpenAI API Key Required
          </div>
          <button className="btn-icon" onClick={onClose} style={{ padding: "4px" }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px", lineHeight: "1.5" }}>
          <b>Option 2 (Full AI Engine)</b> uses OpenAI Vision (<code style={{ color: "#38bdf8" }}>gpt-4o</code>) for 300 DPI Set-of-Marks visual OCR. No API key was found in your local <code style={{ color: "#38bdf8" }}>.env</code> file. Please enter your key below to proceed:
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#d1d5db" }}>OpenAI API Key (sk-...)</label>
            <input
              type="password"
              className="input-field"
              placeholder="sk-proj-..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" className="btn-icon" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}>
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
