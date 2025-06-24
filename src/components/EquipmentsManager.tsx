
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Monitor,
  Settings
} from "lucide-react";
import { useEquipments, Equipment } from '@/hooks/useEquipments';

const EquipmentsManager = () => {
  const { equipments, loading, createEquipment, updateEquipment, deleteEquipment } = useEquipments();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewEquipmentOpen, setIsNewEquipmentOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredEquipments = equipments.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEquipment = async (equipmentData: any) => {
    const result = await createEquipment(equipmentData);
    if (result?.success) {
      setIsNewEquipmentOpen(false);
    }
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsEditOpen(true);
  };

  const handleSaveEquipment = async (equipmentId: string, data: any) => {
    const result = await updateEquipment(equipmentId, data);
    if (result?.success) {
      setIsEditOpen(false);
      setSelectedEquipment(null);
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
      await deleteEquipment(equipmentId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card className="gradient-bg-red text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Gestão de Equipamentos</CardTitle>
              <CardDescription className="text-red-100">
                Controle e gerencie todos os equipamentos
              </CardDescription>
            </div>
            <Dialog open={isNewEquipmentOpen} onOpenChange={setIsNewEquipmentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-red-600 hover:bg-red-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Equipamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Novo Equipamento</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo equipamento
                  </DialogDescription>
                </DialogHeader>
                <EquipmentForm 
                  onSubmit={handleCreateEquipment}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-red-200" />
              <Input
                placeholder="Buscar por nome, modelo ou número de série..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-red-300 text-white placeholder:text-red-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de equipamentos */}
      <Card>
        <CardContent className="p-0">
          {filteredEquipments.length === 0 ? (
            <div className="p-12 text-center">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {equipments.length === 0 ? "Nenhum equipamento encontrado" : "Nenhum equipamento encontrado"}
              </h3>
              <p className="text-gray-600">
                {equipments.length === 0 ? "Comece cadastrando seu primeiro equipamento." : "Tente ajustar os filtros de busca."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Número de Série</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipments.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell className="font-medium">{equipment.name}</TableCell>
                    <TableCell>{equipment.model || 'N/A'}</TableCell>
                    <TableCell>{equipment.serial_number || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{equipment.observations || 'N/A'}</TableCell>
                    <TableCell>{new Date(equipment.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleEditEquipment(equipment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteEquipment(equipment.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de edição */}
      {selectedEquipment && (
        <EquipmentEditModal
          equipment={selectedEquipment}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedEquipment(null);
          }}
          onSave={handleSaveEquipment}
        />
      )}
    </div>
  );
};

// Componente do formulário de novo equipamento
const EquipmentForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    
    if (!name?.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = {
        name: name.trim(),
        model: (formData.get('model') as string) || null,
        serial_number: (formData.get('serial_number') as string) || null,
        observations: (formData.get('observations') as string) || null,
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input 
          name="name"
          placeholder="Nome do equipamento"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="model">Modelo</Label>
        <Input 
          name="model"
          placeholder="Modelo do equipamento"
        />
      </div>
      
      <div>
        <Label htmlFor="serial_number">Número de Série</Label>
        <Input 
          name="serial_number"
          placeholder="Número de série"
        />
      </div>
      
      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea 
          name="observations"
          placeholder="Observações sobre o equipamento..."
          className="min-h-[80px]"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.location.reload()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar Equipamento'}
        </Button>
      </div>
    </form>
  );
};

// Modal para editar equipamento
const EquipmentEditModal = ({ equipment, isOpen, onClose, onSave }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    
    if (!name?.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = {
        name: name.trim(),
        model: (formData.get('model') as string) || null,
        serial_number: (formData.get('serial_number') as string) || null,
        observations: (formData.get('observations') as string) || null,
      };

      await onSave(equipment.id, data);
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Equipamento</DialogTitle>
          <DialogDescription>
            Altere as informações do equipamento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input 
              name="name"
              placeholder="Nome do equipamento"
              defaultValue={equipment.name}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="model">Modelo</Label>
            <Input 
              name="model"
              placeholder="Modelo do equipamento"
              defaultValue={equipment.model || ''}
            />
          </div>
          
          <div>
            <Label htmlFor="serial_number">Número de Série</Label>
            <Input 
              name="serial_number"
              placeholder="Número de série"
              defaultValue={equipment.serial_number || ''}
            />
          </div>
          
          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea 
              name="observations"
              placeholder="Observações sobre o equipamento..."
              className="min-h-[80px]"
              defaultValue={equipment.observations || ''}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentsManager;
