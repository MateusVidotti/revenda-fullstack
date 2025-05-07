from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from .serializers import SaldoMensalSerializer, HomeSerializer
from pagamento.models import Pagamento
from ressuprimento.models import Ressuprimento
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated


class RelatorioSaldoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Busca os recebimentos e pagamentos com status 'pago'
        receita_pedidos = Pagamento.objects.all()
        pagamento_produtos = Ressuprimento.objects.filter(data_recebimento__isnull=False)

        meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        data = []
        labels = []

        # Obtém o mês e ano atual
        mes = datetime.now().month + 1
        ano = datetime.now().year

        # Calcula os saldos dos últimos 12 meses
        for i in range(12):
            mes -= 1
            if mes == 0:
                mes = 12
                ano -= 1

            # Soma dos recebimentos e pagamentos no mês/ano
            recebimento = sum(
                r.valor_pago for r in receita_pedidos if r.data_pagamento.month == mes and r.data_pagamento.year == ano
            )
            pagamento = sum(
                p.total for p in pagamento_produtos if p.data_recebimento.month == mes and p.data_recebimento.year == ano
            )

            saldo = recebimento - pagamento
            labels.append(meses[mes - 1])
            data.append(saldo)

        # Prepara os dados para o serializer
        response_data = {'labels': labels[::-1], 'data': data[::-1]}
        serializer = SaldoMensalSerializer(response_data)

        return Response(serializer.data)


class RelatorioFaturamentoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Busca os recebimentos e pagamentos com status 'pago'
        receita_pedidos = Pagamento.objects.all()
        meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        data = []
        labels = []

        # Obtém o mês e ano atual
        mes = datetime.now().month + 1
        ano = datetime.now().year

        # Calcula os saldos dos últimos 12 meses
        for i in range(12):
            mes -= 1
            if mes == 0:
                mes = 12
                ano -= 1

            # Soma dos recebimentos e pagamentos no mês/ano
            recebimento = sum(
                r.valor_pago for r in receita_pedidos if r.data_pagamento.month == mes and r.data_pagamento.year == ano
            )

            saldo = recebimento
            labels.append(meses[mes - 1])
            data.append(saldo)

        # Prepara os dados para o serializer
        response_data = {'labels': labels[::-1], 'data': data[::-1]}
        serializer = SaldoMensalSerializer(response_data)

        return Response(serializer.data)


class RelatorioPagamentoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Busca os recebimentos e pagamentos com status 'pago'
        pagamento_produtos = Ressuprimento.objects.filter(data_recebimento__isnull=False)

        meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        data = []
        labels = []

        # Obtém o mês e ano atual
        mes = datetime.now().month + 1
        ano = datetime.now().year

        # Calcula os saldos dos últimos 12 meses
        for i in range(12):
            mes -= 1
            if mes == 0:
                mes = 12
                ano -= 1
            pagamento = sum(
                p.total for p in pagamento_produtos if p.data_recebimento.month == mes and p.data_recebimento.year == ano
            )
            labels.append(meses[mes - 1])
            data.append(pagamento)

        # Prepara os dados para o serializer
        response_data = {'labels': labels[::-1], 'data': data[::-1]}
        serializer = SaldoMensalSerializer(response_data)
        return Response(serializer.data)


class HomeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Calcula o total recebido e total pago
        total_recebido = Pagamento.objects.all().aggregate(
            total_recebido=Sum('valor_pago')
        )['total_recebido'] or 0

        total_pago = Ressuprimento.objects.filter(data_recebimento__isnull=False).aggregate(
            total_pago=Sum('total')
        )['total_pago'] or 0

        # Calcula o saldo atual
        saldo = total_recebido - total_pago

        # Prepara os dados para o serializer
        response_data = {
            'total_faturamento': total_recebido,
            'total_despesas': total_pago,
            'saldo': saldo,
        }

        serializer = HomeSerializer(response_data)
        return Response(serializer.data)
