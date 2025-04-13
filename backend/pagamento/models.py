from django.db import models
from pedido.models import Pedido


class Pagamento(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    valor_pago = models.DecimalField(max_digits=10, decimal_places=2)
    data_pagamento = models.DateField()
    forma_pagamento = models.CharField(max_length=50)

    def __str__(self):
        return f"Pagamento Pedido {self.pedido.id} - R$ {self.valor_pago}"
