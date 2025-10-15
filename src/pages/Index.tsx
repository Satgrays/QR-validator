import { useState } from "react";
import UploadView from "@/components/UploadView";
import ScannerView from "@/components/ScannerView";

const Index = () => {
  const [validCodes, setValidCodes] = useState<string[]>([]);

  const handleFileUpload = (codes: string[]) => {
    setValidCodes(codes);
  };

  const handleReset = () => {
    setValidCodes([]);
  };

  return (
    <>
      {validCodes.length === 0 ? (
        <UploadView onFileUpload={handleFileUpload} />
      ) : (
        <ScannerView validCodes={validCodes} onReset={handleReset} />
      )}
    </>
  );
};

export default Index;
