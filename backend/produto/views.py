from rest_framework import viewsets
from .models import Produto
from .serializers import ProdutoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from datetime import timedelta
from pedido.models import ItemPedido
from revendedor.models import Revendedor


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


class RelatorioVendasAPIView(APIView):
    def get(self, request):
        categoria = request.query_params.get('categoria')  # 👈 lê o parâmetro da URL
        periodo = request.query_params.get('periodo', 'semana')
        hoje = timezone.now().date()

        if periodo == 'semana':
            data_inicio = hoje - timedelta(days=7)
        elif periodo == 'mes':
            meses = int(request.query_params.get('meses', 1))
            data_inicio = hoje - timedelta(days=30 * meses)
        elif periodo == 'ano':
            anos = int(request.query_params.get('anos', 1))
            data_inicio = hoje - timedelta(days=365 * anos)
        else:
            return Response({"erro": "Período inválido"}, status=400)

        revendedor = Revendedor.objects.first()
        percentual_lucro = (revendedor.percentual_lucro() if revendedor else 30) / 100

        preco_custo_expr = ExpressionWrapper(
            F('produto__preco_venda') * (1 - percentual_lucro),
            output_field=DecimalField()
        )
        lucro_unitario_expr = ExpressionWrapper(
            F('produto__preco_venda') - preco_custo_expr,
            output_field=DecimalField()
        )
        valor_total_expr = ExpressionWrapper(
            F('produto__preco_venda') * F('quantidade'),
            output_field=DecimalField()
        )
        lucro_total_expr = ExpressionWrapper(
            lucro_unitario_expr * F('quantidade'),
            output_field=DecimalField()
        )

        filtros = {
            'pedido__status': 'Pago',
            'pedido__data_pedido__gte': data_inicio,
        }
        if categoria:
            filtros['produto__categoria'] = categoria  # 👈 aplica o filtro se houver

        itens = ItemPedido.objects.filter(**filtros).values(
            categoria=F('produto__categoria'),
            produto_nome=F('produto__nome')
        ).annotate(
            total_vendido=Sum('quantidade'),
            valor_total=Sum(F('produto__preco_venda') * F('quantidade'), output_field=DecimalField()),
            preco_custo=Sum(
                F('produto__preco_venda') * (1 - percentual_lucro) * F('quantidade'),
                output_field=DecimalField()
            ),
            lucro_total=Sum(
                (F('produto__preco_venda') - F('produto__preco_venda') * (1 - percentual_lucro)) * F('quantidade'),
                output_field=DecimalField()
            )
        ).order_by('categoria', 'produto_nome')

        return Response(list(itens))
