import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

          // Extract ALL values from ALL cells in the entire Excel sheet
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
              title: "Empty file",
              description: "No valid codes found in the Excel file.",
              variant: "destructive",
            });
            return;
          }

          onFileUpload(codes);
          toast({
            title: "File uploaded successfully",
            description: `Loaded ${codes.length} codes from all cells in the database.`,
          });
        } catch (error) {
          toast({
            title: "Error parsing file",
            description: "Failed to read Excel file. Please check the format.",
            variant: "destructive",
          });
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">QR Validator</h1>
          <p className="text-muted-foreground">
            Upload your Excel database to start validating QR codes
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Excel files (.xlsx, .xls) or CSV
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
            <p className="text-xs font-medium text-foreground">File format:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• All cells with data will be scanned</li>
              <li>• Any format supported (rows, columns, mixed)</li>
              <li>• Empty cells are automatically skipped</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadView;
