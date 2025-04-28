import React, { useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { TextField, Button, Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

const pagamentoStatus = ['pendente', 'pago', 'cancelado'];

const RecebimentoForm = () => {
  const { id } = useParams(); // Verifica se há um ID para edição
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aluno: '',
    descricao: '',
    valor: '',
    data_vencimento: '',
    status: '',
  });

  const [alunos, setAlunos] = useState([]); // Armazena alunos
  const [errors, setErrors] = useState({});

  // Busca alunos da API
  useEffect(() => {
    api.get('/api/alunos/')
      .then((res) => setAlunos(res.data))
      .catch((err) => alert(`Erro ao buscar alunos: ${err}`));
  }, []);

  // Preenche o formulário se estiver editando
  useEffect(() => {
    if (id) {
      api.get(`/api/recebimentos/${id}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => alert(`Erro ao buscar recebimento: ${err}`));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.aluno) newErrors.aluno = 'Aluno é obrigatório';
    if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.valor) newErrors.valor = 'Valor é obrigatório';
    if (!formData.data_vencimento) newErrors.data_vencimento = 'Data de vencimento é obrigatória';
    if (!formData.status) newErrors.status = 'Status é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const method = id ? 'put' : 'post'; // Define PUT ou POST
      const url = id ? `/api/recebimentos/${id}/` : '/api/recebimentos/';

      api[method](url, formData)
        .then(() => navigate('/recebimentos')) // Redireciona após salvar
        .catch((err) => alert(`Erro ao salvar recebimento: ${err}`));
    }
  };

  return (
    <>
      <Navbar />
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '50px auto' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Recebimento' : 'Criar Novo Recebimento'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {id ? (
            <TextField
              fullWidth
              label="Aluno"
              value={formData.aluno.nome || ''}
              InputProps={{ readOnly: true }}
              margin="normal"
            />
          ) : (
            <FormControl fullWidth margin="normal">
              <InputLabel>Aluno</InputLabel>
              <Select
                name="aluno"
                value={formData.aluno}
                onChange={handleChange}
                error={!!errors.aluno}
              >
                {alunos.map((aluno) => (
                  <MenuItem key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.aluno && (
                <Typography color="error" variant="body2">
                  {errors.aluno}
                </Typography>
              )}
            </FormControl>
          )}

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

export default RecebimentoForm;
