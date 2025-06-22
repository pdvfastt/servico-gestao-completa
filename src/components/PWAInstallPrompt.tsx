
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const isMobile = useIsMobile();

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
        size={isMobile ? "sm" : "sm"}
        onClick={() => setShowInstallDialog(true)}
        className="flex items-center space-x-1 md:space-x-2 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 text-xs md:text-sm"
      >
        <Download className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">App</span>
      </Button>

      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-md max-w-[90vw] mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm md:text-base">
              <Smartphone className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              Instalar Sistema de Gestão de OS
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Instale nosso aplicativo para ter acesso rápido e usar offline. 
              O app será instalado no seu dispositivo como um aplicativo nativo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 bg-orange-50 rounded-lg">
            <div className="flex-shrink-0">
              <img 
                src="https://i.postimg.cc/ZYXtxzM8/logoadmin.png" 
                alt="Logo" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-contain bg-white p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">Sistema de Gestão de OS</h4>
              <p className="text-xs md:text-sm text-gray-600 truncate">Gestão completa de ordens de serviço</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowInstallDialog(false)}
              className="w-full sm:w-auto text-xs md:text-sm"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleInstallClick}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-xs md:text-sm"
            >
              <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Instalar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWAInstallPrompt;
