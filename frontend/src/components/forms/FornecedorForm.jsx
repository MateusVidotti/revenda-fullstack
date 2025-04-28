import React, { useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { TextField, Button, Box, Typography, Paper, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import SiglaEstados from '../data/Estados';

// Lista de estados brasileiros para popular o campo de estado
const estados = SiglaEstados();

const FornecedorForm = () => {
  const { id } = useParams(); // Verifica se há um ID para edição
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    documento: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [errors, setErrors] = useState({});
  

  useEffect(() => {
    if (id) {
      api.get(`/api/fornecedores/${id}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => alert(`Erro ao buscar fornecedor: ${err}`));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'O nome é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'O telefone é obrigatório';
    if (!formData.documento) newErrors.documento = 'CPF/CNPJ é obrigatório';
    if (!/^\d{11}|\d{14}$/.test(formData.documento))
      newErrors.documento = 'CPF/CNPJ inválido';
    if (!formData.rua) newErrors.rua = 'Logradouro é obrigatório';
    if (!formData.numero) newErrors.numero = 'Número é obrigatório';
    if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const method = id ? 'put' : 'post'; // Define PUT ou POST
      const url = id ? `/api/fornecedores/${id}/` : '/api/fornecedores/';

      api[method](url, formData)
        .then(() => navigate('/fornecedores')) // Redireciona após salvar
        .catch((err) => alert(`Erro ao salvar fornecedor: ${err}`));
    }
  };

  return (
    <>
         <Navbar/>
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '50px auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {id ? 'Editar Fornecedor' : 'Criar Novo Fornecedor'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          error={!!errors.nome}
          helperText={errors.nome}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          error={!!errors.telefone}
          helperText={errors.telefone}
          margin="normal"
        />
        <TextField
          fullWidth
          label="CPF/CNPJ"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          error={!!errors.documento}
          helperText={errors.documento}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Logradouro"
          name="rua"
          value={formData.rua}
          onChange={handleChange}
          error={!!errors.rua}
          helperText={errors.rua}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Número"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          error={!!errors.numero}
          helperText={errors.numero}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Bairro"
          name="bairro"
          value={formData.bairro}
          onChange={handleChange}
          error={!!errors.bairro}
          helperText={errors.bairro}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Cidade"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          error={!!errors.cidade}
          helperText={errors.cidade}
          margin="normal"
        />
        <TextField
          select
          fullWidth
          label="Estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          error={!!errors.estado}
          helperText={errors.estado}
          margin="normal"
        >
          {estados.map((estado) => (
            <MenuItem key={estado} value={estado}>
              {estado}
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
          {id ? 'Atualizar Fornecedor' : 'Criar Fornecedor'}
        </Button>
      </Box>
        </Paper>
    </>
  );
};

export default FornecedorForm;
