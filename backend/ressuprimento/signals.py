from django.db.models.signals import pre_save
from django.dispatch import receiver
from ressuprimento.models import Ressuprimento


@receiver(pre_save, sender=Ressuprimento)
def atualizar_estoque_ao_receber(sender, instance, **kwargs):
    if instance.pk:
        antigo = Ressuprimento.objects.get(pk=instance.pk)
        # De None para preenchido → foi recebido agora
        if antigo.data_recebimento is None and instance.data_recebimento:
            instance.produto.estoque_atual += instance.quantidade
            instance.produto.save()
    else:
        # Criado com data_recebimento já preenchida
        if instance.data_recebimento:
            instance.produto.estoque_atual += instance.quantidade
            instance.produto.save()
