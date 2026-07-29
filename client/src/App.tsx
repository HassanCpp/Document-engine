import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dropzone } from "./components/Dropzone";
import { SplitView } from "./components/SplitView";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { StructuredDocument, EngineMode } from "../src/types";

export function App() {
  const [engineMode, setEngineMode] = useState<EngineMode>("offline");
  const [apiKey, setApiKey] = useState<string>("");
  const [hasEnvApiKey, setHasEnvApiKey] = useState<boolean>(true);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [extractedDoc, setExtractedDoc] = useState<StructuredDocument | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [markdownOutput, setMarkdownOutput] = useState<string>("");
  const [validationReportOutput, setValidationReportOutput] = useState<string>("");
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasEnvApiKey !== undefined) {
          setHasEnvApiKey(data.hasEnvApiKey);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectEngineMode = (mode: EngineMode) => {
    setEngineMode(mode);
    if (mode === "ai" && !hasEnvApiKey && !apiKey) {
      setIsApiKeyModalOpen(true);
    }
  };

  const handleFileSelected = async (file: File) => {
    if (engineMode === "ai" && !hasEnvApiKey && !apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("engineMode", engineMode);
    if (apiKey) formData.append("apiKey", apiKey);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process document");
      }

      setExtractedDoc(data.document);
      setPageImages(data.pageImages || []);
      setMarkdownOutput(data.markdownOutput || "");
      setValidationReportOutput(data.validationReportOutput || "");
      setProcessingLogs(data.logs || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setExtractedDoc(null);
    setPageImages([]);
    setMarkdownOutput("");
    setValidationReportOutput("");
    setProcessingLogs([]);
    setError(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header
        onReset={handleReset}
        hasDocument={Boolean(extractedDoc)}
        engineMode={engineMode}
      />

      <main className="app-main">
        {error && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#f43f5e",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              zIndex: 100,
              boxShadow: "0 10px 25px rgba(244, 63, 94, 0.4)",
            }}
          >
            {error}
          </div>
        )}

        {!extractedDoc ? (
          <Dropzone
            onFileSelected={handleFileSelected}
            isProcessing={isProcessing}
            engineMode={engineMode}
            setEngineMode={handleSelectEngineMode}
          />
        ) : (
          <SplitView
            document={extractedDoc}
            pageImages={pageImages}
            markdownOutput={markdownOutput}
            validationReportOutput={validationReportOutput}
            logs={processingLogs}
          />
        )}
      </main>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={(key) => setApiKey(key)}
        currentKey={apiKey}
      />
    </div>
  );
}

export default App;
