from rest_framework import viewsets
from .models import Revendedor
from .serializers import RevendedorSerializer


class RevendedorViewSet(viewsets.ModelViewSet):
    queryset = Revendedor.objects.all()
    serializer_class = RevendedorSerializer
