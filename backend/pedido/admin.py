from django.contrib import admin
from pedido.models import ItemPedido, Pedido


class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 1
    fields = ['produto', 'quantidade']  # Não mostra o campo valor_unitario


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'data_pedido', 'status']
    list_filter = ['status', 'data_pedido']
    search_fields = ['cliente__nome']
    inlines = [ItemPedidoInline]
