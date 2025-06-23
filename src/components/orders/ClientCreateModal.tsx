
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from '@/hooks/useClients';

interface ClientCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (clientId: string) => void;
}

const ClientCreateModal = ({ isOpen, onClose, onClientCreated }: ClientCreateModalProps) => {
  const { createClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    type: 'Física',
    status: 'Ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name || !newClient.email || !newClient.phone || !newClient.document) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createClient(newClient);
      if (result.success && result.data) {
        onClientCreated(result.data.id);
        setNewClient({
          name: '',
          email: '',
          phone: '',
          document: '',
          type: 'Física',
          status: 'Ativo'
        });
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewClient({
      name: '',
      email: '',
      phone: '',
      document: '',
      type: 'Física',
      status: 'Ativo'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados básicos do novo cliente
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Pessoa *</Label>
            <Select value={newClient.type} onValueChange={(value) => setNewClient(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Física">Pessoa Física</SelectItem>
                <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">{newClient.type === 'Física' ? 'Nome Completo' : 'Razão Social'} *</Label>
            <Input
              id="name"
              value={newClient.name}
              onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
              placeholder={newClient.type === 'Física' ? 'Digite o nome completo' : 'Digite a razão social'}
              required
            />
          </div>

          <div>
            <Label htmlFor="document">{newClient.type === 'Física' ? 'CPF' : 'CNPJ'} *</Label>
            <Input
              id="document"
              value={newClient.document}
              onChange={(e) => setNewClient(prev => ({ ...prev, document: e.target.value }))}
              placeholder={newClient.type === 'Física' ? 'Digite o CPF' : 'Digite o CNPJ'}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Digite o email"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={newClient.phone}
              onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Digite o telefone"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreateModal;
