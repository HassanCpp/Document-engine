import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Terminal as TerminalIcon,
  Layers,
  Download,
  BarChart3,
  Search,
} from "lucide-react";
import { StructuredDocument, BlockType } from "../../../../document-engine/src/types";

interface BlockInspectorProps {
  document: StructuredDocument;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  markdownOutput: string;
  validationReportOutput: string;
  logs: string[];
}

export const BlockInspector: React.FC<BlockInspectorProps> = ({
  document,
  selectedBlockId,
  onSelectBlock,
  markdownOutput,
  validationReportOutput,
  logs,
}) => {
  const [activeTab, setActiveTab] = useState<"markdown" | "blocks" | "validation" | "stats" | "terminal">("blocks");
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allBlocks = document.pages.flatMap((p) => p.blocks);

  const filteredBlocks = allBlocks.filter((b) => {
    const matchesType = filterType === "All" || b.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      String(b.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = (format: "md" | "json" | "txt") => {
    let content = "";
    let mimeType = "text/plain";
    let filename = `${document.metadata.originalFilename || "document"}.${format}`;

    if (format === "md") {
      content = markdownOutput;
      mimeType = "text/markdown";
    } else if (format === "json") {
      content = JSON.stringify(document, null, 2);
      mimeType = "application/json";
    } else if (format === "txt") {
      content = allBlocks.map((b) => String(b.content)).join("\n\n");
      mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterOptions = ["All", "Heading", "Paragraph", "Table", "Figure", "Code", "List"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0b1329", color: "#f8fafc" }}>
      {/* Top Header Bar with Mode Title & Download Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "#111c38",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#38bdf8", fontSize: "13px", fontWeight: 700 }}>
              Document Layout & OCR Extraction
            </span>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
              }}
            >
              Page 1 of {document.pages.length || 1}
            </span>
          </div>
        </div>

        {/* Download Buttons Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => handleDownload("md")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 10px",
              background: "#1e293b",
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={13} /> .md
          </button>
          <button
            onClick={() => handleDownload("json")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 10px",
              background: "#1e293b",
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={13} /> .json
          </button>
          <button
            onClick={() => handleDownload("txt")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 10px",
              background: "#1e293b",
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={13} /> .txt
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "6px 12px",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <button
          onClick={() => setActiveTab("markdown")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: activeTab === "markdown" ? "#1e293b" : "transparent",
            color: activeTab === "markdown" ? "#38bdf8" : "#94a3b8",
            border: "none",
            borderBottom: activeTab === "markdown" ? "2px solid #38bdf8" : "2px solid transparent",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <FileText size={14} /> Markdown Output
        </button>

        <button
          onClick={() => setActiveTab("blocks")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: activeTab === "blocks" ? "#1e293b" : "transparent",
            color: activeTab === "blocks" ? "#38bdf8" : "#94a3b8",
            border: "none",
            borderBottom: activeTab === "blocks" ? "2px solid #38bdf8" : "2px solid transparent",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Layers size={14} /> Blocks ({allBlocks.length})
        </button>

        <button
          onClick={() => setActiveTab("validation")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: activeTab === "validation" ? "#1e293b" : "transparent",
            color: activeTab === "validation" ? "#38bdf8" : "#94a3b8",
            border: "none",
            borderBottom: activeTab === "validation" ? "2px solid #38bdf8" : "2px solid transparent",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <CheckCircle2 size={14} /> Validation
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: activeTab === "stats" ? "#1e293b" : "transparent",
            color: activeTab === "stats" ? "#38bdf8" : "#94a3b8",
            border: "none",
            borderBottom: activeTab === "stats" ? "2px solid #38bdf8" : "2px solid transparent",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <BarChart3 size={14} /> Stats
        </button>

        <button
          onClick={() => setActiveTab("terminal")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: activeTab === "terminal" ? "#1e293b" : "transparent",
            color: activeTab === "terminal" ? "#38bdf8" : "#94a3b8",
            border: "none",
            borderBottom: activeTab === "terminal" ? "2px solid #38bdf8" : "2px solid transparent",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <TerminalIcon size={14} /> Live Logs ({logs.length})
        </button>
      </div>

      {/* Tab Body */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {activeTab === "blocks" && (
          <div>
            {/* Search Input Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                background: "#111c38",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder={`Search ${allBlocks.length} blocks...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f8fafc",
                  fontSize: "12px",
                  width: "100%",
                }}
              />
            </div>

            {/* Block Element Filter Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {filterOptions.map((opt) => {
                const isSel = filterType.toLowerCase() === opt.toLowerCase();
                return (
                  <button
                    key={opt}
                    onClick={() => setFilterType(opt)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "14px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: isSel ? "#38bdf8" : "#1e293b",
                      color: isSel ? "#0f172a" : "#94a3b8",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Blocks Cards List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredBlocks.map((block) => {
                const isSelected = block.id === selectedBlockId;
                const confPercent = Math.round((block.confidence || 0.95) * 100);

                return (
                  <div
                    key={block.id}
                    onClick={() => onSelectBlock(block.id)}
                    style={{
                      padding: "14px",
                      borderRadius: "8px",
                      background: isSelected ? "rgba(56, 189, 248, 0.12)" : "#111c38",
                      border: `1px solid ${isSelected ? "#38bdf8" : "#1e293b"}`,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "#1e293b",
                          color: "#38bdf8",
                          border: "1px solid rgba(56, 189, 248, 0.3)",
                        }}
                      >
                        {block.type}
                      </span>

                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: block.sourceMethod === "ocr" ? "rgba(234, 179, 8, 0.2)" : "rgba(34, 197, 94, 0.2)",
                          color: block.sourceMethod === "ocr" ? "#eab308" : "#22c55e",
                        }}
                      >
                        {block.sourceMethod.toUpperCase()}
                      </span>

                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Conf: {confPercent}%</span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#f8fafc", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                      {String(block.content)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "markdown" && (
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#38bdf8",
              whiteSpace: "pre-wrap",
              background: "#111c38",
              padding: "16px",
              borderRadius: "8px",
              lineHeight: "1.6",
            }}
          >
            {markdownOutput}
          </pre>
        )}

        {activeTab === "validation" && (
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#4ade80",
              whiteSpace: "pre-wrap",
              background: "#111c38",
              padding: "16px",
              borderRadius: "8px",
              lineHeight: "1.6",
            }}
          >
            {validationReportOutput}
          </pre>
        )}

        {activeTab === "stats" && (
          <div style={{ background: "#111c38", padding: "16px", borderRadius: "8px" }}>
            <h4 style={{ fontSize: "14px", color: "#f8fafc", marginBottom: "12px" }}>Extraction Performance Stats</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
              <div style={{ background: "#1e293b", padding: "10px", borderRadius: "6px" }}>
                <span style={{ color: "#94a3b8" }}>Engine Mode:</span>
                <div style={{ color: "#38bdf8", fontWeight: 700 }}>{document.processingStats.engineMode.toUpperCase()}</div>
              </div>
              <div style={{ background: "#1e293b", padding: "10px", borderRadius: "6px" }}>
                <span style={{ color: "#94a3b8" }}>Total Time:</span>
                <div style={{ color: "#38bdf8", fontWeight: 700 }}>{document.processingStats.totalProcessingTimeMs} ms</div>
              </div>
              <div style={{ background: "#1e293b", padding: "10px", borderRadius: "6px" }}>
                <span style={{ color: "#94a3b8" }}>Pages:</span>
                <div style={{ color: "#f8fafc", fontWeight: 700 }}>{document.pages.length}</div>
              </div>
              <div style={{ background: "#1e293b", padding: "10px", borderRadius: "6px" }}>
                <span style={{ color: "#94a3b8" }}>Total Blocks:</span>
                <div style={{ color: "#f8fafc", fontWeight: 700 }}>{allBlocks.length}</div>
              </div>
              <div style={{ background: "#1e293b", padding: "10px", borderRadius: "6px" }}>
                <span style={{ color: "#94a3b8" }}>Tables Detected:</span>
                <div style={{ color: "#f8fafc", fontWeight: 700 }}>{document.tables.length}</div>
              </div>
              <div style={{ background: "#1e293b", padding: "10px", borderRadius: "6px" }}>
                <span style={{ color: "#94a3b8" }}>Validation Status:</span>
                <div style={{ color: document.validationReport.passed ? "#22c55e" : "#f43f5e", fontWeight: 700 }}>
                  {document.validationReport.passed ? "PASSED ✅" : "FAILED ❌"}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "terminal" && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "#38bdf8",
              background: "#020617",
              padding: "16px",
              borderRadius: "8px",
              lineHeight: "1.6",
            }}
          >
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
