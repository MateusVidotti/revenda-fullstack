from rest_framework import viewsets
from .models import Ressuprimento
from .serializers import RessuprimentoSerializer


class RessuprimentoViewSet(viewsets.ModelViewSet):
    queryset = Ressuprimento.objects.all().order_by('-data_pedido')
    serializer_class = RessuprimentoSerializer