import { useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import { Camera, Upload, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo.png";

interface ScannerViewProps {
  validCodes: string[];
  onReset: () => void;
}

type ScanResult = {
  code: string;
  valid: boolean;
  alreadyScanned?: boolean;
};

const SCANNED_CODES_KEY = "scannedQRCodes";

const ScannerView = ({ validCodes, onReset }: ScannerViewProps) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);

  // Load scanned codes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SCANNED_CODES_KEY);
    if (saved) {
      try {
        setScannedCodes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load scanned codes:", e);
      }
    }
  }, []);

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
    
    // Check if already scanned
    if (scannedCodes.includes(normalizedCode)) {
      setResult({ code, valid: false, alreadyScanned: true });
      setScanning(false);
      
      // Auto-resume scanning after 2 seconds
      setTimeout(() => {
        setResult(null);
        setScanning(true);
      }, 2000);
      return;
    }
    
    // Check if valid
    const isValid = validCodes.some(
      (validCode) => validCode.trim().toLowerCase() === normalizedCode
    );
    
    // If valid, add to scanned list
    if (isValid) {
      const updatedScanned = [...scannedCodes, normalizedCode];
      setScannedCodes(updatedScanned);
      localStorage.setItem(SCANNED_CODES_KEY, JSON.stringify(updatedScanned));
    }
    
    setResult({ code, valid: isValid, alreadyScanned: false });
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
          <img src={logo} alt="Secretaría de Marina" className="mx-auto w-20 h-20 mb-3" />
          <h2 className="text-2xl font-bold mb-2">Escanear Código QR</h2>
          <p className="text-sm text-muted-foreground">
            {validCodes.length} códigos en la base de datos
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
                      Haz clic en iniciar para comenzar a escanear
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
                  {result.valid ? "APROBADO" : result.alreadyScanned ? "YA ESCANEADO" : "DENEGADO"}
                </h3>
                <p className="text-white/90 font-mono text-sm break-all px-4 mb-4">
                  {result.code}
                </p>
                <p className="text-white/70 text-xs">
                  Escaneando siguiente en 2s...
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
                  Iniciar Escaneo
                </Button>
              ) : (
                <Button
                  onClick={handleStopScanning}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  Detener Escaneo
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleScanAgain}
              className="w-full"
              size="lg"
            >
              Escanear Siguiente QR
            </Button>
          )}

          <Button
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Cargar Nueva Base de Datos
          </Button>
        </div>
      </Card>

      {/* Status indicator */}
      {scanning && !result && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Cámara activa
        </div>
      )}
    </div>
  );
};

export default ScannerView;
