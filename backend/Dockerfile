ARG PYTHON_VERSION=3.12-slim

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalação de dependências
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
RUN mkdir -p /code

WORKDIR /code

# Instalar Poetry
RUN pip install poetry
COPY pyproject.toml poetry.lock /code/
RUN poetry config virtualenvs.create false
RUN poetry install --only main --no-root --no-interaction

# Copiar o código para a imagem
COPY . /code

# Expor a porta para o servidor Django
EXPOSE 8000

# Definir o comando de execução
CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "backend.wsgi"]ex
