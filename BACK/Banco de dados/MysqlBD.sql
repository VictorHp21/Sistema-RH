-- Povoando o bd para testes

-- ==========================
-- EMPRESAS
-- ==========================

INSERT INTO empresas (id, nome, cnpj, status) VALUES
(1, 'Tech Solutions', '11111111000101', true),
(2, 'Global Sistemas', '22222222000102', true),
(3, 'Alpha Tecnologia', '33333333000103', true),
(4, 'Beta Consultoria', '44444444000104', true),
(5, 'Delta Software', '55555555000105', true),
(6, 'Omega RH', '66666666000106', true),
(7, 'Vision TI', '77777777000107', true),
(8, 'Inova Corp', '88888888000108', true),
(9, 'Future Systems', '99999999000109', true),
(10, 'Smart Business', '10101010000110', true);

-- ==========================
-- CARGOS
-- ==========================

INSERT INTO cargos (id, nome, empresa_id) VALUES
(1, 'Desenvolvedor Java', 1),
(2, 'Analista de Sistemas', 2),
(3, 'DBA', 3),
(4, 'Gerente de Projetos', 4),
(5, 'Analista RH', 5),
(6, 'Suporte Técnico', 6),
(7, 'QA Tester', 7),
(8, 'Desenvolvedor Front-End', 8),
(9, 'Arquiteto de Software', 9),
(10, 'Scrum Master', 10);

-- ==========================
-- DEPARTAMENTOS
-- ==========================

INSERT INTO departamentos (id, nome, empresa_id) VALUES
(1, 'Tecnologia', 1),
(2, 'Análise', 2),
(3, 'Banco de Dados', 3),
(4, 'Projetos', 4),
(5, 'Recursos Humanos', 5),
(6, 'Suporte', 6),
(7, 'Qualidade', 7),
(8, 'Desenvolvimento Web', 8),
(9, 'Arquitetura', 9),
(10, 'Gestão Ágil', 10);

-- ==========================
-- FUNCIONÁRIOS
-- ==========================

INSERT INTO funcionarios
(id, idade, cpf, cargo_id, departamento_id, nome, salario,
 data_de_contratacao, status_empregado, empresa_id)
VALUES
(1, 25, '11111111111', 1, 1, 'João Silva', 4500.00, '2024-01-15', true, 1),

(2, 28, '22222222222', 2, 2, 'Maria Oliveira', 5200.00, '2023-08-10', true, 2),

(3, 31, '33333333333', 3, 3, 'Carlos Souza', 7000.00, '2022-05-20', true, 3),

(4, 35, '44444444444', 4, 4, 'Ana Costa', 9500.00, '2021-03-12', true, 4),

(5, 27, '55555555555', 5, 5, 'Fernanda Lima', 4800.00, '2024-02-01', true, 5),

(6, 24, '66666666666', 6, 6, 'Pedro Santos', 3200.00, '2025-01-10', true, 6),

(7, 29, '77777777777', 7, 7, 'Juliana Rocha', 5500.00, '2023-11-08', true, 7),

(8, 26, '88888888888', 8, 8, 'Ricardo Alves', 4700.00, '2024-06-18', true, 8),

(9, 38, '99999999999', 9, 9, 'Patricia Mendes', 12000.00, '2020-09-25', true, 9),

(10, 33, '10101010101', 10, 10, 'Lucas Ferreira', 8500.00, '2022-07-05', true, 10);


-- Testes
select *from empresas;

select *from funcionarios;