from decimal import Decimal
from django.db.models import Sum
from pedido.models import ItemPedido
from produto.models import Produto
from rest_framework import serializers
from revendedor.models import Revendedor



class RelatorioEstoqueSerializer(serializers.ModelSerializer):
    quantidade_indicada_ressuprimento = serializers.SerializerMethodField()
    preco_custo = serializers.SerializerMethodField()
    preco_venda = serializers.SerializerMethodField()
    lucro_unitario = serializers.SerializerMethodField()
    quantidade_vendida = serializers.SerializerMethodField()
    lucro_total = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = [
            'id',
            'nome',
            'categoria',
            'estoque_atual',
            'demanda_semanal',
            'quantidade_indicada_ressuprimento',
            'preco_venda',
            'preco_custo',
            'lucro_unitario',
            'quantidade_vendida',
            'lucro_total',
        ]

    def get_preco_venda(self, obj):
        return float(obj.preco_venda)

    def get_revendedor(self):
        return Revendedor.objects.first()  # Só pega o único revendedor cadastrado

    def get_percentual_lucro(self):
        revendedor = self.get_revendedor()
        if revendedor:
            return revendedor.percentual_lucro() / 100  # Converte para decimal
        return 0.3  # Valor padrão se não tiver revendedor (30%)

    def get_preco_custo(self, obj):
        percentual_lucro = self.get_percentual_lucro()
        return float(obj.preco_venda) * (1 - percentual_lucro)

    def get_quantidade_indicada_ressuprimento(self, obj):
        if obj.demanda_semanal is not None:
            demanda_2_semanas = obj.demanda_semanal * 2
            if obj.estoque_atual < demanda_2_semanas:
                return demanda_2_semanas - obj.estoque_atual
            else:
                return 0
        return 0

    def get_lucro_unitario(self, obj):
        preco_custo = self.get_preco_custo(obj)
        return float(obj.preco_venda) - preco_custo

    def get_quantidade_vendida(self, obj):
        quantidade_vendida = ItemPedido.objects.filter(
            produto=obj,
            pedido__status='Pago'
        ).aggregate(total=Sum('quantidade'))['total'] or 0
        return quantidade_vendida

    def get_lucro_total(self, obj):
        return round(self.get_lucro_unitario(obj) * self.get_quantidade_vendida(obj), 2)
