
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ClientEquipmentManager from './ClientEquipmentManager';

interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  type: string;
}

interface ClientEquipmentDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClientEquipmentDialog: React.FC<ClientEquipmentDialogProps> = ({ 
  client, 
  open, 
  onOpenChange 
}) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Gerenciar Equipamentos
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ClientEquipmentManager 
          client={client} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientEquipmentDialog;
