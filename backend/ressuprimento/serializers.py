from rest_framework import serializers
from .models import Ressuprimento


class RessuprimentoSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    produto_nome = serializers.ReadOnlyField(source='produto.nome')
    data_recebimento = serializers.DateField(allow_null=True, required=False)

    class Meta:
        model = Ressuprimento
        fields = ['id', 'produto', 'produto_nome', 'quantidade', 'data_pedido', 'data_recebimento', 'status', 'total']

    def get_status(self, obj):
        if obj.data_recebimento:
            return "Produto recebido"
        return "Pedido realizado"

    def to_internal_value(self, data):
        """
        Converte '' em None para o campo data_recebimento.
        """
        if data.get('data_recebimento') == '':
            data['data_recebimento'] = None
        return super().to_internal_value(data)
