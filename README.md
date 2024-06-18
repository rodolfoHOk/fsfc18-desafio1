# Imersão FullStack & FullCycle 18 - Desafio 1

## Informações do desafio

### Neste desafio, você deverá clonar a aplicação Nest.js do projeto da Imersão Full Cycle e implementar algumas coisas:

- A aplicação está dividida em 2 apps (partner1 partner2) + a lib core. Você deverá criar um projeto novo e condensar apenas o partner1 e a lib core no seu novo projeto, ou seja, teremos um projeto Nest.js convencional. Teremos módulos events, spots, prisma, auth.
- A aplicação rodará novamente na porta convencional 3000.
- Use Docker Compose como usamos na aula
- Use apenas a variável MYSQL_DATABASE no docker-compose.yaml em vez do docker-entrypoint-initdb.d
- Validar os dados de entrada de alguns endpoints, ao passar os dados inválidos o Nest.js precisa retornar o status 422 informando os problemas encontrados

### POST /events

- name: obrigatório, string, máximo 255
- description: obrigatório, string, máximo 255
- date: obrigatório, string, formato ISO8601
- price: obrigatório, numbero, mínimo 0

### POST spots

- name: obrigatório, string, máximo 255

### POST /events/:eventId/reserve

- spots: obrigatório, array, string
- ticket_kind: obrigatório, precisa ter os valores “full” ou “half”

### Tratar melhor os erros da operação de reserva via recurso exception filter do Nest.js

- Quando os spots passados não existirem lançar um erro 404 com body “{message: Spots not exists: A1, C3, D5, etc}”
- Quando os spots passados não existirem disponíveis para reservar um erro 400 com body “{message: Spots A1 is not available for reservation”
- Quando lançar um erro no trecho transaction do prisma, precisa responder com status 400 + a mensagem do erro

## Tecnologias

- Typescript / Javascript
- Node.js
- Nest.js
- Prisma.js
- MySQL
- Docker

## Rodar

### Requisitos

- Docker

### Comandos

- docker compose up
- docker compose exec app bash
- npx prisma migrate dev
- npm run start:dev

## Etapas realizadas

### Criando novo projeto

- clone do projeto: https://github.com/devfullcycle/imersao18
- criação do novo projeto Nest.js: nest new fsfc18-desafio1

### Rodando o projeto em Dev Containers do VSCode

- copiar do clone Dockerfile, docker-compose.yaml e a pasta .devcontainer
- no docker-compose.yaml remover db volumes e adicionar db environment MYSQL_DATABASE: partner1
- no vscode Dev Containers: Open folder in container

### Iniciando e configurando o Prisma

- iniciar prisma: npx prisma init
- instalar o prisma client: npm install @prisma/client
- copiar do clone a pasta /prisma para o novo projeto pasta prisma substituindo schema.prisma
- copiar do clone .env.partner1 para o novo projeto e renomear para .env
- criação do módulo prisma: nest g module prisma
- copiar do clone a pasta /libs/core/src/prisma para o novo projeto pasta src/prisma substituindo prisma.module
- npx prisma migrate dev

### Criando e copiando o módulo events

- criação do módulo events: nest g module events
- copiar do clone a pasta /libs/core/src/events para o novo projeto pasta src/events
- apagar events.module gerado e renomear events-core.module para events.module
- instalar @nestjs/mapped-types: npm install @nestjs/mapped-types

### Criando e copiando o módulo spots

- criação do módulo spots: nest g module spots
- copiar do clone a pasta /libs/core/src/spots para o novo projeto pasta src/spots
- apagar spots.module gerado e renomear spots-core.module para spots.module

### Criando e copiando o módulo auth

- criação do módulo auth: nest g module auth
- copiar do clone a pasta /libs/core/src/auth para o novo projeto pasta src/auth
- remover do auth.guard a dependência de @nestjs/config

### Copiando events controller

- copiar do cloner a pasta /apps/partner1/src/events exceto events.module para o novo projeto pasta src/events
- ajustar imports do events.controller
- adicionar events.controller ao events.module

### Copiando spots controller

- copiar do cloner a pasta /apps/partner1/src/spots exceto spots.module para o novo projeto pasta src/spots
- ajustar imports do spots.controller
- adicionar spots.controller ao spots.module

### Testando endpoints

- testando com o arquivo api.http e a extensão do vscode rest client

### Implementando validações

- instalar class-validator class-transformer: npm install class-validator class-transformer
- registar validation pipe
- adicionar decorators de validação no create event request
- adicionar decorators de validação no create spot request
- adicionar decorators de validação no reserve spot request

### Implementando exception filter

- criar validation exception
- criar custom exception filter
- registar custom exception filter

### Adicionar e usar resource not found exception

- criar resource not found exception
- adicionar resource not found exception no custom exception filter
- usar resource not found exception nos serviços

## Links

- [Nest.js validation](https://docs.nestjs.com/techniques/validation)
- [Nest.js exception-filters](https://docs.nestjs.com/exception-filters)
