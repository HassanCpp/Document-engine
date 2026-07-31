import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { StructuredDocument } from "../../../../document-engine/src/types";

interface DocumentViewerProps {
  document: StructuredDocument;
  pageImages: string[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  pageImages,
  selectedBlockId,
  onSelectBlock,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);

  const totalPages = document.pages.length || 1;
  const currentImg = pageImages[currentPage - 1];
  const currentPageObj = document.pages.find((p) => p.pageNumber === currentPage);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0f172a" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#1e293b",
          borderBottom: "1px solid #334155",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{ padding: "4px 8px", background: "#334155", border: "none", borderRadius: "4px", color: "#fff" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={{ padding: "4px 8px", background: "#334155", border: "none", borderRadius: "4px", color: "#fff" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            style={{ padding: "4px 8px", background: "#334155", border: "none", borderRadius: "4px", color: "#fff" }}
          >
            <ZoomOut size={16} />
          </button>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
            style={{ padding: "4px 8px", background: "#334155", border: "none", borderRadius: "4px", color: "#fff" }}
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative",
        }}
      >
        {currentImg ? (
          <div
            style={{
              position: "relative",
              transform: `scale(${zoom})`,
              transformOrigin: "center top",
              transition: "transform 0.1s ease",
            }}
          >
            <img
              src={currentImg}
              alt={`Page ${currentPage}`}
              style={{
                maxWidth: "100%",
                borderRadius: "4px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            />

            {/* Render Bounding Box Badges */}
            {currentPageObj?.blocks.map((block) => {
              if (!block.boundingBox) return null;
              const [ymin, xmin, ymax, xmax] = block.boundingBox;
              const isSelected = block.id === selectedBlockId;

              return (
                <div
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  style={{
                    position: "absolute",
                    top: `${ymin / 10}%`,
                    left: `${xmin / 10}%`,
                    height: `${(ymax - ymin) / 10}%`,
                    width: `${(xmax - xmin) / 10}%`,
                    border: isSelected ? "2px solid #38bdf8" : "1px solid rgba(99, 102, 241, 0.4)",
                    background: isSelected ? "rgba(56, 189, 248, 0.25)" : "rgba(99, 102, 241, 0.1)",
                    cursor: "pointer",
                    zIndex: isSelected ? 20 : 5,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
            No visual canvas preview available for Page {currentPage}
          </div>
        )}
      </div>
    </div>
  );
};
