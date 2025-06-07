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
  jm.chamado,
  jm.observacao
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
  jm.chamado,
  jm.observacao
	;

    `);
    return rows;
}

async function selectJanelaById(janelaId) {
  const [rows] = await client.query(`
    SELECT DISTINCT
      jm.id AS id_janela,
      jm.inicio_agendamento,
      jm.fim_agendamento,
      jm.status_janela,
      jm.tipo_manutencao,
      GROUP_CONCAT(DISTINCT jh.id_host) AS ids_host,
      GROUP_CONCAT(DISTINCT jh.nome_host) AS nomes_host,
      jm.solicitante_email,
      jm.chamado
    FROM 
      janela_manutencao AS jm
    LEFT JOIN
      janela_hosts AS jh ON jm.id = jh.id_janela
    WHERE
      jm.id = ?
    GROUP BY
      jm.id,
      jm.inicio_agendamento,
      jm.fim_agendamento,
      jm.status_janela,
      jm.tipo_manutencao,
      jm.solicitante_email,
      jm.chamado;
  `, [janelaId]);

  console.log("Resultado da query:", rows); // <-- agora sim, depois da query
  return rows;
}

async function inserirManutencao(data) {
  const {
    solicitante_email,
    chamado,
    inicio_agendamento,
    fim_agendamento,
    observacao,
    hosts
  } = data;

  const conn = await client.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(`
      INSERT INTO janela_manutencao 
      (solicitante_email, chamado, inicio_agendamento, fim_agendamento, observacao)
      VALUES (?, ?, ?, ?, ?)
    `, [
      solicitante_email,
      chamado,
      inicio_agendamento,
      fim_agendamento,
      observacao
    ]);

    const idJanela = result.insertId;

    for (const host of hosts) {
      await conn.query(`
        INSERT INTO janela_hosts 
        (id_janela, id_host, nome_host)
        VALUES (?, ?, ?)
      `, [idJanela, host.id_host, host.nome_host]); // <- Certifique-se do nome correto aqui
    }

    await conn.commit();
    return { insertId: idJanela };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateStatusJanela(janelaId, novoStatus) {
  const updateQuery = `
    UPDATE janela_manutencao
    SET status_janela = ?
    WHERE id = ?;
  `;

  // Atualiza o status
  await client.query(updateQuery, [novoStatus, janelaId]);

  // Busca os dados atualizados
  const [rows] = await client.query(
    `SELECT * FROM janela_manutencao WHERE id = ?;`,
    [janelaId]
  );

  console.log("Resultado da query:", rows);
  return rows;
}




module.exports = {
    selectJanelas,selectJanelaById,inserirManutencao,updateStatusJanela, client 
};
