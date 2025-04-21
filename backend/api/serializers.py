from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
#
#
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}
#
#
# class SaldoMensalSerializer(serializers.Serializer):
#     labels = serializers.ListField(child=serializers.CharField())
#     data = serializers.ListField(child=serializers.FloatField())
#
#
# class ProximoPagamentoSerializer(serializers.ModelSerializer):
#     fornecedor_nome = serializers.CharField(source='fornecedor.nome', read_only=True)
#     class Meta:
#         model = Pagamento
#         fields = ['id', 'fornecedor_nome', 'classe', 'tipo', 'valor', 'data_vencimento', 'descricao', 'status']
#
#
# class ProximoRecebimentoSerializer(serializers.ModelSerializer):
#     aluno_nome = serializers.CharField(source='aluno.nome', read_only=True)
#     class Meta:
#         model = Recebimento
#         fields = ['id', 'aluno_nome', 'valor', 'data_vencimento', 'descricao', 'status']
#
#
# class HomeSerializer(serializers.Serializer):
#     tb_pagamentos = ProximoPagamentoSerializer(many=True)
#     tb_recebimentos = ProximoRecebimentoSerializer(many=True)
#     total_faturamento = serializers.FloatField()
#     total_despesas = serializers.FloatField()
#     saldo = serializers.FloatField()
#
