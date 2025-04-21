from rest_framework import serializers
from .models import Ressuprimento


class RessuprimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ressuprimento
        fields = '__all__'
