from django.db import models


class Produto(models.Model):
    CATEGORIAS = [
        ('Feminino', 'Feminino'),
        ('Masculino', 'Masculino'),
        ('Infanto Juvenil', 'Infanto Juvenil'),
    ]
    nome = models.CharField(max_length=100)
    codigo_natura = models.CharField(max_length=50, unique=True)
    preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
    estoque_atual = models.IntegerField(default=0)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, blank=True, null=True)
    demanda_semanal = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.nome} ({self.codigo_natura})"
