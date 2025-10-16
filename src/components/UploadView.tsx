import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface UploadViewProps {
  onFileUpload: (data: string[]) => void;
}

const UploadView = ({ onFileUpload }: UploadViewProps) => {
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const XLSX = await import("xlsx");
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          // Extraer TODOS los valores de TODAS las celdas en toda la hoja de Excel
          const codes: string[] = [];
          jsonData.forEach((row: any) => {
            if (Array.isArray(row)) {
              row.forEach((cell: any) => {
                const cellValue = String(cell || "").trim();
                if (cellValue.length > 0) {
                  codes.push(cellValue);
                }
              });
            }
          });

          if (codes.length === 0) {
            toast({
              title: "Archivo vacío",
              description: "No se encontraron códigos válidos en el archivo de Excel.",
              variant: "destructive",
            });
            return;
          }

          // Limpiar códigos escaneados previamente al subir nueva base de datos
          localStorage.removeItem("scannedQRCodes");
          
          onFileUpload(codes);
          toast({
            title: "Archivo cargado exitosamente",
            description: `Se cargaron ${codes.length} códigos de todas las celdas en la base de datos.`,
          });
        } catch (error) {
          toast({
            title: "Error al analizar archivo",
            description: "No se pudo leer el archivo de Excel. Por favor verifique el formato.",
            variant: "destructive",
          });
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar el archivo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <img src={logo} alt="Secretaría de Marina" className="mx-auto w-24 h-24 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Validador QR</h1>
          <p className="text-muted-foreground">
            Sube tu base de datos en Excel para comenzar a validar códigos QR
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Haz clic para subir o arrastra y suelta
              </p>
              <p className="text-xs text-muted-foreground">
                Archivos Excel (.xlsx, .xls) o CSV
              </p>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-foreground">Formato del archivo:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Se escanearán todas las celdas con datos</li>
              <li>• Se admite cualquier formato (filas, columnas, mixto)</li>
              <li>• Las celdas vacías se omiten automáticamente</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadView;