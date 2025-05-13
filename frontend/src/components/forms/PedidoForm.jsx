import React, { useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

const pedidoStatus = ['Pendente', 'Pago', 'Cancelado'];

const PedidoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cliente: '',
    status: '',
  });

  const [itens, setItens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [novoItem, setNovoItem] = useState({ produto: '', quantidade: 1 });
  const [errors, setErrors] = useState({});

  // Buscar clientes e produtos
  useEffect(() => {
    api.get('/api/clientes/').then(res => setClientes(res.data));
    api.get('/api/produtos/').then(res => setProdutos(res.data));
  }, []);

  // Preencher dados se estiver editando (opcional)
  useEffect(() => {
    if (id) {
      api.get(`/api/pedidos/${id}/`).then((res) => {
        setFormData({
          cliente: res.data.cliente,
          status: res.data.status,
        });
        setItens(res.data.itens.map(item => ({
          produto: item.produto,
          quantidade: item.quantidade
        })));
      });
    }
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNovoItemChange = (e) => {
    const { name, value } = e.target;
    setNovoItem(prev => ({ ...prev, [name]: value }));
  };

  const adicionarItem = () => {
    const produtoSelecionado = produtos.find(p => p.id === parseInt(novoItem.produto));
  
    if (!produtoSelecionado) {
      alert('Selecione um produto válido.');
      return;
    }
  
    const quantidade = parseInt(novoItem.quantidade);
    if (quantidade <= 0) {
      alert('Quantidade deve ser maior que zero.');
      return;
    }
  
    if (quantidade > produtoSelecionado.estoque_atual) {
      alert(`Quantidade excede o estoque disponível (${produtoSelecionado.estoque_atual}).`);
      return;
    }
  
    setItens(prev => [...prev, novoItem]);
    setNovoItem({ produto: '', quantidade: 1 });
  };

  const removerItem = (index) => {
    setItens(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cliente) newErrors.cliente = 'Cliente é obrigatório';
    if (!formData.status) newErrors.status = 'Status é obrigatório';
    if (itens.length === 0) newErrors.itens = 'Adicione ao menos um item';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const method = id ? 'put' : 'post';
      const url = id ? `/api/pedidos/${id}/` : '/api/pedidos/';
      const payload = {
        cliente: parseInt(formData.cliente),
        status: formData.status,
        itens: itens.map(item => ({
          produto: parseInt(item.produto),
          quantidade: parseInt(item.quantidade),
        }))
      };

      api[method](url, payload)
        .then(() => navigate('/pedidos'))
        .catch(err => alert(`Erro ao salvar pedido: ${err}`));
    }
  };

  return (
    <>
      <Navbar />
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: '50px auto' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Pedido' : 'Criar Novo Pedido'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>

          {/* Cliente */}
          <FormControl fullWidth margin="normal" error={!!errors.cliente}>
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              label="Cliente"
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.cliente && (
              <Typography variant="caption" color="error">
                {errors.cliente}
              </Typography>
            )}
          </FormControl>

          {/* Status */}
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
            {pedidoStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          {/* Subform de Itens */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Itens do Pedido
          </Typography>
          <Box display="flex" gap={2} alignItems="center" marginBottom={2}>
            <FormControl fullWidth>
              <InputLabel id="produto-label">Produto</InputLabel>
                <Select
                    labelId="produto-label"
                    name="produto"
                    value={novoItem.produto}
                    onChange={handleNovoItemChange}
                    label="Produto"
                    >
                    {produtos.map((p) => (
                        <MenuItem
                        key={p.id}
                        value={p.id}
                        disabled={p.estoque_atual <= 0}
                        style={p.estoque_atual <= 0 ? { color: 'gray' } : {}}
                        >
                        {p.nome} (Estoque: {p.estoque_atual})
                        </MenuItem>
                    ))}
                </Select>

            </FormControl>
            <TextField
              name="quantidade"
              label="Quantidade"
              type="number"
              value={novoItem.quantidade}
              onChange={handleNovoItemChange}
              inputProps={{ min: 1 }}
            />
            <Button 
              variant="contained" 
              onClick={adicionarItem}
              sx={{ backgroundColor: '#7A9E7E', width: '200px', '&:hover': { backgroundColor: '#D8A39D' } }}>
            Adicionar
            </Button>
          </Box>
          {errors.itens && (
            <Typography variant="caption" color="error">
              {errors.itens}
            </Typography>
          )}

          {/* Lista de itens adicionados */}
          {itens.map((item, index) => {
            const produto = produtos.find(p => p.id === parseInt(item.produto));
            return (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography>{produto?.nome || 'Produto'} - {item.quantidade} un.</Typography>
                <Button color="error" onClick={() => removerItem(index)}>Remover</Button>
              </Box>
            );
          })}

          {/* Botão submit */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, backgroundColor: '#7A9E7E', '&:hover': { backgroundColor: '#D8A39D' } }}
          >
            {id ? 'Atualizar Pedido' : 'Criar Pedido'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default PedidoForm;
