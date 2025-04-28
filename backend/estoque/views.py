from rest_framework import generics
from produto.models import Produto
from .serializers import RelatorioEstoqueSerializer


class RelatorioEstoqueView(generics.ListAPIView):
    queryset = Produto.objects.all()
    serializer_class = RelatorioEstoqueSerializer

