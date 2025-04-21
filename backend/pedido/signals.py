from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from pedido.models import Pedido, ItemPedido
from pagamento.models import Pagamento
from datetime import date

_status_anterior = {}


@receiver(pre_save, sender=Pedido)
def deletar_pagamento_ao_cancelar_ou_voltar_para_pendente(sender, instance, **kwargs):
    if not instance.pk:
        return  # Pedido novo, não faz nada aqui

    pedido_antigo = Pedido.objects.get(pk=instance.pk)

    # Verifica se estava "Pago" e vai mudar para outro status
    if pedido_antigo.status == 'Pago' and instance.status in ['Pendente', 'Cancelado']:
        # Exclui o pagamento se existir
        Pagamento.objects.filter(pedido=instance).delete()


@receiver(pre_save, sender=Pedido)
def criar_pagamento_ao_mudar_para_pago(sender, instance, **kwargs):
    if not instance.pk:
        return  # Pedido novo, não faz nada aqui

    pedido_antigo = Pedido.objects.get(pk=instance.pk)

    # Verifica se mudou de 'Pendente' para 'Pago'
    if pedido_antigo.status != 'Pago' and instance.status == 'Pago':
        # Atualiza o total do pedido antes de criar o pagamento
        total = instance.calcular_total()
        instance.total = total  # Garante que será salvo com o total correto

        # Cria pagamento se ainda não existir
        if not Pagamento.objects.filter(pedido=instance).exists() and total > 0:
            Pagamento.objects.create(
                pedido=instance,
                valor_pago=total,
                data_pagamento=date.today(),
                forma_pagamento='Indefinido'
            )


@receiver(post_save, sender=ItemPedido)
def criar_pagamento_apos_itens(sender, instance, created, **kwargs):
    pedido = instance.pedido

    # Só registra o pagamento se o pedido estiver como Pago e ainda não tiver pagamento
    if pedido.status == 'Pago' and not Pagamento.objects.filter(pedido=pedido).exists():
        from datetime import date

        # Garante que o total está atualizado
        pedido.total = pedido.calcular_total()
        pedido.save(update_fields=['total'])

        if pedido.total > 0:
            Pagamento.objects.create(
                pedido=pedido,
                valor_pago=pedido.total,
                data_pagamento=date.today(),
                forma_pagamento='Indefinido'
            )
