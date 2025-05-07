import { useState, useEffect } from "react";
import { IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormDataGrid from '../layout/FormDataGrid';
import { useNavigate } from 'react-router-dom';
import api from "../../api";

function ProdutosTable() {
  const [rows, setRows] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    api
      .get('/api/relatorio-estoque/')
      .then((res) => res.data)
      .then((data) => {
        setRows(data);
      })
      .catch((err) => alert(err))
  }

  const deleteRow = (id) => {
    api
        .delete(`/api/produtos/${id}/`)
        .then((res) => {
            if (res.status === 204) alert("Produto deletado!");
            else alert("Falha ao deletar Produto.");
            getAll();
        })
        .then(data => {
          setRows(rows.filter((row) => row.id !== id))

        })
        .catch((error) => alert(error));
};
  
  const handleEdit = (id) => {
    navigate(`/produto/editar/${id}`);
  };

  const handleDelete = (id) => {
    deleteRow(id);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', type: 'text', width: 150 },
    { field: 'estoque_atual', headerName: 'Estoque', width: 70 },
    { field: 'demanda_semanal', headerName: 'Demanda Semanal', width: 70 },
    { field: 'quantidade_indicada_ressuprimento', headerName: 'Ressuprimento', width: 70 },
    { field: 'preco_venda', headerName: 'Preço Venda', type: 'number', width: 70 },
    { field: 'preco_custo', headerName: 'Preço Custo', type: 'number', width: 70 },
    { field: 'lucro_unitario', headerName: 'Lucro Unitário', type: 'number', width: 70 },
    { field: 'quantidade_vendida', headerName: 'Quantidade Vendida', type: 'number', width: 70 },
    { field: 'lucro_total', headerName: 'Lucro Total', type: 'number', width: 70 },
    {
      field: 'Opções',
      headerName: 'Opções',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            color="primary" 
            onClick={() => handleEdit(params.id)}
            aria-label="editar"
            sx={{ backgroundColor: '#white', color: '#7A9E7E', '&:hover': { color: '#D8A39D' } }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDelete(params.id)}
            aria-label="deletar"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
      <FormDataGrid rows={rows} columns={columns}></FormDataGrid>
  );
}

export default ProdutosTable