  try {
    await conn.beginTransaction();

    const [janelaResult] = await conn.execute(`
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

    const janelaId = janelaResult.insertId;

    if (Array.isArray(hosts) && hosts.length > 0) {
      const values = hosts.map(h => [janelaId, h.hostid, h.name]);

      await conn.query(`
        INSERT INTO janela_hosts (janela_id, host_id, name_host)
        VALUES ?
      `, [values]);
    }