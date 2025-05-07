from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, RelatorioVendasAPIView
from django.urls import path, include

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('relatorio-vendas/', RelatorioVendasAPIView.as_view(), name='relatorio-vendas'),
]
