import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Box, Select, MenuItem } from '@mui/material';
import api from '../api';

const niveis = [
  { nome: 'Semente', icone: '🌱' },
  { nome: 'Bronze', icone: '🥉' },
  { nome: 'Prata', icone: '🥈' },
  { nome: 'Ouro', icone: '🥇' },
  { nome: 'Diamante', icone: '💎' },
];

const PerfilRevendedora = ({ revendedor, onNivelChange }) => {
  const [nivel, setNivel] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchNivelAtual = async () => {
      try {
        const res = await api.get(`/api/revendedores/${revendedor.id}/`);
        setNivel(res.data.nivel);
      } catch (err) {
        console.error('Erro ao carregar dados do revendedor:', err);
      } finally {
        setCarregando(false);
      }
    };
    fetchNivelAtual();
  }, [revendedor.id]);

  const handleNivelChange = async (e) => {
    const novoNivel = e.target.value;
    setNivel(novoNivel);
    try {
      await api.patch(`/api/revendedores/${revendedor.id}/`, { nivel: novoNivel });
      onNivelChange(novoNivel);
    } catch (err) {
      alert('Erro ao atualizar nível');
    }
  };

  const nivelData = niveis.find((n) => n.nome === nivel);

  if (carregando) return null;

  return (
    <CardContent>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography fontSize={32}>{nivelData?.icone}</Typography>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Revendedora</Typography>
          <Typography variant="h6">
            Nível:
            <Select
              value={nivel}
              onChange={handleNivelChange}
              variant="standard"
              disableUnderline
              sx={{ ml: 1, minWidth: 120 }}
            >
              {niveis.map((n) => (
                <MenuItem key={n.nome} value={n.nome}>
                  {n.nome}
                </MenuItem>
              ))}
            </Select>
          </Typography>
        </Box>
      </Box>
    </CardContent>
  );
};

export default PerfilRevendedora;
