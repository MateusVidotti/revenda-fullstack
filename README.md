# Aplicação Full-Stack com Django, PostgreSQL, Vite e Fly.io

Esta aplicação full-stack é composta por um backend em Django com uma API RESTful, que se conecta a um banco de dados PostgreSQL. O frontend foi desenvolvido em JavaScript, utilizando Vite para construção e Material UI para a interface visual. O deploy é realizado na Fly.io, uma plataforma de cloud que facilita a escalabilidade e a manutenção da aplicação.

## Tecnologias Utilizadas

- **Backend**: Django + Django REST Framework
- **Banco de Dados**: PostgreSQL
- **Frontend**: JavaScript (Vite) + Material UI
- **Deploy**: Fly.io

## Estrutura do Projeto

- **Backend**: Desenvolvido em Django, o backend expõe uma API criada com Django REST Framework. A API oferece endpoints para operações CRUD e outras funcionalidades específicas, permitindo comunicação com o frontend via JSON.
- **Banco de Dados**: O PostgreSQL armazena dados persistentes, como informações de usuários e transações. A integração com o Django ORM facilita as consultas e manipulações de dados.
- **Frontend**: Criado com Vite e Material UI, o frontend apresenta uma interface moderna e responsiva. Ele se comunica com a API para exibir dados em tempo real, proporcionando uma experiência de usuário dinâmica.
- **Deploy**: A Fly.io permite o deploy de backend e frontend como serviços independentes e escaláveis, com suporte para configuração personalizada por meio do arquivo `fly.toml`.

## Instalação e Configuração

### Pré-requisitos

- **Python 3.8+**, **Node.js 14+**, **PostgreSQL**

### Passo a Passo

1. **Clone o repositório e entre na pasta**:
   ```bash
   git clone https://github.com/seu_usuario/nome_do_repositorio.git
   cd nome_do_repositorio
   ```

2. **Configuração do Backend**:
   - Crie um ambiente virtual e instale as dependências:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     pip install -r backend/requirements.txt
     ```
   - Configure o PostgreSQL no arquivo `settings.py` e realize as migrações:
     ```bash
     python manage.py migrate
     python manage.py createsuperuser
     python manage.py runserver
     ```

3. **Configuração do Frontend**:
   - Na pasta `frontend`, instale as dependências e inicie o servidor:
     ```bash
     npm install
     npm run dev
     ```

4. **Deploy com Fly.io**:
   - Configure o arquivo `fly.toml` e faça o deploy com:
     ```bash
     fly deploy
     ```

## Endpoints da API

Alguns dos endpoints principais incluem:
- `GET /api/entidade/`: lista registros.
- `POST /api/entidade/`: cria um registro.
- `PUT /api/entidade/<id>/`: atualiza um registro.
- `DELETE /api/entidade/<id>/`: exclui um registro.

## Contribuição

Contribuições são bem-vindas! Envie pull requests ou issues para melhorias, correções de bugs ou sugestões de novas funcionalidades.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
