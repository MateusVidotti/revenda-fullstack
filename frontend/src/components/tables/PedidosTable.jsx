import { useState, useEffect } from "react";
import { IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormDataGrid from '../layout/FormDataGrid';
import { useNavigate } from 'react-router-dom';
import api from "../../api";

function PedidosTable() {
  const [rows, setRows] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    api
      .get('/api/pedidos/')
      .then((res) => res.data)
      .then((data) => {
        setRows(data);
      })
      .catch((err) => alert(err))
  }

  const deleteRow = (id) => {
    api
        .delete(`/api/pedidos/${id}/`)
        .then((res) => {
            if (res.status === 204) alert("Pedido deletado!");
            else alert("Falha ao deletar Pedido.");
            getAll();
        })
        .then(data => {
          setRows(rows.filter((row) => row.id !== id))

        })
        .catch((error) => alert(error));
};
  
  const handleEdit = (id) => {
    navigate(`/pedido/editar/${id}`);
  };

  const handleDelete = (id) => {
    deleteRow(id);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome_cliente', headerName: 'Nome do Cliente', type: 'text', width: 200 },
    { field: 'estoque_atual', headerName: 'Estoque', width: 100 },
    { field: 'data_pedido', headerName: 'Data Pedido', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'total', headerName: 'Total', type: 'number', width: 100 },
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

export default PedidosTable