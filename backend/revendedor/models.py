from django.db import models


class Revendedor(models.Model):
    NIVEIS_CHOICES = [
        ('Semente', 'Semente'),
        ('Bronze', 'Bronze'),
        ('Prata', 'Prata'),
        ('Ouro', 'Ouro'),
        ('Diamante', 'Diamante'),
    ]

    nome = models.CharField(max_length=100)
    nivel = models.CharField(max_length=20, choices=NIVEIS_CHOICES, default='Semente')

    def percentual_lucro(self):
        return {
            'Semente': 30,
            'Bronze': 35,
            'Prata': 40,
            'Ouro': 45,
            'Diamante': 60,
        }.get(self.nivel, 0)

    def __str__(self):
        return f"{self.nome} ({self.nivel})"
