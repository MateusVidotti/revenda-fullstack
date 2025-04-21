from django.core.exceptions import ValidationError
from django.db import models
from cliente.models import Cliente
from produto.models import Produto


class Pedido(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Pago', 'Pago'),
        ('Cancelado', 'Cancelado'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    data_pedido = models.DateField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')

    def __str__(self):
        return f"Pedido #{self.id} - {self.cliente.nome}"

    def calcular_total(self):
        total = sum(item.subtotal for item in self.itens.all())
        return total

    def save(self, *args, **kwargs):
        # Primeiro calcula o total antes de salvar
        super().save(*args, **kwargs)  # Salva para garantir que o ID já existe
        self.total = self.calcular_total()
        super().save(update_fields=['total'])


class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.valor_unitario:
            self.valor_unitario = self.produto.preco_venda

        # ⚠️ Verifica se há estoque suficiente
        if self.pk is None:  # Só valida na criação do item (não na edição)
            if self.quantidade > self.produto.estoque_atual:
                raise ValidationError(f"Estoque insuficiente para o produto '{self.produto.nome}'. Disponível: {self.produto.estoque_atual}, solicitado: {self.quantidade}.")

        super().save(*args, **kwargs)

    @property
    def subtotal(self):
        return self.quantidade * self.valor_unitario

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome}"
