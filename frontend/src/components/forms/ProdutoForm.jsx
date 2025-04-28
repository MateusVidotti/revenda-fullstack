import React, { useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { TextField, Button, Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

const produtoCategoria = ['Feminino', 'Masculino', 'Infanto Juvenil'];

const ProdutoForm = () => {
  const { id } = useParams(); // Verifica se há um ID para edição
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    codigo_natura: '',
    preco_venda: '',
    categoria: '',
    demanda_semanal: '',
  });

  const [produtos, setProdutos] = useState([]); // Armazena produtos
  const [errors, setErrors] = useState({});

  // Busca produtos da API
  useEffect(() => {
    api.get('/api/produtos/')
      .then((res) => setProdutos(res.data))
      .catch((err) => alert(`Erro ao buscar produtos: ${err}`));
  }, []);

  // Preenche o formulário se estiver editando
  useEffect(() => {
    if (id) {
      api.get(`/api/produtos/${id}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => alert(`Erro ao buscar produto: ${err}`));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.codigo_natura) newErrors.codigo_natura = 'Código produto é obrigatório';
    if (!formData.preco_venda) newErrors.preco_venda = 'Preço venda é obrigatório';
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.demanda_semanal) newErrors.demanda_semanal = 'Demanda Semanal é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const method = id ? 'put' : 'post'; // Define PUT ou POST
      const url = id ? `/api/produtos/${id}/` : '/api/produtos/';

      api[method](url, formData)
        .then(() => navigate('/produtos')) // Redireciona após salvar
        .catch((err) => alert(`Erro ao salvar produto: ${err}`));
    }
  };

  return (
    <>
      <Navbar />
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '50px auto' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Produto' : 'Criar Novo Produto'}
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
            label="Código Natura"
            name="codigo_natura"
            value={formData.codigo_natura}
            onChange={handleChange}
            error={!!errors.codigo_natura}
            helperText={errors.codigo_natura}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Preco de Venda"
            name="preco_venda"
            value={formData.preco_venda}
            onChange={handleChange}
            error={!!errors.preco_venda}
            helperText={errors.preco_venda}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Demanda Semanal"
            name="demanda_semanal"
            value={formData.demanda_semanal}
            onChange={handleChange}
            error={!!errors.demanda_semanal}
            helperText={errors.demanda_semanal}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            fullWidth
            label="Caetegoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            error={!!errors.categoria}
            helperText={errors.categoria}
            margin="normal"
          >
            {produtoCategoria.map((categoria) => (
              <MenuItem key={categoria} value={categoria}>
                {categoria.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, backgroundColor: '#7A9E7E', '&:hover': { backgroundColor: '#D8A39D' } }}
          >
            {id ? 'Atualizar Produto' : 'Criar Produto'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default ProdutoForm;
