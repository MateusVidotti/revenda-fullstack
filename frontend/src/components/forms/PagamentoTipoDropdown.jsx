import React from 'react';
import {  Typography, Select, InputLabel, FormControl } from '@mui/material';

export default function PagamentoTipoDropdown({ name, error, helperText, setFormData }) {

    const handleChange = (event) => {
        const valorSelecionado = event.target.value;
        
        let classe = '';
        let tipo = '';

        // Definindo as categorias e subcategorias
        if (valorSelecionado === '1') {
            classe = 'Pessoal';
            tipo = 'Folha Líquida';
        } else if (valorSelecionado === '2') {
            classe = 'Pessoal';
            tipo = 'Recisões';
        } else if (valorSelecionado === '3') {
            classe = 'Encargos';
            tipo = 'FGTS';
        } else if (valorSelecionado === '4') {
            classe = 'Encargos';
            tipo = 'INSS';
        } else if (valorSelecionado === '5') {
            classe = 'Administração';
            tipo = 'Material de Limpeza/Conservação';
        } else if (valorSelecionado === '6') {
            classe = 'Administração';
            tipo = 'Energia Elétrica';
        } else if (valorSelecionado === '7') {
            classe = 'Administração';
            tipo = 'Água';
        } else if (valorSelecionado === '8') {
            classe = 'Administração';
            tipo = 'Telefone/Internet';
        } else if (valorSelecionado === '9') {
            classe = 'Administração';
            tipo = 'IPTU/ISS/Taxas Diversas';
        } else if (valorSelecionado === '10') {
            classe = 'Administração';
            tipo = 'Aluguel';
        } else if (valorSelecionado === '11') {
            classe = 'Administração';
            tipo = 'Seguros';
        } else if (valorSelecionado === '12') {
            classe = 'Administração';
            tipo = 'Serviços de Terceiros';
        }

        // Atualizando o formData com a classe e tipo selecionados
        setFormData((prevData) => ({
            ...prevData,
            classe,
            tipo
        }));
    };

    return (
        <div>
              <FormControl fullWidth margin="normal" error={error}>
                <InputLabel htmlFor="grouped-native-select">Tipo</InputLabel>
                <Select
                    name={name}
                    native
                    defaultValue=""
                    id="grouped-native-select"
                    label="Grouping"
                    onChange={handleChange}
                >
                    <option aria-label="None" value="" />
                    <optgroup label="Pessoal">
                        <option value="1">Folha Líquida</option>
                        <option value="2">Recisões</option>
                    </optgroup>
                    <optgroup label="Encargos">
                        <option value="3">FGTS</option>
                        <option value="4">INSS</option>
                    </optgroup>
                    <optgroup label="Administração">
                        <option value="5">Material de Limpeza/Conservação</option>
                        <option value="6">Energia Elétrica</option>
                        <option value="7">Água</option>
                        <option value="8">Telefone/Internet</option>
                        <option value="9">IPTU/ISS/Taxas Diversas</option>
                        <option value="10">Aluguel</option>
                        <option value="11">Seguros</option>
                        <option value="12">Serviços de Terceiros</option>
                    </optgroup>
                </Select>
                {error && (
                <Typography color="error" variant="body2">
                    {helperText}
                </Typography>
                )}
            </FormControl>
        </div>
    );
}
