from django.urls import path
from .views import RelatorioEstoqueView

urlpatterns = [
    path('relatorio-estoque/', RelatorioEstoqueView.as_view(), name='relatorio-estoque'),
]
