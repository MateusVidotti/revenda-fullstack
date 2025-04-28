from rest_framework import serializers
from .models import Revendedor

class RevendedorSerializer(serializers.ModelSerializer):
    percentual_lucro = serializers.SerializerMethodField()

    class Meta:
        model = Revendedor
        fields = ['id', 'nome', 'nivel', 'percentual_lucro']

    def get_percentual_lucro(self, obj):
        return obj.percentual_lucro()