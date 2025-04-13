from django.contrib import admin
from produto.models import Produto


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['nome', 'preco_venda', 'estoque_atual']
    search_fields = ['nome']
    list_filter = ['preco_venda']
