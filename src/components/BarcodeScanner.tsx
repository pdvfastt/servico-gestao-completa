
import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X } from "lucide-react";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
  title: string;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onClose, onScan, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader();
      }

      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('Nenhuma câmera encontrada');
      }

      // Usar a primeira câmera disponível ou a câmera traseira se disponível
      const selectedDeviceId = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('traseira')
      )?.deviceId || videoInputDevices[0].deviceId;

      if (videoRef.current) {
        await readerRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, error) => {
          if (result) {
            const scannedCode = result.getText();
            console.log('Código escaneado:', scannedCode);
            onScan(scannedCode);
            stopScanning();
            onClose();
          }
          if (error && !(error.name === 'NotFoundException')) {
            console.error('Erro no scanner:', error);
          }
        });
      }
    } catch (err) {
      console.error('Erro ao iniciar scanner:', err);
      setError(err instanceof Error ? err.message : 'Erro ao acessar a câmera');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            Posicione o código de barras dentro da área de visualização
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={startScanning}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg"
                autoPlay
                playsInline
                muted
              />
              {isScanning && (
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-2 bg-red-500 opacity-75 animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
