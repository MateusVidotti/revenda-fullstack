from rest_framework import viewsets
from pedido.models import Pedido
from .serializers import PedidoSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-id')
    serializer_class = PedidoSerializer