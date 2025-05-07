from django.db import models
from produto.models import Produto
from revendedor.models import Revendedor


class Ressuprimento(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    data_pedido = models.DateField(auto_now_add=True)
    data_recebimento = models.DateField(blank=True, null=True)
    fornecedor = models.CharField(max_length=100, default='Fornecedor Padrão')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome} - {self.fornecedor}"

    def get_percentual_lucro(self):
        revendedor = Revendedor.objects.first()
        if revendedor:
            return revendedor.percentual_lucro() / 100  # Converte para decimal
        return 0.3  # Valor padrão se não tiver revendedor (30%)

    def get_preco_custo(self):
        percentual_lucro = self.get_percentual_lucro()
        return float(self.produto.preco_venda) * (1 - percentual_lucro)

    def calcular_total(self):
        preco_custo = self.get_preco_custo()
        return round(preco_custo * self.quantidade, 2)

    def save(self, *args, **kwargs):
        # Salva para garantir que o objeto tenha um ID (se precisar)
        super().save(*args, **kwargs)
        self.total = self.calcular_total()
        super().save(update_fields=['total'])
