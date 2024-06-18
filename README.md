# Imersão FullStack & FullCycle 18 - Desafio 1

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
- copiar do clone o pasta /prisma para o novo projeto pasta prisma substituindo schema.prisma
- copiar do clone .env.partner1 para o novo projeto e renomear para .env
- criação do módulo prisma: nest g module prisma
- copiar do clone o pasta /libs/core/src/prisma para o novo projeto pasta src/prisma substituindo prisma.module
- npx prisma migrate dev

### Criando e copiando o módulo events

- criação do módulo events: nest g module events
- copiar do clone o pasta /libs/core/src/events para o novo projeto pasta src/events
- apagar events.module gerado e renomear events-core.module para events.module
- instalar @nestjs/mapped-types: npm install @nestjs/mapped-types

### Criando e copiando o módulo spots

- criação do módulo spots: nest g module spots
- copiar do clone o pasta /libs/core/src/spots para o novo projeto pasta src/spots
- apagar spots.module gerado e renomear spots-core.module para spots.module

### Criando e copiando o módulo auth

- criação do módulo auth: nest g module auth
- copiar do clone o pasta /libs/core/src/auth para o novo projeto pasta src/auth
- remover do auth.guard a dependência de @nestjs/config
