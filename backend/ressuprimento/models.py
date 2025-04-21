from django.db import models
from produto.models import Produto


class Ressuprimento(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    data_pedido = models.DateField(auto_now_add=True)
    data_recebimento = models.DateField(blank=True, null=True)
    fornecedor = models.CharField(max_length=100, default='Fornecedor Padrão')

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome} - {self.fornecedor}"