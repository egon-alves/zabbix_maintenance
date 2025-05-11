-- Criação do Banco de Dados
CREATE DATABASE revenda_carros;

-- Seleciona o banco de dados
USE revenda_carros;

-- Tabela de Carros
CREATE TABLE Carros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    ano INT,
    cor VARCHAR(20),
    placa VARCHAR(10) UNIQUE,
    preco DECIMAL(10, 2)
);

-- Tabela de Clientes
CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    endereco VARCHAR(255)
);

-- Tabela de Funcionários
CREATE TABLE Funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    cargo VARCHAR(50),
    salario DECIMAL(10, 2),
    telefone VARCHAR(20)
);

-- Tabela de Vendas
CREATE TABLE Vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_carro INT,
    id_cliente INT,
    id_funcionario INT,
    data_venda DATE,
    valor_venda DECIMAL(10, 2),
    FOREIGN KEY (id_carro) REFERENCES Carros(id),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id),
    FOREIGN KEY (id_funcionario) REFERENCES Funcionarios(id)
);
