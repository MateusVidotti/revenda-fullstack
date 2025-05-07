from django.urls import path
from . import views

urlpatterns = [
    path('relatorio-saldo/', views.RelatorioSaldoAPIView.as_view(), name='relatorio-saldo'),
    path('relatorio-faturamento/', views.RelatorioFaturamentoAPIView.as_view(), name='relatorio-faturamento'),
    path('relatorio-pagamento/', views.RelatorioPagamentoAPIView.as_view(), name='relatorio-pagamento'),
    path('dash-data/', views.HomeAPIView.as_view(), name='dash-data'),
]
