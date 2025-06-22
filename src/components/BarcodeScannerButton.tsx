
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";
import BarcodeScanner from './BarcodeScanner';

interface BarcodeScannerButtonProps {
  onScan: (code: string) => void;
  title?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  className?: string;
}

const BarcodeScannerButton: React.FC<BarcodeScannerButtonProps> = ({
  onScan,
  title = "Escanear Código de Barras",
  variant = "outline",
  size = "default",
  disabled = false,
  className = ""
}) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleOpenScanner = () => {
    console.log('🔍 Abrindo scanner de código de barras');
    setIsScannerOpen(true);
  };

  const handleCloseScanner = () => {
    console.log('🔒 Fechando scanner de código de barras');
    setIsScannerOpen(false);
  };

  const handleScan = (code: string) => {
    console.log('✅ Código escaneado pelo botão:', code);
    onScan(code);
    setIsScannerOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleOpenScanner}
        disabled={disabled}
        className={`flex items-center space-x-2 ${className}`}
      >
        <ScanBarcode className="h-4 w-4" />
        {size !== "icon" && <span>Scanner</span>}
      </Button>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={handleCloseScanner}
        onScan={handleScan}
        title={title}
      />
    </>
  );
};

export default BarcodeScannerButton;
