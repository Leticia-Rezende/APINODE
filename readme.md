## Requisitos

* Node.js 22 ou superior - Conferir a versão: node -v
* MySQL 8 ou superior - Conferir a versão: mysql --version


## Sequencia para criar projeto

Criar o arquivo package
```
npm init
``` 

Instalar o Express para gerenciar as requisições, rotas e URLs, entre outras funcionalidade.
``` 
npm i express 
``` 

Instalar os pacotes para suporte ao TypeScript
```
npm i --save-dev @types/express
```
```
npm i --save-dev @types/node
```
Instalar o compilador do projeto com TypeScript e reiniciar o projeto quando o arquivo é modificado
```
npm i --save-dev ts-node
```

Gerar o arquivo de configuração para o TypeScript, criar pastas src e dist na raiz do projeto depois criar o arquivo index dentro do diretorio src configurando tambem o arquivo com uma rota para abrir ao executar proejeto.
```
npx tsc --init
```

Compilar o arquivo TypeScript
```
npx tsc
```
Executar o arquivo gerado com o Node.js
```
node dist/index.js
```

Instalar a dependência para rodar processos simultâneo configurar o arquivo package.json para que o projeto fique sempre reconstruindo os arquivos modificados com um observador.
```
npm i --save-dev concurrently
```

Compilar o arquivo TypeScript. Executar o arquivo gerado.
```
npm run start:watch
```

Criar banse de dados no myqsl 
```
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Instalar a dependência para conectar o Node.js (TS) com BD.
```
npm i typeorm --save
```

Biblioteca utilizada no TypeScript para adicionar metadados (informações adicionais) a classes.
```
npm i reflect-metadata --save
```

Instalar o drive do banco de dados MySQL.
```
npm i mysql2 --save
```

Manipular variáveis de ambiente.
```
npm i dotenv --save
```

Instalar os tipos de variáveis para o TypeScript

```
npm i --save-dev @types/dotenv
```

Criar a Migração que será usada para criar a tabela no banco de dados

npx typeorm migration:create src/migration/CreateSituationsTable

npx typeorm migration:create src/migration/CreateUsersTable

Executar as migrations para criar as tabelas no banco de dados 

npx typeorm migration:run -d dist/data-source.js