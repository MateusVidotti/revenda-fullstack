import React, { useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { TextField, Button, Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';


const RessuprimentoForm = () => {
  const { id } = useParams(); // Verifica se há um ID para edição
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    produto: '',
    quantidade: '',
    data_recebimento: '',
  });

  const [produtos, setProdutos] = useState([]);

  const [ressuprimentos, setRessuprimentos] = useState([]); // Armazena ressuprimentos
  const [errors, setErrors] = useState({});

  // Busca ressuprimento da API
  useEffect(() => {
    api.get('/api/ressuprimentos/')
      .then((res) => setRessuprimentos(res.data))
      .catch((err) => alert(`Erro ao buscar ressuprimento: ${err}`));
  }, []);

    // Buscar produtos
    useEffect(() => {
        api.get('/api/produtos/').then(res => setProdutos(res.data));
    }, []);
  

  // Preenche o formulário se estiver editando
  useEffect(() => {
    if (id) {
      api.get(`/api/ressuprimentos/${id}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => alert(`Erro ao buscar ressuprimento: ${err}`));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.produto) newErrors.produto = 'Produto é obrigatório';
    if (!formData.quantidade) newErrors.quantidade = 'Quantidade é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const method = id ? 'put' : 'post'; // Define PUT ou POST
      const url = id ? `/api/ressuprimentos/${id}/` : '/api/ressuprimentos/';
      console.log('FormData:', formData); // Verifica os dados do formulário
      api[method](url, formData)
        .then(() => navigate('/ressuprimentos')) // Redireciona após salvar
        .catch((err) => alert(`Erro ao salvar produto: ${err}`));
    }
  };

  return (
    <>
      <Navbar />
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '50px auto' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Ressuprimento' : 'Solicitar Ressuprimento'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>


          {/* Produto */}
          <FormControl fullWidth margin="normal" error={!!errors.produto}>
            <InputLabel id="produto-label">Produto</InputLabel>
            <Select
              labelId="produto-label"
              name="produto"
              value={formData.produto}
              onChange={handleChange}
              label="Produto"
            >
              {produtos.map((produto) => (
                <MenuItem key={produto.id} value={produto.id}>
                  {produto.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.produto && (
              <Typography variant="caption" color="error">
                {errors.produto}
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Quantidade"
            name="quantidade"
            value={formData.quantidade}
            type='number'
            onChange={handleChange}
            error={!!errors.quantidade}
            helperText={errors.quantidade}
            margin="normal"
          />
            <TextField
            fullWidth
            label="Data recebimento"
            name="data_recebimento"
            type="date" 
            value={formData.data_recebimento}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
                shrink: true, // Necessário para que o label não sobreponha a data
            }}
            />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, backgroundColor: '#7A9E7E', '&:hover': { backgroundColor: '#D8A39D' } }}
          >
            {id ? 'Atualizar Ressuprimento' : 'Criar Ressuprimento'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default RessuprimentoForm;
