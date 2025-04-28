from django.contrib import admin
from .models import Revendedor


@admin.register(Revendedor)
class RevendedorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'nivel', 'percentual_lucro')
    list_filter = ('nivel',)
    search_fields = ('nome',)
