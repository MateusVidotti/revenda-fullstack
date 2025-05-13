from decimal import Decimal
from django.db import models
from revendedor.models import Revendedor
from produto.models import Produto


class Ressuprimento(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    data_pedido = models.DateField(auto_now_add=True)
    data_recebimento = models.DateField(blank=True, null=True)
    fornecedor = models.CharField(max_length=100, default='Fornecedor Padrão')

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome} - {self.fornecedor}"

    def get_percentual_lucro(self):
        revendedor = Revendedor.objects.first()
        if revendedor:
            return Decimal(revendedor.percentual_lucro()) / 100
        return Decimal('0.3')  # Valor padrão: 30%

    def get_preco_custo(self):
        percentual_lucro = self.get_percentual_lucro()
        return self.produto.preco_venda * (Decimal('1.0') - percentual_lucro)

    @property
    def total(self):
        preco_custo = self.get_preco_custo()
        return (preco_custo * self.quantidade).quantize(Decimal('0.01'))
