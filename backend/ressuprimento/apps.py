from django.apps import AppConfig


class RessuprimentoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ressuprimento'

    def ready(self):
        import ressuprimento.signals
