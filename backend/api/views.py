from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from pagamento.models import Pagamento
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
