import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useClients } from '@/hooks/useClients';
import { Loader2, Eye } from 'lucide-react';

const ClientsManager = () => {
  const { clients, loading, createClient } = useClients();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    fantasy_name: '',
    document: '',
    secondary_document: '',
    contact_person: '',
    phone: '',
    email: '',
    birth_date: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    status: 'Ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.name || !formData.document || !formData.phone || !formData.email) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await createClient({
      type: formData.type as 'fisica' | 'juridica',
      name: formData.name,
      fantasy_name: formData.fantasy_name || null,
      document: formData.document,
      secondary_document: formData.secondary_document || null,
      contact_person: formData.contact_person || null,
      phone: formData.phone,
      email: formData.email,
      birth_date: formData.birth_date || null,
      cep: formData.cep || null,
      street: formData.street || null,
      number: formData.number || null,
      complement: formData.complement || null,
      neighborhood: formData.neighborhood || null,
      city: formData.city || null,
      state: formData.state || null,
      status: formData.status as 'Ativo' | 'Inativo'
    });

    if (result.success) {
      setFormData({
        type: '',
        name: '',
        fantasy_name: '',
        document: '',
        secondary_document: '',
        contact_person: '',
        phone: '',
        email: '',
        birth_date: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        status: 'Ativo'
      });
      setIsDialogOpen(false);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Cadastrar Cliente</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo cliente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="type">Tipo de Cliente</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Nome/Razão Social</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
              </div>

              {formData.type === 'juridica' && (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="fantasy_name">Nome Fantasia</Label>
                  <Input
                    id="fantasy_name"
                    value={formData.fantasy_name}
                    onChange={(e) => handleInputChange('fantasy_name', e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="document">
                    {formData.type === 'fisica' ? 'CPF' : 'CNPJ'}
                  </Label>
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    required
                  />
                </div>

                {formData.type === 'fisica' && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    />
                  </div>
                )}

                {formData.type === 'juridica' && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="secondary_document">Inscrição Estadual</Label>
                    <Input
                      id="secondary_document"
                      value={formData.secondary_document}
                      onChange={(e) => handleInputChange('secondary_document', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {formData.type === 'juridica' && (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="contact_person">Pessoa de Contato</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5 col-span-2">
                  <Label htmlFor="street">Endereço</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => handleInputChange('complement', e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Cliente'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum cliente cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.document}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewClient(client)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar cliente */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedClient.type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedClient.status}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Nome/Razão Social</Label>
                <p className="text-sm text-muted-foreground">{selectedClient.name}</p>
              </div>

              {selectedClient.fantasy_name && (
                <div>
                  <Label className="text-sm font-medium">Nome Fantasia</Label>
                  <p className="text-sm text-muted-foreground">{selectedClient.fantasy_name}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    {selectedClient.type === 'fisica' ? 'CPF' : 'CNPJ'}
                  </Label>
                  <p className="text-sm text-muted-foreground">{selectedClient.document}</p>
                </div>
                {selectedClient.secondary_document && (
                  <div>
                    <Label className="text-sm font-medium">
                      {selectedClient.type === 'fisica' ? 'RG' : 'Inscrição Estadual'}
                    </Label>
                    <p className="text-sm text-muted-foreground">{selectedClient.secondary_document}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">E-mail</Label>
                  <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                </div>
              </div>

              {(selectedClient.street || selectedClient.city) && (
                <div>
                  <Label className="text-sm font-medium">Endereço</Label>
                  <p className="text-sm text-muted-foreground">
                    {[
                      selectedClient.street,
                      selectedClient.number,
                      selectedClient.complement,
                      selectedClient.neighborhood,
                      selectedClient.city,
                      selectedClient.state
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {selectedClient.contact_person && (
                <div>
                  <Label className="text-sm font-medium">Pessoa de Contato</Label>
                  <p className="text-sm text-muted-foreground">{selectedClient.contact_person}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManager;
