import React, { useState } from "react";
import { DocumentViewer } from "./DocumentViewer";
import { BlockInspector } from "./BlockInspector";
import { StructuredDocument } from "../../../../document-engine/src/types";

interface SplitViewProps {
  document: StructuredDocument;
  pageImages: string[];
  markdownOutput: string;
  validationReportOutput: string;
  logs: string[];
}

export const SplitView: React.FC<SplitViewProps> = ({
  document,
  pageImages,
  markdownOutput,
  validationReportOutput,
  logs,
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  return (
    <div
      className="split-view-container"
      style={{
        display: "flex",
        flex: 1,
        height: "calc(100vh - 60px)",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, borderRight: "1px solid #334155", position: "relative" }}>
        <DocumentViewer
          document={document}
          pageImages={pageImages}
          selectedBlockId={selectedBlockId}
          onSelectBlock={(id) => setSelectedBlockId(id)}
        />
      </div>

      <div style={{ flex: 1, background: "#0f172a" }}>
        <BlockInspector
          document={document}
          selectedBlockId={selectedBlockId}
          onSelectBlock={(id) => setSelectedBlockId(id)}
          markdownOutput={markdownOutput}
          validationReportOutput={validationReportOutput}
          logs={logs}
        />
      </div>
    </div>
  );
};
