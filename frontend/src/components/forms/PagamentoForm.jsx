import React, { useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { TextField, Button, Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PagamentoTipoDropdown from './PagamentoTipoDropdown';
import api from '../../api';

const pagamentoStatus = ['pendente', 'pago', 'cancelado'];

const PagamentoForm = () => {
  const { id } = useParams(); // Verifica se há um ID para edição
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fornecedor: '',
    classe: '',
    tipo: '',
    descricao: '',
    valor: '',
    data_vencimento: '',
    status: '',
  });

  const [fornecedores, setFornecedores] = useState([]); // Armazena fornecedores
  const [errors, setErrors] = useState({});

  // Busca fornecedores da API
  useEffect(() => {
    api.get('/api/fornecedores/')
      .then((res) => setFornecedores(res.data))
      .catch((err) => alert(`Erro ao buscar fornecedores: ${err}`));
  }, []);

  // Preenche o formulário se estiver editando
  useEffect(() => {
    if (id) {
      api.get(`/api/pagamentos/${id}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => alert(`Erro ao buscar pagamento: ${err}`));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
    
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fornecedor) newErrors.fornecedor = 'Fornecedor é obrigatório';
    if (!formData.tipo) newErrors.tipo = 'Tipo é obrigatório';
    if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.valor) newErrors.valor = 'Valor é obrigatório';
    if (!formData.data_vencimento) newErrors.data_vencimento = 'Data de vencimento é obrigatória';
    if (!formData.status) newErrors.status = 'Status é obrigatório';
    setErrors(newErrors);
    console.log(errors)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const method = id ? 'put' : 'post'; // Define PUT ou POST
      const url = id ? `/api/pagamentos/${id}/` : '/api/pagamentos/';

      api[method](url, formData)
        .then(() => navigate('/pagamentos')) // Redireciona após salvar
        .catch((err) => alert(`Erro ao salvar pagamento: ${err}`));
    }
  };

  return (
    <>
      <Navbar />
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '50px auto' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Pagamento' : 'Criar Novo Pagamento'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {id ? (
            <TextField
              fullWidth
              label="Fornecedor"
              value={formData.fornecedor.nome || ''}
              InputProps={{ readOnly: true }}
              margin="normal"
            />
          ) : (
            <FormControl fullWidth margin="normal">
              <InputLabel>Fornecedor</InputLabel>
              <Select
                name="fornecedor"
                value={formData.fornecedor}
                onChange={handleChange}
                error={!!errors.fornecedor}
              >
                {fornecedores.map((fornecedor) => (
                  <MenuItem key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.fornecedor && (
                <Typography color="error" variant="body2">
                  {errors.fornecedor}
                </Typography>
              )}
            </FormControl>
          )}
          <PagamentoTipoDropdown 
            name='tipo'
            error={!!errors.tipo}
            helperText={errors.tipo}
            setFormData={setFormData} 
          />
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            error={!!errors.descricao}
            helperText={errors.descricao}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            error={!!errors.valor}
            helperText={errors.valor}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Data vencimento"
            name="data_vencimento"
            type="date"
            value={formData.data_vencimento}
            onChange={handleChange}
            error={!!errors.data_vencimento}
            helperText={errors.data_vencimento}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            error={!!errors.status}
            helperText={errors.status}
            margin="normal"
          >
            {pagamentoStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {id ? 'Atualizar Pagamento' : 'Criar Pagamento'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default PagamentoForm;
