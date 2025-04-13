from django.db import models
from produto.models import Produto


class MovimentacaoEstoque(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]

    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.IntegerField()
    data = models.DateField(auto_now_add=True)
    origem = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.tipo} - {self.quantidade}x {self.produto.nome}"
