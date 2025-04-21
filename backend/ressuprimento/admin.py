from django.contrib import admin
from .models import Ressuprimento


@admin.register(Ressuprimento)
class RessuprimentoAdmin(admin.ModelAdmin):
    list_display = ('produto', 'quantidade', 'data_pedido', 'data_recebimento')
    list_filter = ('data_pedido', 'data_recebimento', 'produto__categoria')
    search_fields = ('produto__nome', 'produto__codigo_natura')
    autocomplete_fields = ['produto']
