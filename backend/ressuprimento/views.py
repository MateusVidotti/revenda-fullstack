from rest_framework import viewsets
from ressuprimento.models import Ressuprimento
from ressuprimento.serializers import RessuprimentoSerializer
from django.db.models import Case, When, Value, IntegerField


class RessuprimentoViewSet(viewsets.ModelViewSet):
    queryset = Ressuprimento.objects.all()
    serializer_class = RessuprimentoSerializer

    def get_queryset(self):
        return Ressuprimento.objects.annotate(
            data_null=Case(
                When(data_recebimento__isnull=True, then=Value(0)),
                default=Value(1),
                output_field=IntegerField(),
            )
        ).order_by('data_null', 'data_pedido')