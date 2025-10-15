import { useState } from "react";
import QrScanner from "react-qr-scanner";
import { Camera, Upload, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ScannerViewProps {
  validCodes: string[];
  onReset: () => void;
}

const ScannerView = ({ validCodes, onReset }: ScannerViewProps) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ code: string; valid: boolean } | null>(null);

  const handleScan = (data: any) => {
    if (data && !result) {
      const scannedText = typeof data === 'string' ? data : data?.text || '';
      if (scannedText) {
        validateCode(scannedText);
      }
    }
  };

  const handleError = (err: any) => {
    console.error("Scanner error:", err);
  };

  const validateCode = (code: string) => {
    // Normalize and search for the code in the database
    const normalizedCode = code.trim().toLowerCase();
    const isValid = validCodes.some(
      (validCode) => validCode.trim().toLowerCase() === normalizedCode
    );
    setResult({ code, valid: isValid });
    setScanning(false);
    
    // Auto-resume scanning after 2 seconds
    setTimeout(() => {
      setResult(null);
      setScanning(true);
    }, 2000);
  };

  const handleScanAgain = () => {
    setResult(null);
    setScanning(true);
  };

  const handleStartScanning = () => {
    setScanning(true);
  };

  const handleStopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Scan QR Code</h2>
          <p className="text-sm text-muted-foreground">
            {validCodes.length} codes in database
          </p>
        </div>

        {/* Scanner/Result Area */}
        <div className="relative">
          {!result ? (
            <div className="w-full aspect-square bg-black">
              {scanning ? (
                <QrScanner
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "100%", height: "100%" }}
                  constraints={{
                    video: { facingMode: "environment" }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-white/50" />
                    <p className="text-white/70 text-sm">
                      Click start to begin scanning
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`w-full aspect-square flex items-center justify-center ${
                result.valid ? "bg-gradient-success" : "bg-gradient-danger"
              }`}
            >
              <div className="text-center p-8 text-white">
                {result.valid ? (
                  <CheckCircle2 className="w-24 h-24 mx-auto mb-6 animate-in zoom-in-50 duration-300" />
                ) : (
                  <XCircle className="w-24 h-24 mx-auto mb-6 animate-in zoom-in-50 duration-300" />
                )}
                <h3 className="text-3xl font-bold mb-2">
                  {result.valid ? "APPROVED" : "DENIED"}
                </h3>
                <p className="text-white/90 font-mono text-sm break-all px-4 mb-4">
                  {result.code}
                </p>
                <p className="text-white/70 text-xs">
                  Auto-scanning next in 2s...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 pt-4 space-y-3">
          {!result ? (
            <>
              {!scanning ? (
                <Button
                  onClick={handleStartScanning}
                  className="w-full"
                  size="lg"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Scanning
                </Button>
              ) : (
                <Button
                  onClick={handleStopScanning}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  Stop Scanning
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleScanAgain}
              className="w-full"
              size="lg"
            >
              Scan Next QR
            </Button>
          )}

          <Button
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New Database
          </Button>
        </div>
      </Card>

      {/* Status indicator */}
      {scanning && !result && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Camera active
        </div>
      )}
    </div>
  );
};

export default ScannerView;
