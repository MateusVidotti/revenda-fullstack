from rest_framework import serializers
from pagamento.models import Pagamento


class PagamentoSerializer(serializers.ModelSerializer):
    fornecedor_nome = serializers.CharField(source='fornecedor.nome', read_only=True)
    class Meta:
        model = Pagamento
        fields = ['id', 'fornecedor', 'fornecedor_nome', 'classe', 'tipo', 'descricao', 'valor', 'data_emissao', 'data_vencimento', 'status']
        extra_kwargs = {
            'id': {'required': False},
            'fornecedor': {'required': True},
            'classe': {'required': True},
            'tipo': {'required': True},
            'descricao': {'required': True},
            'valor': {'required': True},
            'data_emissao': {'required': True},
            'data_vencimento': {'required': True},
            'status': {'required': True},
        }

    def to_internal_value(self, data):
        # Inclui o ID na validação
        ret = super().to_internal_value(data)
        ret['id'] = data.get('id', None)  # Captura o ID se estiver presente
        return ret
