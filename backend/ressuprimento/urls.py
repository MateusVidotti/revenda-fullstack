from rest_framework.routers import DefaultRouter
from ressuprimento.views import RessuprimentoViewSet

router = DefaultRouter()
router.register(r'ressuprimentos', RessuprimentoViewSet)

urlpatterns = router.urls