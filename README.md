
# Analisador de Hierarquia de Palavras

Este projeto consiste em duas aplicações para análise de hierarquia de palavras:
1. **CLI (Command Line Interface)**: Processa frases para identificar a hierarquia de palavras.
2. **Frontend (React)**: Interface web para criar e visualizar hierarquias de palavras.

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Clonagem do Projeto](#clonagem-do-projeto)
- [Configuração da Aplicação CLI](#configuração-da-aplicação-cli)
  - [Rodando a CLI](#rodando-a-cli)
  - [Comandos Disponíveis](#comandos-disponíveis)
- [Configuração da Aplicação Frontend](#configuração-da-aplicação-frontend)
  - [Rodando o Frontend](#rodando-o-frontend)
- [Testes Unitários](#testes-unitários)

---

## Pré-requisitos

- **Bun**: [Instalar Bun](https://bun.sh/)
- **Git**: [Instalar Git](https://git-scm.com/)

---

## Clonagem do Projeto

Para clonar o repositório e configurar o projeto:

```bash
git clone https://github.com/rafaelluciodeveloper/analisador-hierarquia.git
cd analisador-hierarquia
```

---

## Configuração da Aplicação CLI

A aplicação CLI permite analisar frases e determinar a hierarquia de palavras com base em um arquivo JSON.

### 1. Instalação das Dependências

Entre na pasta da CLI e instale as dependências:

```bash
cd cli
bun install
```

### 2. Rodando a CLI

Para rodar a CLI, execute o comando abaixo. Ele aceita uma frase e exibe a contagem de palavras em uma profundidade específica.

```bash
bun run cli.ts analyze --depth <n> "frase a ser analisada" --verbose
```

### 3. Comandos Disponíveis

| Comando                               | Descrição                                                                                        |
|---------------------------------------|--------------------------------------------------------------------------------------------------|
| `--depth <n>`                         | Especifica o nível de profundidade na hierarquia para exibir a contagem de palavras              |
| `"{phrase}"`                          | Frase a ser analisada. Deve ser colocada entre aspas duplas                                      |
| `--verbose`                           | Exibe métricas de tempo de carregamento e verificação no console                                 |

#### Exemplos de Uso

1. Analisando com profundidade e verbose:

   ```bash
    bun run cli.ts analyze --depth 3 "Eu amo papagaios" --verbose
   ```

2. Analisando frase com múltiplas correspondências:

   ```bash
   bun run cli.ts analyze --depth 3 "Eu vi gorilas e papagaios"
   ```
---

## Configuração da Aplicação Frontend

A aplicação frontend em React permite ao usuário criar e visualizar uma hierarquia de palavras.

### 1. Instalação das Dependências

Entre na pasta `frontend` e instale as dependências:

```bash
cd frontend
bun install
```

### 2. Rodando o Frontend

Execute o seguinte comando para iniciar o servidor de desenvolvimento:

```bash
bun run dev
```

A aplicação estará acessível em [http://localhost:5173](http://localhost:5173).

### Funcionalidades

- **Adicionar Níveis**: Permite criar níveis de hierarquia.
- **Salvar Hierarquia**: Salva a estrutura em um arquivo JSON, que pode ser baixado.

---

## Testes Unitários

### Rodando Testes na CLI

1. Para executar os testes na CLI

   ```bash
   cd cli
   bun run test
   ```