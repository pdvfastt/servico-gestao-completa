
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Monitor, 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  Link,
  Unlink,
  Eye
} from "lucide-react";
import { useClientEquipments } from '@/hooks/useClientEquipments';
import { useEquipments } from '@/hooks/useEquipments';

interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  type: string;
}

interface ClientEquipmentManagerProps {
  client: Client;
  onClose?: () => void;
}

const ClientEquipmentManager: React.FC<ClientEquipmentManagerProps> = ({ client, onClose }) => {
  const { clientEquipments, loading, linkEquipment, unlinkEquipment, updateClientEquipment } = useClientEquipments(client.id);
  const { equipments } = useEquipments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [linkObservations, setLinkObservations] = useState('');

  // Filtrar equipamentos disponíveis (não vinculados a este cliente)
  const availableEquipments = equipments.filter(equipment => 
    !clientEquipments.some(ce => ce.equipment_id === equipment.id)
  );

  // Filtrar equipamentos vinculados
  const filteredClientEquipments = clientEquipments.filter(ce => {
    const matchesSearch = ce.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ce.equipment?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ce.equipment?.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ce.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleLinkEquipment = async () => {
    if (!selectedEquipmentId) return;
    
    const result = await linkEquipment(selectedEquipmentId, linkObservations);
    if (result.success) {
      setIsLinkDialogOpen(false);
      setSelectedEquipmentId('');
      setLinkObservations('');
    }
  };

  const handleUnlinkEquipment = async (clientEquipmentId: string) => {
    await unlinkEquipment(clientEquipmentId);
  };

  const handleStatusChange = async (clientEquipmentId: string, newStatus: string) => {
    await updateClientEquipment(clientEquipmentId, { status: newStatus as 'ativo' | 'inativo' });
  };

  return (
    <div className="space-y-6">
      {/* Header com informações do cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Equipamentos - {client.name}</span>
          </CardTitle>
          <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <strong>Documento:</strong> {client.document}
              </div>
              <div>
                <strong>E-mail:</strong> {client.email}
              </div>
              <div>
                <strong>Telefone:</strong> {client.phone}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Controles e filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Equipamentos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por nome, modelo ou número de série..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="min-w-[150px]">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Vincular Equipamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Vincular Equipamento ao Cliente</DialogTitle>
                  <DialogDescription>
                    Selecione um equipamento disponível para vincular ao cliente {client.name}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="equipment-select">Equipamento</Label>
                    <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um equipamento..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEquipments.map((equipment) => (
                          <SelectItem key={equipment.id} value={equipment.id}>
                            {equipment.name} {equipment.model && `- ${equipment.model}`}
                            {equipment.serial_number && ` (S/N: ${equipment.serial_number})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="observations">Observações (opcional)</Label>
                    <Textarea
                      id="observations"
                      placeholder="Observações sobre o vínculo..."
                      value={linkObservations}
                      onChange={(e) => setLinkObservations(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsLinkDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleLinkEquipment}
                    disabled={!selectedEquipmentId}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Vincular
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de equipamentos vinculados */}
      <Card>
        <CardHeader>
          <CardTitle>Equipamentos Vinculados ({filteredClientEquipments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando equipamentos...</p>
            </div>
          ) : filteredClientEquipments.length === 0 ? (
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum equipamento vinculado encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Número de Série</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Vinculado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientEquipments.map((clientEquipment) => (
                    <TableRow key={clientEquipment.id}>
                      <TableCell className="font-medium">
                        {clientEquipment.equipment?.name}
                      </TableCell>
                      <TableCell>
                        {clientEquipment.equipment?.model || '-'}
                      </TableCell>
                      <TableCell>
                        {clientEquipment.equipment?.serial_number || '-'}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={clientEquipment.status} 
                          onValueChange={(value) => handleStatusChange(clientEquipment.id, value)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Ativo
                              </Badge>
                            </SelectItem>
                            <SelectItem value="inativo">
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                Inativo
                              </Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={clientEquipment.observations || ''}>
                          {clientEquipment.observations || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(clientEquipment.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Unlink className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Desvinculação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja desvincular o equipamento "{clientEquipment.equipment?.name}" 
                                  do cliente "{client.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleUnlinkEquipment(clientEquipment.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Desvincular
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientEquipmentManager;
