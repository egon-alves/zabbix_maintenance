CREATE DATABASE maintenance;
USE maintenance;

CREATE USER 'maintenance_web'@'%' IDENTIFIED BY 'maintenancepassword';
GRANT ALL PRIVILEGES ON maintenance.* TO 'maintenance_web'@'%';
FLUSH PRIVILEGES;

-- Tabela principal
CREATE TABLE janela_manutencao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    solicitante_email VARCHAR(255) NOT NULL,
    chamado VARCHAR(255),
    inicio_agendamento DATETIME NOT NULL,
    fim_agendamento DATETIME NOT NULL,
    observacao VARCHAR(255),
    status_janela ENUM('pendente', 'aceito', 'rejeitado') DEFAULT 'pendente',
    tipo_manutencao ENUM('emergencial', 'programada', 'preventiva') NOT NULL,
    solicitante_ip VARCHAR(255),
    solicitante_host VARCHAR(255),
    data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela relacional com hosts
CREATE TABLE janela_hosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_janela INT NOT NULL,
    id_host INT,
    name_host VARCHAR(255),
    FOREIGN KEY (id_janela) REFERENCES janela_manutencao(id) ON DELETE CASCADE
);

CREATE TABLE auditoria_janela_manutencao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_janela INT NOT NULL,
    acao ENUM('aceito', 'rejeitado') NOT NULL,
    usuario VARCHAR(255) NOT NULL,
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_janela) REFERENCES janela_manutencao(id) ON DELETE CASCADE
);

CREATE VIEW vw_janelas_com_hosts AS
SELECT 
  jm.id AS id_janela,
  jm.solicitante_email,
  jm.chamado,
  jm.inicio_agendamento,
  jm.fim_agendamento,
  jm.status_janela,
  jm.tipo_manutencao,
  jh.id_host,
  jh.name_host
FROM janela_manutencao jm
LEFT JOIN janela_hosts jh ON jm.id = jh.id_janela;

CREATE INDEX idx_status_janela ON janela_manutencao(status_janela);
CREATE INDEX idx_inicio_agendamento ON janela_manutencao(inicio_agendamento);
