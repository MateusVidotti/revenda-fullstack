from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from pedido.models import Pedido, ItemPedido
from estoque.models import MovimentacaoEstoque


# Dicionário temporário para guardar o status anterior
_status_anterior = {}


@receiver(pre_save, sender=Pedido)
def guardar_status_anterior(sender, instance, **kwargs):
    if instance.pk:
        pedido_antigo = Pedido.objects.get(pk=instance.pk)
        _status_anterior[instance.pk] = pedido_antigo.status


@receiver(post_save, sender=Pedido)
def registrar_movimentacoes_estoque(sender, instance, created, **kwargs):
    status_anterior = _status_anterior.pop(instance.pk, None)

    # Criado com status Pago OU alterado de Pendente para Pago
    if (created and instance.status == 'Pago') or (not created and status_anterior == 'Pendente' and instance.status == 'Pago'):
        for item in instance.itens.all():
            MovimentacaoEstoque.objects.create(
                produto=item.produto,
                tipo='saida',
                quantidade=item.quantidade,
                origem=f'Pedido #{instance.id}'
            )
            item.produto.estoque_atual -= item.quantidade
            item.produto.save()

    # Alterado de Pago (ou Pendente) para Cancelado
    elif not created and status_anterior != 'Cancelado' and instance.status == 'Cancelado':
        for item in instance.itens.all():
            MovimentacaoEstoque.objects.create(
                produto=item.produto,
                tipo='entrada',
                quantidade=item.quantidade,
                origem=f'Cancelamento do Pedido #{instance.id}'
            )
            item.produto.estoque_atual += item.quantidade
            item.produto.save()


@receiver(post_save, sender=ItemPedido)
def registrar_saida_item_pedido(sender, instance, created, **kwargs):
    """
    Quando um ItemPedido é criado e o Pedido está com status Pago,
    gera movimentação de saída do estoque.
    """
    pedido = instance.pedido

    if created and pedido.status == 'Pago':
        MovimentacaoEstoque.objects.create(
            produto=instance.produto,
            tipo='saida',
            quantidade=instance.quantidade,
            origem=f'Pedido #{pedido.id}'
        )
        produto = instance.produto
        produto.estoque_atual -= instance.quantidade
        produto.save()
