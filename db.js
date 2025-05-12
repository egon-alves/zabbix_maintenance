const mysql = require("mysql2/promise");

const dbUrl = new URL(process.env.CONNECTION_STRING);

const client = mysql.createPool({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1) // remove o primeiro '/'
});

async function selectJanelas() {
    const [rows] = await client.query(`
SELECT
  jm.id AS id_janela,
  jm.inicio_agendamento,
  jm.fim_agendamento,
  jm.status_janela,
  jm.tipo_manutencao,
  GROUP_CONCAT(jh.id_host) AS ids_host,
  GROUP_CONCAT(jh.nome_host) AS nomes_host,
  jm.solicitante_email,
  jm.chamado
FROM 
  janela_manutencao AS jm
JOIN
  janela_hosts AS jh ON jm.id = jh.id_janela
where jm.status_janela like "pendente"
GROUP BY
  jm.id,
  jm.inicio_agendamento,
  jm.fim_agendamento,
  jm.status_janela,
  jm.tipo_manutencao,
  jm.solicitante_email,
  jm.chamado
	;

    `);
    return rows;
}


module.exports = {
    selectJanelas
};
