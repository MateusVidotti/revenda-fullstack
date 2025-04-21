from django.contrib import admin
from .models import Pagamento

@admin.register(Pagamento)
class PagamentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'pedido', 'valor_pago', 'data_pagamento', 'forma_pagamento')
    list_filter = ('data_pagamento', 'forma_pagamento')
    search_fields = ('pedido__id', 'forma_pagamento')
    ordering = ('-data_pagamento',)