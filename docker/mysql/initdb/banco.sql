-- Inserindo 10 janelas de manutenção na tabela janela_manutencao
INSERT INTO janela_manutencao (solicitante_email, chamado, inicio_agendamento, fim_agendamento, observacao, tipo_manutencao, solicitante_ip, solicitante_host)
VALUES
('usuario1@bytebunker.com.br', 'Ticket#12345678901234', '2025-05-12 08:00:00', '2025-05-12 10:00:00', 'Manutenção programada', 'programada', '192.168.0.1', 'host1.bytebunker.com.br'),
('usuario2@bytebunker.com.br', 'Ticket#23456789012345', '2025-05-12 09:00:00', '2025-05-12 11:00:00', 'Manutenção emergencial', 'emergencial', '192.168.0.2', 'host2.bytebunker.com.br'),
('usuario3@bytebunker.com.br', 'Ticket#34567890123456', '2025-05-13 10:00:00', '2025-05-13 12:00:00', 'Manutenção preventiva', 'preventiva', '192.168.0.3', 'host3.bytebunker.com.br'),
('usuario4@bytebunker.com.br', 'Ticket#45678901234567', '2025-05-13 11:00:00', '2025-05-13 13:00:00', 'Manutenção programada', 'programada', '192.168.0.4', 'host4.bytebunker.com.br'),
('usuario5@bytebunker.com.br', 'Ticket#56789012345678', '2025-05-14 08:00:00', '2025-05-14 10:00:00', 'Manutenção emergencial', 'emergencial', '192.168.0.5', 'host5.bytebunker.com.br'),
('usuario6@bytebunker.com.br', 'Ticket#67890123456789', '2025-05-14 09:00:00', '2025-05-14 11:00:00', 'Manutenção preventiva', 'preventiva', '192.168.0.6', 'host6.bytebunker.com.br'),
('usuario7@bytebunker.com.br', 'Ticket#78901234567890', '2025-05-15 10:00:00', '2025-05-15 12:00:00', 'Manutenção programada', 'programada', '192.168.0.7', 'host7.bytebunker.com.br'),
('usuario8@bytebunker.com.br', 'Ticket#89012345678901', '2025-05-15 11:00:00', '2025-05-15 13:00:00', 'Manutenção emergencial', 'emergencial', '192.168.0.8', 'host8.bytebunker.com.br'),
('usuario9@bytebunker.com.br', 'Ticket#90123456789012', '2025-05-16 08:00:00', '2025-05-16 10:00:00', 'Manutenção preventiva', 'preventiva', '192.168.0.9', 'host9.bytebunker.com.br'),
('usuario10@bytebunker.com.br', 'Ticket#01234567890123', '2025-05-16 09:00:00', '2025-05-16 11:00:00', 'Manutenção programada', 'programada', '192.168.0.10', 'host10.bytebunker.com.br');

-- Inserindo os hosts associados a cada janela de manutenção na tabela janela_hosts
INSERT INTO janela_hosts (id_janela, id_host, name_host)
VALUES
(1, 1, 'host1.bytebunker.com.br'),
(1, 11, 'host11.bytebunker.com.br'),
(1, 12, 'host12.bytebunker.com.br'),
(1, 13, 'host13.bytebunker.com.br'),
(2, 2, 'host2.bytebunker.com.br'),
(3, 3, 'host3.bytebunker.com.br'),
(4, 4, 'host4.bytebunker.com.br'),
(5, 5, 'host5.bytebunker.com.br'),
(6, 6, 'host6.bytebunker.com.br'),
(7, 7, 'host7.bytebunker.com.br'),
(8, 8, 'host8.bytebunker.com.br'),
(9, 9, 'host9.bytebunker.com.br'),
(10, 10, 'host10.bytebunker.com.br');
