from datetime import datetime
from pagamento.models import Pagamento
from pagamento.serializers import PagamentoSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class PagamentoView(viewsets.ModelViewSet):
    """View Fornecedor"""
    queryset = Pagamento.objects.all().order_by('-data_vencimento')
    serializer_class = PagamentoSerializer
    permission_classes = [IsAuthenticated]


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Pagamento
from datetime import datetime


class RelatorioPagamentoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtra os pagamentos com status 'pago'
        pagamentos = Pagamento.objects.filter(status='pago')

        # Meses para exibição no gráfico
        meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

        # Inicializa as listas de dados e labels
        data = {
            'total': [],
            'pessoal': [],
            'encargos': [],
            'administracao': []
        }
        labels = []

        # Define o mês e ano atual
        mes_atual = datetime.now().month + 1
        ano_atual = datetime.now().year

        # Itera pelos 12 meses para calcular os totais de cada classe
        for _ in range(12):
            mes_atual -= 1
            if mes_atual == 0:
                mes_atual = 12
                ano_atual -= 1

            # Filtra os pagamentos do mês atual
            pagamentos_mes = [
                pagamento for pagamento in pagamentos
                if pagamento.data_vencimento.month == mes_atual and pagamento.data_vencimento.year == ano_atual
            ]

            # Inicializa os totais de cada classe
            total_mes = 0
            pessoal_mes = 0
            encargos_mes = 0
            administracao_mes = 0

            # Soma os valores por classe
            for pagamento in pagamentos_mes:
                total_mes += pagamento.valor
                if pagamento.classe == 'Pessoal':
                    pessoal_mes += pagamento.valor
                elif pagamento.classe == 'Encargos':
                    encargos_mes += pagamento.valor
                elif pagamento.classe == 'Administração':
                    administracao_mes += pagamento.valor

            # Adiciona os valores às listas
            data['total'].append(total_mes)
            data['pessoal'].append(pessoal_mes)
            data['encargos'].append(encargos_mes)
            data['administracao'].append(administracao_mes)
            labels.append(meses[mes_atual - 1])

        # Estrutura de dados para resposta
        data_json = {
            'data': {
                'total': data['total'][::-1],
                'pessoal': data['pessoal'][::-1],
                'encargos': data['encargos'][::-1],
                'administracao': data['administracao'][::-1],
            },
            'labels': labels[::-1]
        }

        # Retorna os dados como resposta
        return Response(data_json)


