import React, { useState } from "react";
import { StructuredDocument, BlockType } from "../../src/types";
import {
  Search,
  Download,
  FileText,
  Code,
  ShieldCheck,
  AlertCircle,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
  Terminal,
} from "lucide-react";

interface BlockInspectorProps {
  document: StructuredDocument;
  markdownOutput: string;
  validationReportOutput: string;
  logs?: string[];
  selectedBlockIndex: number | null;
  onSelectBlock: (idx: number) => void;
  currentPageIndex: number;
  onPageChange: (idx: number) => void;
}

export const BlockInspector: React.FC<BlockInspectorProps> = ({
  document,
  markdownOutput,
  validationReportOutput,
  logs = [],
  selectedBlockIndex,
  onSelectBlock,
  currentPageIndex,
  onPageChange,
}) => {
  const [activeTab, setActiveTab] = useState<"markdown" | "blocks" | "validation" | "stats" | "logs">("markdown");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const totalPages = document.metadata.pageCount || document.pages.length || 1;
  const currentPageBlock = document.pages.find((p) => p.pageNumber === currentPageIndex + 1) || document.pages[currentPageIndex] || document.pages[0];
  const allBlocks = currentPageBlock ? currentPageBlock.blocks : [];

  const filteredBlocks = allBlocks.filter((b) => {
    const matchesFilter = selectedFilter === "all" || b.type === selectedFilter;
    const contentStr = typeof b.content === "string" ? b.content : JSON.stringify(b.content);
    const matchesSearch = contentStr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBadgeClass = (type: BlockType) => {
    switch (type) {
      case "heading": return "badge-heading";
      case "paragraph": return "badge-paragraph";
      case "table": return "badge-table";
      case "figure": return "badge-figure";
      case "chart": return "badge-figure";
      case "code": return "badge-code";
      case "list": return "badge-list";
      default: return "badge-paragraph";
    }
  };

  const isOffline = document.processingStats.engineMode === "offline";

  return (
    <div className="pane pane-right">
      {/* Engine Mode Banner */}
      <div
        style={{
          background: isOffline ? "rgba(6, 182, 212, 0.15)" : "rgba(168, 85, 247, 0.15)",
          borderBottom: `1px solid ${isOffline ? "#06b6d4" : "#a855f7"}`,
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: isOffline ? "#38bdf8" : "#c084fc" }}>
          {isOffline ? <Zap size={14} /> : <Sparkles size={14} />}
          <span>
            {isOffline
              ? "OPTION 1: PURE OFFLINE ENGINE (ZERO LLM CALLS)"
              : "OPTION 2: FULL AI ENGINE (OPENAI VISION & LLM AUDIT)"}
          </span>
        </div>

        <span style={{ fontSize: "11px", color: "#9ca3af" }}>
          {isOffline ? "Local Tesseract & PDF layout" : `Multimodal Vision OCR & Audit`}
        </span>
      </div>

      {/* Pane Header */}
      <div className="pane-header" style={{ flexWrap: "wrap", gap: "10px" }}>
        <div className="pane-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Docling + OCR Extraction</span>
          <span style={{ fontSize: "11px", color: "#06b6d4", background: "rgba(6,182,212,0.15)", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
            Page {currentPageIndex + 1} of {totalPages}
          </span>
        </div>

        {/* Page Switcher & Download Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.4)", borderRadius: "6px", border: "1px solid var(--border-subtle)", padding: "2px" }}>
            <button
              className="btn-icon"
              style={{ padding: "3px 6px" }}
              disabled={currentPageIndex === 0}
              onClick={() => onPageChange(currentPageIndex - 1)}
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>

            <select
              value={currentPageIndex}
              onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
              style={{ background: "transparent", border: "none", color: "#e2e8f0", fontSize: "11px", padding: "2px 4px", cursor: "pointer" }}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i} value={i} style={{ background: "#0f172a", color: "#fff" }}>
                  Page {i + 1}
                </option>
              ))}
            </select>

            <button
              className="btn-icon"
              style={{ padding: "3px 6px" }}
              disabled={currentPageIndex >= totalPages - 1}
              onClick={() => onPageChange(currentPageIndex + 1)}
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            className="btn-icon"
            style={{ padding: "4px 8px", fontSize: "11px" }}
            onClick={() => downloadFile(markdownOutput, `${document.metadata.originalFilename}.md`, "text/markdown")}
            title="Download Full Markdown"
          >
            <Download size={12} /> .md
          </button>
          <button
            className="btn-icon"
            style={{ padding: "4px 8px", fontSize: "11px" }}
            onClick={() => downloadFile(JSON.stringify(document, null, 2), `${document.metadata.originalFilename}.json`, "application/json")}
            title="Download Structured JSON"
          >
            <Download size={12} /> .json
          </button>
          <button
            className="btn-icon"
            style={{ padding: "4px 8px", fontSize: "11px" }}
            onClick={() => downloadFile(validationReportOutput, `${document.metadata.originalFilename}_validation.txt`, "text/plain")}
            title="Download Validation Report"
          >
            <Download size={12} /> .txt
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.3)" }}>
        <button
          onClick={() => setActiveTab("markdown")}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "11px",
            fontWeight: "600",
            border: "none",
            borderBottom: activeTab === "markdown" ? "2px solid #06b6d4" : "none",
            background: activeTab === "markdown" ? "rgba(6,182,212,0.1)" : "transparent",
            color: activeTab === "markdown" ? "#06b6d4" : "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <FileText size={13} /> Markdown Output
        </button>

        <button
          onClick={() => setActiveTab("blocks")}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "11px",
            fontWeight: "600",
            border: "none",
            borderBottom: activeTab === "blocks" ? "2px solid #06b6d4" : "none",
            background: activeTab === "blocks" ? "rgba(6,182,212,0.1)" : "transparent",
            color: activeTab === "blocks" ? "#06b6d4" : "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <Layers size={13} /> Blocks ({allBlocks.length})
        </button>

        <button
          onClick={() => setActiveTab("validation")}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "11px",
            fontWeight: "600",
            border: "none",
            borderBottom: activeTab === "validation" ? "2px solid #06b6d4" : "none",
            background: activeTab === "validation" ? "rgba(6,182,212,0.1)" : "transparent",
            color: activeTab === "validation" ? "#06b6d4" : "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <ShieldCheck size={13} color={document.validationReport.passed ? "#10b981" : "#f43f5e"} /> Validation
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "11px",
            fontWeight: "600",
            border: "none",
            borderBottom: activeTab === "stats" ? "2px solid #06b6d4" : "none",
            background: activeTab === "stats" ? "rgba(6,182,212,0.1)" : "transparent",
            color: activeTab === "stats" ? "#06b6d4" : "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <BarChart2 size={13} /> Stats
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "11px",
            fontWeight: "600",
            border: "none",
            borderBottom: activeTab === "logs" ? "2px solid #a855f7" : "none",
            background: activeTab === "logs" ? "rgba(168,85,247,0.1)" : "transparent",
            color: activeTab === "logs" ? "#c084fc" : "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <Terminal size={13} /> Live Logs ({logs.length})
        </button>
      </div>

      {/* Tab 1: Markdown Output */}
      {activeTab === "markdown" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af" }}>
              Full Markdown Document Stream
            </span>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              Page {currentPageIndex + 1} of {totalPages}
            </span>
          </div>

          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", background: "rgba(0,0,0,0.4)", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-subtle)", color: "#e0f2fe", lineHeight: "1.6" }}>
            {markdownOutput || buildPageMarkdown(currentPageBlock)}
          </pre>
        </div>
      )}

      {/* Tab 2: Extracted Blocks Stream */}
      {activeTab === "blocks" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: "10px", flexDirection: "column", background: "rgba(0,0,0,0.2)" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "#6b7280" }} />
              <input
                type="text"
                className="input-field"
                placeholder={`Search ${allBlocks.length} blocks on page ${currentPageIndex + 1}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "32px", marginTop: 0 }}
              />
            </div>

            <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
              {["all", "heading", "paragraph", "table", "figure", "code", "list"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    fontSize: "11px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    background: selectedFilter === filter ? "#06b6d4" : "rgba(255,255,255,0.05)",
                    color: selectedFilter === filter ? "#000" : "#d1d5db",
                    fontWeight: selectedFilter === filter ? "700" : "500",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="block-inspector-scroll">
            {filteredBlocks.length > 0 ? (
              filteredBlocks.map((block, idx) => {
                const isSelected = selectedBlockIndex === idx;

                return (
                  <div
                    key={block.id || idx}
                    className={`block-card ${isSelected ? "active" : ""}`}
                    onClick={() => onSelectBlock(idx)}
                    style={{
                      borderLeft: isSelected ? "4px solid #06b6d4" : "1px solid var(--border-subtle)",
                      background: isSelected ? "rgba(6, 182, 212, 0.12)" : "rgba(15, 23, 42, 0.6)",
                    }}
                  >
                    <div className="block-card-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className={`badge-type ${getBadgeClass(block.type)}`}>{block.type}</span>
                        <span className={`badge-source source-${block.sourceMethod}`}>{block.sourceMethod.toUpperCase()}</span>
                      </div>

                      <div style={{ fontSize: "11px", color: "#9ca3af", display: "flex", gap: "8px" }}>
                        <span>Conf: {(block.confidence * 100).toFixed(0)}%</span>
                        {block.boundingBox && (
                          <span style={{ color: "#64748b" }}>
                            [{block.boundingBox.join(",")}]
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`block-content ${block.type === "code" ? "block-content-code" : ""}`}>
                      {typeof block.content === "string"
                        ? block.content
                        : JSON.stringify(block.content, null, 2)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                No content blocks match criteria for page {currentPageIndex + 1}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Validation Report */}
      {activeTab === "validation" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <div style={{ background: document.validationReport.passed ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)", border: `1px solid ${document.validationReport.passed ? "#10b981" : "#f43f5e"}`, padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            {document.validationReport.passed ? <ShieldCheck size={24} color="#10b981" /> : <AlertCircle size={24} color="#f43f5e" />}
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: document.validationReport.passed ? "#34d399" : "#fda4af" }}>
                {document.validationReport.passed ? "Mandatory Rule Validation Passed" : "Rule Validation Issues Flagged"}
              </h3>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                {document.validationReport.ruleIssues.length} rule issues detected. Retry attempted: {document.validationReport.retryAttempted ? "YES" : "NO"}.
              </p>
            </div>
          </div>

          {document.validationReport.aiValidationRan && (
            <div style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", padding: "16px", borderRadius: "10px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#c084fc", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={16} /> AI Validation Discrepancy Audit
                </h4>
                <span style={{ fontSize: "14px", fontWeight: "800", color: "#a855f7", background: "rgba(0,0,0,0.4)", padding: "4px 12px", borderRadius: "12px" }}>
                  Score: {document.validationReport.aiConfidenceScore}%
                </span>
              </div>

              {document.validationReport.aiWarnings && document.validationReport.aiWarnings.length > 0 ? (
                <div>
                  <h5 style={{ fontSize: "12px", fontWeight: "600", color: "#f87171", marginBottom: "6px" }}>Discrepancies & Warnings:</h5>
                  <ul style={{ paddingLeft: "20px", fontSize: "12px", color: "#fca5a5" }}>
                    {document.validationReport.aiWarnings.map((w, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ fontSize: "12px", color: "#34d399" }}>No AI discrepancies detected.</div>
              )}

              {document.validationReport.aiSuggestedCorrections && document.validationReport.aiSuggestedCorrections.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <h5 style={{ fontSize: "12px", fontWeight: "600", color: "#fbbf24", marginBottom: "6px" }}>Suggested Corrections:</h5>
                  <ul style={{ paddingLeft: "20px", fontSize: "12px", color: "#fde68a" }}>
                    {document.validationReport.aiSuggestedCorrections.map((c, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <h4 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "#9ca3af" }}>Rule Issues Log:</h4>
          {document.validationReport.ruleIssues.length > 0 ? (
            <ul style={{ paddingLeft: "20px", fontSize: "12px", color: "#fda4af" }}>
              {document.validationReport.ruleIssues.map((issue, idx) => (
                <li key={idx} style={{ marginBottom: "4px" }}>{issue}</li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: "12px", color: "#34d399" }}>Zero rule issues recorded.</div>
          )}
        </div>
      )}

      {/* Tab 4: Processing Statistics */}
      {activeTab === "stats" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: "#06b6d4" }}>Pipeline Execution Performance</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>Execution Mode</div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: isOffline ? "#38bdf8" : "#c084fc", marginTop: "4px" }}>
                {isOffline ? "Option 1: Offline" : "Option 2: Full AI"}
              </div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>Docling Time</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#38bdf8", marginTop: "4px" }}>{document.processingStats.doclingTimeMs} ms</div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>OCR Pages Processed</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#c084fc", marginTop: "4px" }}>{document.processingStats.ocrPagesProcessed} Pages</div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>OCR Processing Time</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#c084fc", marginTop: "4px" }}>{document.processingStats.ocrTimeMs} ms</div>
            </div>
          </div>

          <div style={{ marginTop: "20px", background: "rgba(6,182,212,0.1)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(6,182,212,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>Total End-to-End Processing Time:</span>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#06b6d4" }}>{document.processingStats.totalProcessingTimeMs} ms</span>
          </div>
        </div>
      )}

      {/* Tab 5: Live Terminal Logs */}
      {activeTab === "logs" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#05070c" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#c084fc", display: "flex", alignItems: "center", gap: "6px" }}>
              <Terminal size={14} /> Live Server Execution Stream ({logs.length} entries)
            </span>
          </div>

          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", background: "rgba(0,0,0,0.7)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(168,85,247,0.3)", color: "#a7f3d0", lineHeight: "1.6" }}>
            {logs.length > 0 ? logs.join("\n") : "[No live logs recorded for this pass]"}
          </pre>
        </div>
      )}
    </div>
  );
};

function buildPageMarkdown(pageBlock?: any): string {
  if (!pageBlock || !pageBlock.blocks) return "No content on this page.";
  return pageBlock.blocks.map((b: any) => typeof b.content === "string" ? b.content : JSON.stringify(b.content)).join("\n\n");
}
