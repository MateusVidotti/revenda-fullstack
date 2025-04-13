from django.contrib import admin
from estoque.models import MovimentacaoEstoque


@admin.register(MovimentacaoEstoque)
class MovimentacaoEstoqueAdmin(admin.ModelAdmin):
    list_display = ['produto', 'tipo', 'quantidade', 'data', 'origem']
    list_filter = ['tipo', 'data']
    search_fields = ['produto__nome', 'origem']
