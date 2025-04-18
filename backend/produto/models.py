from django.db import models


class Produto(models.Model):
    nome = models.CharField(max_length=100)
    codigo_natura = models.CharField(max_length=50, unique=True)
    preco_custo = models.DecimalField(max_digits=10, decimal_places=2)
    preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
    estoque_atual = models.IntegerField(default=0)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    data_validade = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.nome} ({self.codigo_natura})"
