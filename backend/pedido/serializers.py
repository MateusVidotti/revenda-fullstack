from rest_framework import serializers
from pedido.models import Pedido, ItemPedido


class ItemPedidoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.ReadOnlyField(source='produto.nome')

    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'produto_nome', 'quantidade', 'valor_unitario']
        read_only_fields = ['valor_unitario']  # calculado automaticamente no `save`


class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True)
    nome_cliente = serializers.CharField(source='cliente.nome', read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    data_pedido = serializers.DateField(read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'nome_cliente', 'status', 'total', 'itens', 'data_pedido']
        read_only_fields = ['data_pedido', 'total', 'nome_cliente']

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        pedido = Pedido.objects.create(**validated_data)

        for item_data in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)

        return pedido

    def update(self, instance, validated_data):
        itens_data = validated_data.pop('itens', None)
        instance.cliente = validated_data.get('cliente', instance.cliente)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        if itens_data is not None:
            instance.itens.all().delete()  # Simples: remove todos os itens antigos
            for item_data in itens_data:
                ItemPedido.objects.create(pedido=instance, **item_data)

        return instance