const fetch = require('node-fetch');

async function enviarMensagemTeams(solicitante_email, chamado, inicio_agendamento, fim_agendamento, observacao) {
  const mensagem = {
    text: 
      '🛠️ **Nova manutenção criada**<br>' +
      `👤 **Solicitante:** ${solicitante_email}<br>` +
      `📄 **Chamado:** ${chamado}<br>` +
      `⏰ **Início:** ${inicio_agendamento}<br>` +
      `⏳ **Fim:** ${fim_agendamento}<br>` +
      `📝 **Observação:** ${observacao || 'Não informado'}<br>`+ 
      `🔗 [Abrir lista de manutenções](http://localhost:5500/list-maintenance.html)`
  };
  

  try {
    const response = await fetch('https://sercompecombr.webhook.office.com/webhookb2/aedd2e3f-d6bf-455e-a3f4-e80088f890f7@d57e32fb-6c5f-414c-9811-cb2164a80faa/IncomingWebhook/ccea8f56c43c4b4d8a8e64efbbd0c6c8/04878ae3-1c87-40bd-8b43-9da040811242/V2YMKImKq9o3K3Y8GIz-SVNvG-pLKd7SndsIsw7y2KsGI1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mensagem)
    });

    if (!response.ok) {
      console.error('Erro ao enviar mensagem para o Teams:', await response.text());
    }
  } catch (error) {
    console.error('Falha na requisição ao Teams:', error);
  }
}

module.exports = { enviarMensagemTeams };
