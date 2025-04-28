import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpenseIcon from '@mui/icons-material/RemoveCircleOutline';
import BalanceIcon from '@mui/icons-material/AccountBalanceWallet';
import api from "../../api";

// Registra as escalas e componentes necessários
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const FinancialDashboard = () => {
    const [data, setData] = useState({});
    const [chartData, setChartData] = useState({
        faturamento: { labels: [], data: [] },
        pagamento_total: { labels: [], data: [] },
        saldo: { labels: [], data: [] }
    });
    const [selectedClass, setSelectedClass] = useState('total'); // Estado para o seletor de classe de despesas

    useEffect(() => {
        getDashData();
        getChartData();
    }, []);

    const getDashData = () => {
        api
            .get('/api/dash-data/')
            .then((res) => setData(res.data))
            .catch((err) => alert(err))
    };

    const getChartData = async () => {
        try {
            const [faturamentoRes, pagamentoRes, saldoRes] = await Promise.all([
                api.get('/api/relatorio-faturamento/'),
                api.get('/api/relatorio-pagamento/'),
                api.get('/api/relatorio-saldo/'),
            ]);

            setChartData({
                faturamento: faturamentoRes.data,
                pagamento_total: { labels: pagamentoRes.data.labels, data: pagamentoRes.data.data.total }, 
                pagamento_pessoal: { labels: pagamentoRes.data.labels, data: pagamentoRes.data.data.pessoal },
                pagamento_encargos: { labels: pagamentoRes.data.labels, data: pagamentoRes.data.data.encargos },
                pagamento_administracao: { labels: pagamentoRes.data.labels, data: pagamentoRes.data.data.administracao },
                saldo: saldoRes.data
            });
        } catch (err) {
            alert('Erro ao carregar os dados: ' + err);
        }
    };

    // Função para lidar com a mudança da classe de despesa
    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    };

    const createLineChartData = (label, { labels, data }, color) => ({
        labels,
        datasets: [
            {
                label,
                data,
                borderColor: color,
                backgroundColor: color.replace('1)', '0.2)'),
                fill: true,
                tension: 0.4,
            },
        ],
    });

    return (
        <div>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'green', mr: 2 }}>
                                    <AttachMoneyIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2">Total Faturamento</Typography>
                                    <Typography variant="h6">{data.total_faturamento}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'red', mr: 2 }}>
                                    <ExpenseIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2">Total Despesas</Typography>
                                    <Typography variant="h6">{data.total_despesas}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'blue', mr: 2 }}>
                                    <BalanceIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2">Saldo</Typography>
                                    <Typography variant="h6">{data.saldo}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={2}>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2">Faturamento - Últimos 12 Meses</Typography>
                            <Line data={createLineChartData("Faturamento", chartData.faturamento, "rgba(0, 128, 0, 1)")} options={lineChartOptions} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle2">Despesas - Últimos 12 Meses</Typography>
                                <FormControl variant="outlined" size="small" sx={{ minWidth: 115 }}>
                                    <InputLabel>Classe despesa</InputLabel>
                                    <Select
                                        value={selectedClass}
                                        onChange={handleClassChange}
                                        label="Classe despesa"
                                    >
                                        <MenuItem value="total">Total</MenuItem>
                                        <MenuItem value="pessoal">Pessoal</MenuItem>
                                        <MenuItem value="encargos">Encargos</MenuItem>
                                        <MenuItem value="administracao">Administração</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Line data={createLineChartData("Despesas", chartData[`pagamento_${selectedClass}`], "rgba(255, 0, 0, 1)")} options={lineChartOptions} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2">Lucro/Prejuízo - Últimos 12 Meses</Typography>
                            <Line data={createLineChartData("Lucro/Prejuízo", chartData.saldo, "rgba(0, 0, 255, 1)")} options={lineChartOptions} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Próximos Pagamentos</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fornecedor</TableCell>
                                            <TableCell>Classe</TableCell>
                                            <TableCell>Descrição</TableCell>
                                            <TableCell>Valor</TableCell>
                                            <TableCell>Data Vencimento</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.tb_pagamentos && data.tb_pagamentos.map((pagamento, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{pagamento.fornecedor_nome}</TableCell>
                                                <TableCell>{pagamento.classe}</TableCell>
                                                <TableCell>{pagamento.descricao}</TableCell>
                                                <TableCell>{pagamento.valor}</TableCell>
                                                <TableCell>{pagamento.data_vencimento}</TableCell>
                                                <TableCell>{pagamento.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Próximos Recebimentos</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Aluno</TableCell>
                                            <TableCell>Descrição</TableCell>
                                            <TableCell>Valor</TableCell>
                                            <TableCell>Data Vencimento</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.tb_recebimentos && data.tb_recebimentos.map((recebimento, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{recebimento.aluno_nome}</TableCell>
                                                <TableCell>{recebimento.descricao}</TableCell>
                                                <TableCell>{recebimento.valor}</TableCell>
                                                <TableCell>{recebimento.data_vencimento}</TableCell>
                                                <TableCell>{recebimento.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default FinancialDashboard;
