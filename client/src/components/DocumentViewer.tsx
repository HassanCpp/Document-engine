import React, { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Layers } from "lucide-react";
import { ContentBlock } from "../../src/types";

interface DocumentViewerProps {
  pageImages: string[];
  currentPageIndex: number;
  onPageChange: (idx: number) => void;
  blocks: ContentBlock[];
  selectedBlockIndex: number | null;
  onSelectBlock: (idx: number) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  pageImages,
  currentPageIndex,
  onPageChange,
  blocks,
  selectedBlockIndex,
  onSelectBlock,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const currentImage = pageImages[currentPageIndex] || pageImages[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(250, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="pane pane-left">
      <div className="pane-header">
        <div className="pane-title">
          <Layers size={16} />
          <span>Original Document View</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Zoom Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255, 255, 255, 0.06)", padding: "2px 6px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
            <button className="btn-icon" style={{ padding: "4px 6px" }} title="Zoom Out" onClick={handleZoomOut}>
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: "11px", color: "#9ca3af", minWidth: "36px", textAlign: "center", fontWeight: "600" }}>
              {zoomLevel}%
            </span>
            <button className="btn-icon" style={{ padding: "4px 6px" }} title="Zoom In" onClick={handleZoomIn}>
              <ZoomIn size={14} />
            </button>
            <button className="btn-icon" style={{ padding: "4px 6px" }} title="Reset Zoom" onClick={handleResetZoom}>
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Page Selector */}
          {pageImages.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                className="btn-icon"
                style={{ padding: "4px 8px" }}
                disabled={currentPageIndex === 0}
                onClick={() => onPageChange(currentPageIndex - 1)}
              >
                Prev
              </button>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                Page {currentPageIndex + 1} of {pageImages.length}
              </span>
              <button
                className="btn-icon"
                style={{ padding: "4px 8px" }}
                disabled={currentPageIndex === pageImages.length - 1}
                onClick={() => onPageChange(currentPageIndex + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Canvas Viewport */}
      <div
        className="doc-viewer-scroll"
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#06080e",
          width: "100%",
          maxHeight: "calc(100vh - 65px)",
        }}
      >
        {currentImage ? (
          <div
            className="page-container"
            style={{
              position: "relative",
              width: `${zoomLevel}%`,
              maxWidth: zoomLevel === 100 ? "800px" : "none",
              transition: "width 0.2s ease",
              boxShadow: "0 15px 40px rgba(0, 0, 0, 0.8)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <img src={currentImage} alt="Document Page" className="page-image" style={{ width: "100%", display: "block" }} />

            {/* Bounding Box BBox Overlays */}
            {blocks.map((block, idx) => {
              if (!block.boundingBox) return null;
              const [ymin, xmin, ymax, xmax] = block.boundingBox;
              const isSelected = selectedBlockIndex === idx;

              const style: React.CSSProperties = {
                top: `${(ymin / 1000) * 100}%`,
                left: `${(xmin / 1000) * 100}%`,
                height: `${((ymax - ymin) / 1000) * 100}%`,
                width: `${((xmax - xmin) / 1000) * 100}%`,
              };

              return (
                <div
                  key={idx}
                  className={`bbox-overlay ${isSelected ? "active" : ""}`}
                  style={style}
                  onClick={() => onSelectBlock(idx)}
                >
                  <span className="bbox-label">{block.type}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#9ca3af" }}>Interactive Document View</p>
            <p style={{ fontSize: "12px", marginTop: "4px" }}>Preview and visual bounding boxes rendered for extracted blocks.</p>
          </div>
        )}
      </div>
    </div>
  );
};
