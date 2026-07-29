import React, { useState } from "react";
import { StructuredDocument } from "../../src/types";
import { DocumentViewer } from "./DocumentViewer";
import { BlockInspector } from "./BlockInspector";

interface SplitViewProps {
  document: StructuredDocument;
  pageImages: string[];
  markdownOutput: string;
  validationReportOutput: string;
  logs?: string[];
}

export const SplitView: React.FC<SplitViewProps> = ({
  document,
  pageImages,
  markdownOutput,
  validationReportOutput,
  logs = [],
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  const currentPageBlock = document.pages.find((p) => p.pageNumber === currentPageIndex + 1) || document.pages[currentPageIndex] || document.pages[0];
  const blocks = currentPageBlock ? currentPageBlock.blocks : [];

  const handlePageChange = (newIdx: number) => {
    const maxPages = Math.max(pageImages.length, document.metadata.pageCount, document.pages.length);
    if (newIdx >= 0 && newIdx < maxPages) {
      setCurrentPageIndex(newIdx);
      setSelectedBlockIndex(null);
    }
  };

  return (
    <div className="split-view-container">
      <DocumentViewer
        pageImages={pageImages}
        currentPageIndex={currentPageIndex}
        onPageChange={handlePageChange}
        blocks={blocks}
        selectedBlockIndex={selectedBlockIndex}
        onSelectBlock={setSelectedBlockIndex}
      />

      <BlockInspector
        document={document}
        markdownOutput={markdownOutput}
        validationReportOutput={validationReportOutput}
        logs={logs}
        selectedBlockIndex={selectedBlockIndex}
        onSelectBlock={setSelectedBlockIndex}
        currentPageIndex={currentPageIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
