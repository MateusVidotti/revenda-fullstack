from django.contrib import admin
from cliente.models import Cliente


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nome', 'telefone', 'documento', 'logradouro', 'numero', 'bairro', 'cidade', 'estado']
    search_fields = ['nome', 'telefone', 'documento', 'logradouro', 'numero', 'bairro', 'cidade', 'estado']
