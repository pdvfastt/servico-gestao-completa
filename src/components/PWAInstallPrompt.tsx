
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA foi instalado');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar o PWA');
    } else {
      console.log('Usuário recusou instalar o PWA');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
    setShowInstallDialog(false);
  };

  if (!isInstallable) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInstallDialog(true)}
        className="flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700"
      >
        <Download className="h-4 w-4" />
        <span>Instalar App</span>
      </Button>

      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-orange-600" />
              Instalar Sistema de Gestão de OS
            </DialogTitle>
            <DialogDescription>
              Instale nosso aplicativo para ter acesso rápido e usar offline. 
              O app será instalado no seu dispositivo como um aplicativo nativo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
            <div className="flex-shrink-0">
              <img 
                src="https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png" 
                alt="Logo" 
                className="h-12 w-12 rounded-lg object-contain bg-white p-1"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Sistema de Gestão de OS</h4>
              <p className="text-sm text-gray-600">Gestão completa de ordens de serviço</p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowInstallDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleInstallClick}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWAInstallPrompt;
