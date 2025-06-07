// Seleciona os elementos do DOM que serão manipulados
const inputElement = document.getElementById('hosts-input');
const suggestionsContainer = document.getElementById('suggestions-container');
const tagsContainer = document.getElementById('hosts-tags-container');
const form = document.getElementById('janela-form');
const submitButton = document.getElementById('submitBtn');

// Lista que armazenará os hosts selecionados
let selectedHosts = [];

// Função que renderiza os hosts selecionados como tags
function renderTags() {
  // Remove todas as tags renderizadas anteriormente para evitar duplicatas
  tagsContainer.querySelectorAll('.tag-item').forEach(tag => tag.remove());

  // Para cada host selecionado, cria uma tag visual (um "chip")
  selectedHosts.forEach(host => {
    const tag = document.createElement('span');
    tag.className = 'tag-item chip'; // Define a classe CSS
    tag.textContent = host.name;     // Exibe o nome do host
    tag.title = host.name;           // Tooltip com o nome do host

    // Cria o botão de fechar (remover tag)
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.textContent = 'x'; // Símbolo de fechar
    closeBtn.onclick = () => {
      // Remove o host da lista de selecionados e re-renderiza as tags
      selectedHosts = selectedHosts.filter(h => h.hostid !== host.hostid);
      renderTags();
    };

    // Adiciona o botão de fechar à tag e insere a tag no container
    tag.appendChild(closeBtn);
    tagsContainer.insertBefore(tag, inputElement);
  });

  // Se tiver texto no input, atualiza as sugestões
  const query = inputElement.value.trim();
  if (query.length >= 3) {
    searchHosts(query);
  }
}

// Função para buscar e renderizar sugestões
async function searchHosts(query) {
  try {
    // Faz a requisição para buscar hosts que correspondam à pesquisa
    const response = await fetch(`/search-hosts?query=${encodeURIComponent(query)}`);
    const hosts = await response.json();

    if (hosts.length > 0) {
      // Filtra os hosts que ainda não foram selecionados
      const availableHosts = hosts.filter(host =>
        !selectedHosts.some(selected => selected.hostid === host.hostid)
      );

      if (availableHosts.length > 0) {
        // Monta as sugestões com base nos hosts disponíveis
        suggestionsContainer.innerHTML = availableHosts.map(host => 
          `<div class="suggestion-item" data-hostid="${host.hostid}" data-name="${host.name}">${host.name}</div>`
        ).join('');
        suggestionsContainer.style.display = 'block';

        // Adiciona comportamento de clique em cada sugestão
        document.querySelectorAll('.suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            const host = {
              hostid: item.getAttribute('data-hostid'),
              name: item.getAttribute('data-name')
            };

            // Evita selecionar o mesmo host mais de uma vez
            if (!selectedHosts.some(h => h.hostid === host.hostid)) {
              selectedHosts.push(host);
              renderTags(); // Atualiza a exibição das tags
            }

            // Limpa o campo de input e esconde as sugestões
            inputElement.value = '';
            suggestionsContainer.style.display = 'none';
          });
        });
      } else {
        // Se não houver hosts disponíveis, esconde o container de sugestões
        suggestionsContainer.style.display = 'none';
      }
    } else {
      // Se a resposta da API vier vazia, esconde as sugestões
      suggestionsContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao buscar hosts:', error);
    suggestionsContainer.style.display = 'none';
  }
}

// Evento: quando o usuário digitar no input
inputElement.addEventListener('input', (event) => {
  const query = event.target.value.trim();

  if (query.length >= 3) {
    searchHosts(query);
  } else {
    suggestionsContainer.style.display = 'none';
  }
});

// Esconde o container de sugestões se o clique ocorrer fora do componente
document.addEventListener('click', (event) => {
  if (!event.target.closest('.form-group')) {
    suggestionsContainer.style.display = 'none';
  }
});


form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o envio tradicional do form

  // Coleta os dados do formulário
  const solicitante_email = document.getElementById('solicitante').value.trim();
  const chamado = document.getElementById('ticket').value.trim();
  const inicio = document.getElementById('active-since').value;
  const fim = document.getElementById('active-till').value;
  const observacao = document.getElementById('description').value.trim();

  // Valida se há pelo menos um host selecionado
  if (selectedHosts.length === 0) {
    alert('Por favor, selecione ao menos um host.');
    return;
  }

  // Formata data para o formato esperado: "YYYY-MM-DD HH:mm:ss"
  function formatDateTime(datetime) {
    const [date, time] = datetime.split('T');
    return `${date} ${time}:00`;
  }

  const inicio_agendamento = formatDateTime(inicio);
  const fim_agendamento = formatDateTime(fim);

  // Monta a lista de hosts no formato esperado
  const hosts = selectedHosts.map(h => ({
    id_host: parseInt(h.hostid),
    nome_host: h.name
  }));

  // Monta o corpo da requisição
  const data = {
    solicitante_email,
    chamado,
    inicio_agendamento,
    fim_agendamento,
    observacao,
    hosts
  };

  try {
    const response = await fetch('/api/maintenance/new-maintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Janela de manutenção criada com sucesso!');
      await enviarMensagemTeams(solicitante_email, chamado, inicio_agendamento, fim_agendamento, observacao);
      form.reset();
      selectedHosts = [];
      renderTags();
    } else {
      const error = await response.text();
      console.error('Erro da API:', error);
      alert('Erro ao criar a janela. Verifique os dados e tente novamente.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Falha na comunicação com o servidor.');
  }
});



// Função para buscar e renderizar sugestões
async function searchHosts(query) {
  try {
    // Faz a requisição para buscar hosts que correspondam à pesquisa
    const response = await fetch(`/search-hosts?query=${encodeURIComponent(query)}`);
    const hosts = await response.json();

    if (hosts.length > 0) {
      // Filtra os hosts que ainda não foram selecionados
      const availableHosts = hosts.filter(host =>
        !selectedHosts.some(selected => selected.hostid === host.hostid)
      );

      if (availableHosts.length > 0) {
        // Monta as sugestões com base nos hosts disponíveis
        suggestionsContainer.innerHTML = availableHosts.map(host => 
          `<div class="suggestion-item" data-hostid="${host.hostid}" data-name="${host.name}">${host.name}</div>`
        ).join('');
        suggestionsContainer.style.display = 'block';

        // Adiciona comportamento de clique em cada sugestão
        document.querySelectorAll('.suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            const host = {
              hostid: item.getAttribute('data-hostid'),
              name: item.getAttribute('data-name')
            };

            // Evita selecionar o mesmo host mais de uma vez
            if (!selectedHosts.some(h => h.hostid === host.hostid)) {
              selectedHosts.push(host);
              renderTags(); // Atualiza a exibição das tags
            }

            // Limpa o campo de input e esconde as sugestões
            inputElement.value = '';
            suggestionsContainer.style.display = 'none';
          });
        });
      } else {
        // Se não houver hosts disponíveis, esconde o container de sugestões
        suggestionsContainer.style.display = 'none';
      }
    } else {
      // Se a resposta da API vier vazia, esconde as sugestões
      suggestionsContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao buscar hosts:', error);
    suggestionsContainer.style.display = 'none';
  }
}

// Evento: quando o usuário digitar no input
inputElement.addEventListener('input', (event) => {
  const query = event.target.value.trim();

  if (query.length >= 3) {
    searchHosts(query);
  } else {
    suggestionsContainer.style.display = 'none';
  }
});

// Esconde o container de sugestões se o clique ocorrer fora do componente
document.addEventListener('click', (event) => {
  if (!event.target.closest('.form-group')) {
    suggestionsContainer.style.display = 'none';
  }
});





async function enviarMensagemTeams(solicitante_email, chamado, inicio_agendamento, fim_agendamento, observacao) {
  const mensagem = {
    text: `🛠️ **Nova manutenção criada**
👤 **Solicitante:** ${solicitante_email}
📄 **Chamado:** ${chamado}
⏰ **Início:** ${inicio_agendamento}
⏳ **Fim:** ${fim_agendamento}
📝 **Observação:** ${observacao || 'Não informado'}`
  };

  try {
    const response = await fetch('https://sercompecombr.webhook.office.com/webhookb2/aedd2e3f-d6bf-455e-a3f4-e80088f890f7@d57e32fb-6c5f-414c-9811-cb2164a80faa/IncomingWebhook/e86ef06cbe914d789ec45067493cb7a0/04878ae3-1c87-40bd-8b43-9da040811242/V20cbdQolI5hP2heWrDf2ZKrrK2vI9k5iq92M-I1JKk1w1', {
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
