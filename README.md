
# Zabbix Maintenance

**Zabbix Maintenance** é uma aplicação web desenvolvida em Node.js com o objetivo de facilitar a criação e gerenciamento de períodos de manutenção no Zabbix por meio de uma interface amigável.

> ⚠️ Este projeto ainda está em desenvolvimento. Contribuições são bem-vindas!

## 📦 Funcionalidades Esperadas

- Autenticação no Zabbix via API.
- Listagem de hosts e grupos de hosts.
- Criação de períodos de manutenção diretamente pela interface.
- Interface simples para facilitar o uso por usuários menos técnicos.
- As solicações de janelas serão armazenadas em um banco de dados MySql
- Será enviado alertar via Teams e email quando una nova solicação for feita.
- Será exibido uma lista com as solicitações, e autorizada pelo time com conhecimento tecnico

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- HTML/CSS
- JavaScript
- Docker (em desenvolvimento)

## 📁 Estrutura de Diretórios

```plaintext
├── app.js                # Arquivo principal da aplicação
├── server.js             # Inicialização do servidor Express
├── server2.js            # Versão alternativa do servidor (em teste)
├── package.json          # Dependências do Node.js
├── views/                # Páginas HTML da aplicação
└── docker/               # (em breve) arquivos para containerização
````

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/egon-alves/zabbix_maintenance.git
cd zabbix_maintenance
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes informações:

```env
ZABBIX_API_URL=http://seu_zabbix/zabbix/api_jsonrpc.php
ZABBIX_USER=Admin
ZABBIX_PASSWORD=zabbix
PORT=3000
```

### 4. Inicie a aplicação

```bash
node server.js
```

Acesse em `http://localhost:3000`.

## 🐳 Docker (Em Desenvolvimento)

Será possível executar via Docker futuramente. Aguarde novas atualizações.

## 🤝 Contribuindo

1. Fork este repositório.
2. Crie uma branch: `git checkout -b minha-feature`.
3. Faça suas alterações e commit: `git commit -m 'Minha nova feature'`.
4. Envie para a branch: `git push origin minha-feature`.
5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com 💻 por [Egon Alves](https://github.com/egon-alves).

```
