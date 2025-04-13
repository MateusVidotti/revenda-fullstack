from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from pedido.models import Pedido
from estoque.models import MovimentacaoEstoque


@receiver(post_save, sender=Pedido)
def registrar_movimentacoes_estoque(sender, instance, created, **kwargs):
    """
    Quando um pedido é criado, registra movimentações de saída.
    Quando um pedido é cancelado, registra movimentações de entrada.
    """
    if created:
        # Criar movimentações de saída
        for item in instance.itens.all():
            MovimentacaoEstoque.objects.create(
                produto=item.produto,
                tipo='saida',
                quantidade=item.quantidade,
                origem=f'Pedido #{instance.id}'
            )
            # Atualiza o estoque atual
            item.produto.estoque_atual -= item.quantidade
            item.produto.save()

    elif instance.status == 'Cancelado':
        # Cancelamento: devolve o estoque com movimentação de entrada
        for item in instance.itens.all():
            MovimentacaoEstoque.objects.create(
                produto=item.produto,
                tipo='entrada',
                quantidade=item.quantidade,
                origem=f'Cancelamento do Pedido #{instance.id}'
            )
            # Repor o estoque
            item.produto.estoque_atual += item.quantidade
            item.produto.save()


@receiver(post_save, sender=MovimentacaoEstoque)
def atualizar_estoque_apos_movimentacao(sender, instance, created, **kwargs):
    if not created:
        return  # Só ajusta no momento da criação

    produto = instance.produto
    if instance.tipo == 'entrada':
        produto.estoque_atual += instance.quantidade
    elif instance.tipo == 'saida':
        produto.estoque_atual -= instance.quantidade

    produto.save()