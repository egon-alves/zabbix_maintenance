function enviar_mensagem_teams(event) {
    event.preventDefault();
    console.log("Botão clicado! Enviar mensagem para o Teams...");
  
    // Defina o URL do seu Webhook do Teams
    const webhookUrl = 'https://sercompecombr.webhook.office.com/webhookb2/aedd2e3f-d6bf-455e-a3f4-e80088f890f7@d57e32fb-6c5f-414c-9811-cb2164a80faa/IncomingWebhook/e86ef06cbe914d789ec45067493cb7a0/04878ae3-1c87-40bd-8b43-9da040811242/V20cbdQolI5hP2heWrDf2ZKrrK2vI9k5iq92M-I1JKk1w1';
  
    // Defina a mensagem que você quer enviar para o Teams
    const mensagem = {
      text: "Nova janela foi enviada!"
    };
  
    // Enviar para o Teams via webhook usando fetch
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mensagem)
    })
    .then(response => {
      if (response.ok) {
        console.log("Mensagem enviada com sucesso!");
      } else {
        console.error("Erro ao enviar mensagem.");
      }
    })
    .catch(error => console.error("Erro na requisição:", error));
  }
  
  document.getElementById("submitBtn").addEventListener("click", enviar_mensagem_teams);
  