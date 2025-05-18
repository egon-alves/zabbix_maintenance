// Seleciona os elementos do DOM que serão manipulados
const inputElement = document.getElementById('hosts-input');
const suggestionsContainer = document.getElementById('suggestions-container');
const tagsContainer = document.getElementById('hosts-tags-container');

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


