import { useState, useEffect } from "react";
import { IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormDataGrid from '../layout/FormDataGrid';
import { useNavigate } from 'react-router-dom';
import api from "../../api";

function RecebimentosTable() {
  const [rows, setRows] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    api
      .get('/api/recebimentos/')
      .then((res) => res.data)
      .then((data) => {
        setRows(data);
        console.log(data)
      })
      .catch((err) => alert(err))
  }

  const deleteRow = (id) => {
    api
        .delete(`/api/recebimentos/${id}/`)
        .then((res) => {
            if (res.status === 204) alert("Recebimento deletado!");
            else alert("Falha ao deletar recebimento.");
            getAll();
        })
        .then(data => {
          setRows(rows.filter((row) => row.id !== id))

        })
        .catch((error) => alert(error));
};
  
  const handleEdit = (id) => {
    navigate(`/recebimento/editar/${id}`);
  };

  const handleDelete = (id) => {
    deleteRow(id);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'aluno_nome', headerName: 'Aluno', width: 150 },
    { field: 'descricao', headerName: 'Descrição', width: 300 },
    { field: 'valor', headerName: 'Valor', width: 150 },
    { field: 'data_emissao', headerName: 'Data emissão', width: 200 },
    { field: 'data_vencimento', headerName: 'Data vencimento', width: 200 },
    { field: 'status', headerName: 'Status', type: 'text', width: 100 },
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

export default RecebimentosTable