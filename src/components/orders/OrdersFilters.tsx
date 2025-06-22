
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Scan } from "lucide-react";
import BarcodeScanner from "@/components/BarcodeScanner";

interface OrdersFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const OrdersFilters = ({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusChange 
}: OrdersFiltersProps) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleBarcodeScan = (code: string) => {
    onSearchChange(code);
    setIsScannerOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por número, cliente ou descrição..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsScannerOpen(true)}
        title="Escanear código de barras"
      >
        <Scan className="h-4 w-4" />
      </Button>
      
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="Aberta">Aberta</SelectItem>
          <SelectItem value="Pendente">Pendente</SelectItem>
          <SelectItem value="Em Andamento">Em Andamento</SelectItem>
          <SelectItem value="Pausada">Pausada</SelectItem>
          <SelectItem value="Finalizada">Finalizada</SelectItem>
          <SelectItem value="Cancelada">Cancelada</SelectItem>
        </SelectContent>
      </Select>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
        title="Escanear Código de Barras"
      />
    </div>
  );
};

export default OrdersFilters;
