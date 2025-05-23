from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path("api/", include("pedido.urls")),
    path("api/", include("produto.urls")),
    path('api/', include('cliente.urls')),
    path('api/', include('ressuprimento.urls')),
    path('api/', include('revendedor.urls')),
    path('api/', include('estoque.urls')),
]
