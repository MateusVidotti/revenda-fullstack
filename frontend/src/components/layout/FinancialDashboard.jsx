import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Avatar,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  BarElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpenseIcon from '@mui/icons-material/RemoveCircleOutline';
import BalanceIcon from '@mui/icons-material/AccountBalanceWallet';
import PerfilRevendedora from '../PerfilRevendedora';
import api from "../../api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const FinancialDashboard = () => {
  const [revendedor, setRevendedor] = useState(null);
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState({
    faturamento: { labels: [], data: [] },
    pagamento_total: { labels: [], data: [] },
    saldo: { labels: [], data: [] }
  });

  const [categoriaData, setCategoriaData] = useState({
    Feminino: { labels: [], data: [] },
    Masculino: { labels: [], data: [] },
    "Outros": { labels: [], data: [] }
  });

  const [periodo, setPeriodo] = useState('12'); // 1 ano
  const [tipoInfo, setTipoInfo] = useState('total_vendido');

  const getRevendedor = async () => {
    try {
      const res = await api.get('/api/revendedores/');
      if (res.data.length > 0) setRevendedor(res.data[0]);
    } catch (err) {
      alert('Erro ao carregar revendedor');
    }
  };

  const getDashData = () => {
    api.get('/api/dash-data/')
      .then((res) => setData(res.data))
      .catch((err) => alert(err));
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
        pagamento_total: pagamentoRes.data,
        saldo: saldoRes.data,
      });
    } catch (err) {
      alert('Erro ao carregar os dados: ' + err);
    }
  };

  const fetchCategoriaData = async () => {
    const categorias = ['Feminino', 'Masculino', 'Outros'];
    try {
      const promises = categorias.map(cat =>
        api.get(`/api/relatorio-vendas/?periodo=mes&meses=${periodo}&categoria=${cat}`)
      );
      const responses = await Promise.all(promises);

      const newData = {};
      responses.forEach((res, index) => {
        const categoria = categorias[index];
        const labels = res.data.map(item => item.produto_nome);
        const data = res.data.map(item => item[tipoInfo]);
        newData[categoria] = { labels, data };
      });
      setCategoriaData(newData);
    } catch (error) {
      alert('Erro ao buscar dados de categorias: ' + error);
    }
  };

  useEffect(() => {
    getRevendedor();
  }, []);

  useEffect(() => {
    if (revendedor) {
      getDashData();
      getChartData();
    }
  }, [revendedor]);

  useEffect(() => {
    fetchCategoriaData();
  }, [periodo, tipoInfo]);

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

  const createBarChartData = (label, labels, data, color) => ({
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
      }
    ]
  });

  return (
    <div>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <Card sx={{ maxHeight: '95px' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PerfilRevendedora
                  revendedor={revendedor || { nivel: 'Semente', id: 1 }}
                  onNivelChange={(nivel) => {
                    setRevendedor(prev => ({ ...prev, nivel }));
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'green', mr: 2 }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">Recebimento de Vendas</Typography>
                  <Typography variant="h6">{data.total_faturamento}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'red', mr: 2 }}>
                  <ExpenseIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">Pagamento de Produtos</Typography>
                  <Typography variant="h6">{data.total_despesas}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
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
              <Line data={createLineChartData("Faturamento", chartData.faturamento, "rgba(0, 255, 0, 1)")} options={lineChartOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Despesas - Últimos 12 Meses</Typography>
              <Line data={createLineChartData("Despesas", chartData.pagamento_total, "rgba(255, 0, 0, 1)")} options={lineChartOptions} />
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

      <Box display="flex" gap={2} my={2}>
        <FormControl>
          <InputLabel>Período</InputLabel>
          <Select value={periodo} onChange={e => setPeriodo(e.target.value)} label="Período">
            <MenuItem value="1">Último mês</MenuItem>
            <MenuItem value="6">Últimos 6 meses</MenuItem>
            <MenuItem value="12">Último ano</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Tipo de Informação</InputLabel>
          <Select value={tipoInfo} onChange={e => setTipoInfo(e.target.value)} label="Tipo de Informação">
            <MenuItem value="total_vendido">Total Vendido</MenuItem>
            <MenuItem value="valor_total">Valor Total</MenuItem>
            <MenuItem value="lucro_total">Lucro Total</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {['Feminino', 'Masculino', 'Outros'].map((categoria, idx) => (
          <Grid item xs={12} md={4} key={categoria}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">{categoria}</Typography>
                <Bar
                  data={createBarChartData(
                    tipoInfo,
                    categoriaData[categoria].labels,
                    categoriaData[categoria].data,
                    ['#E91E63', '#3F51B5', '#FF9800'][idx]
                  )}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FinancialDashboard;
