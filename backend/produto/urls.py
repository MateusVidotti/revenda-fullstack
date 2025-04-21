from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

