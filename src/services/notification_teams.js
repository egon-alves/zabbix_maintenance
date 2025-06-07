// Essa função será chamada após o POST bem-sucedido
function enviar_mensagem_teams({ inicio_agendamento, fim_agendamento, solicitante_email, chamado, hosts }) {
  const webhookUrl = 'https://sercompecombr.webhook.office.com/webhookb2/aedd2e3f-d6bf-455e-a3f4-e80088f890f7@d57e32fb-6c5f-414c-9811-cb2164a80faa/IncomingWebhook/d3066047e3e24a6093504e747a3f4907/04878ae3-1c87-40bd-8b43-9da040811242/V2qoIj8XBRbTZCASdctRlFSxKwzH5JkLgjt5q3LqY8aYY1';

  const listaHosts = hosts.map(h => `- ${h.nome_host}`).join('\n');

  const mensagem = {
    text: `🛠️ **Nova manutenção criada**
👤 **Solicitante:** ${solicitante_email}  
📄 **Chamado:** ${chamado}  
⏰ **Início:** ${inicio_agendamento}  
⏳ **Fim:** ${fim_agendamento}  
🖥️ **Hosts:**  
${listaHosts}`
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mensagem)
  })
  .then(response => {
    if (response.ok) {
      console.log("Mensagem enviada com sucesso!");
    } else {
      console.error("Erro ao enviar mensagem ao Teams.");
    }
  })
  .catch(error => console.error("Erro na requisição ao Teams:", error));
}
