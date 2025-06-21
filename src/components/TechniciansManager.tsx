
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Loader2, Eye } from 'lucide-react';

const TechniciansManager = () => {
  const { technicians, loading, createTechnician } = useTechnicians();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    level: '',
    hourly_rate: '',
    specialties: '',
    status: 'Ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpf || !formData.phone || !formData.email || !formData.level) {
      return;
    }

    setIsSubmitting(true);
    
    const specialtiesArray = formData.specialties ? 
      formData.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0) : 
      [];
    
    const result = await createTechnician({
      name: formData.name,
      cpf: formData.cpf,
      phone: formData.phone,
      email: formData.email,
      address: formData.address || null,
      level: formData.level as 'Júnior' | 'Pleno' | 'Sênior',
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      specialties: specialtiesArray.length > 0 ? specialtiesArray : null,
      status: formData.status as 'Ativo' | 'Inativo' | 'Férias' | 'Licença'
    });

    if (result.success) {
      setFormData({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        address: '',
        level: '',
        hourly_rate: '',
        specialties: '',
        status: 'Ativo'
      });
      setIsDialogOpen(false);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewTechnician = (technician: any) => {
    setSelectedTechnician(technician);
    setIsViewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Inativo': return 'bg-red-100 text-red-800';
      case 'Férias': return 'bg-blue-100 text-blue-800';
      case 'Licença': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Técnicos</h2>
          <p className="text-muted-foreground">Gerencie sua equipe técnica</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Cadastrar Técnico</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Técnico</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo técnico
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
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

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Endereço completo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="level">Nível</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Júnior">Júnior</SelectItem>
                      <SelectItem value="Pleno">Pleno</SelectItem>
                      <SelectItem value="Sênior">Sênior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="hourly_rate">Valor/Hora (R$)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="specialties">Especialidades</Label>
                <Input
                  id="specialties"
                  value={formData.specialties}
                  onChange={(e) => handleInputChange('specialties', e.target.value)}
                  placeholder="Ex: Elétrica, Hidráulica, Ar Condicionado (separadas por vírgula)"
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Férias">Férias</SelectItem>
                    <SelectItem value="Licença">Licença</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Técnico'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Técnicos Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os técnicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : technicians.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum técnico cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technicians.map((technician) => (
                  <TableRow key={technician.id}>
                    <TableCell className="font-medium">{technician.name}</TableCell>
                    <TableCell>{technician.cpf}</TableCell>
                    <TableCell>{technician.phone}</TableCell>
                    <TableCell>{technician.level}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(technician.status)}`}>
                        {technician.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTechnician(technician)}
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

      {/* Dialog para visualizar técnico */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Técnico</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Nome</Label>
                <p className="text-sm text-muted-foreground">{selectedTechnician.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">CPF</Label>
                  <p className="text-sm text-muted-foreground">{selectedTechnician.cpf}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedTechnician.phone}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">E-mail</Label>
                <p className="text-sm text-muted-foreground">{selectedTechnician.email}</p>
              </div>

              {selectedTechnician.address && (
                <div>
                  <Label className="text-sm font-medium">Endereço</Label>
                  <p className="text-sm text-muted-foreground">{selectedTechnician.address}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nível</Label>
                  <p className="text-sm text-muted-foreground">{selectedTechnician.level}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedTechnician.status}</p>
                </div>
              </div>

              {selectedTechnician.hourly_rate && (
                <div>
                  <Label className="text-sm font-medium">Valor por Hora</Label>
                  <p className="text-sm text-muted-foreground">R$ {selectedTechnician.hourly_rate.toFixed(2)}</p>
                </div>
              )}

              {selectedTechnician.specialties && (
                <div>
                  <Label className="text-sm font-medium">Especialidades</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTechnician.specialties.join(', ')}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Avaliação</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedTechnician.rating ? `${selectedTechnician.rating}/5` : 'Sem avaliação'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechniciansManager;
