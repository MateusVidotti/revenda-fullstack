# from rest_framework.views import APIView
# from rest_framework.response import Response
# from datetime import datetime
# from .serializers import SaldoMensalSerializer
# from pagamento.models import Pagamento
# from recebimento.models import Recebimento
# from django.db.models import Sum
# from .serializers import HomeSerializer
# from rest_framework.permissions import IsAuthenticated
#
#
# class RelatorioSaldoAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         # Busca os recebimentos e pagamentos com status 'pago'
#         recebimentos = Recebimento.objects.filter(status='pago')
#         pagamentos = Pagamento.objects.filter(status='pago')
#
#         meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
#         data = []
#         labels = []
#
#         # Obtém o mês e ano atual
#         mes = datetime.now().month + 1
#         ano = datetime.now().year
#
#         # Calcula os saldos dos últimos 12 meses
#         for i in range(12):
#             mes -= 1
#             if mes == 0:
#                 mes = 12
#                 ano -= 1
#
#             # Soma dos recebimentos e pagamentos no mês/ano
#             recebimento = sum(
#                 r.valor for r in recebimentos if r.data_vencimento.month == mes and r.data_vencimento.year == ano
#             )
#             pagamento = sum(
#                 p.valor for p in pagamentos if p.data_vencimento.month == mes and p.data_vencimento.year == ano
#             )
#
#             saldo = recebimento - pagamento
#             labels.append(meses[mes - 1])
#             data.append(saldo)
#
#         # Prepara os dados para o serializer
#         response_data = {'labels': labels[::-1], 'data': data[::-1]}
#         serializer = SaldoMensalSerializer(response_data)
#
#         return Response(serializer.data)
#
#
# class HomeAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         # Obtém os próximos pagamentos e recebimentos pendentes
#         proximos_pagamentos = Pagamento.objects.filter(status='pendente').order_by('data_vencimento')[:3]
#         proximos_recebimentos = Recebimento.objects.filter(status='pendente').order_by('data_vencimento')[:3]
#
#         # Calcula o total recebido e total pago
#         total_recebido = Recebimento.objects.filter(status='pago').aggregate(
#             total_recebido=Sum('valor')
#         )['total_recebido'] or 0
#
#         total_pago = Pagamento.objects.filter(status='pago').aggregate(
#             total_pago=Sum('valor')
#         )['total_pago'] or 0
#
#         # Calcula o saldo atual
#         saldo = total_recebido - total_pago
#
#         # Prepara os dados para o serializer
#         response_data = {
#             'tb_pagamentos': proximos_pagamentos,
#             'tb_recebimentos': proximos_recebimentos,
#             'total_faturamento': total_recebido,
#             'total_despesas': total_pago,
#             'saldo': saldo,
#         }
#
#         serializer = HomeSerializer(response_data)
#         return Response(serializer.data)