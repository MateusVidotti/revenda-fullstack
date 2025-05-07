from rest_framework import serializers


class SaldoMensalSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    data = serializers.ListField(child=serializers.FloatField())


class HomeSerializer(serializers.Serializer):
    total_faturamento = serializers.FloatField()
    total_despesas = serializers.FloatField()
    saldo = serializers.FloatField()
