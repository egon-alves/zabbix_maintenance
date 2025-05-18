fetch("/list-maintenance")
.then((response) => response.json())
.then((janelas) => {
  const tbody = document.querySelector("#tabela-janelas tbody");

  janelas.forEach((janela, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${janela.id_janela}</td>
      <td>${janela.chamado || "-"}</td>
      <td>${janela.solicitante_email || "-"}</td>
      <td>${new Date(janela.inicio_agendamento).toLocaleString()}</td>
      <td>${new Date(janela.fim_agendamento).toLocaleString()}</td>
      <td><button class="botao-detalhes" data-index="${index}">Ver mais</button></td>
    `;

    const trDetalhes = document.createElement("tr");
    trDetalhes.classList.add("detalhes");
    trDetalhes.innerHTML = `
    <td colspan="6">
      <strong>Status:</strong> ${janela.status_janela || "-"}<br>
      <strong>Tipo:</strong> ${janela.tipo_manutencao || "-"}<br>
      <strong>Hosts:</strong> ${janela.nomes_host || " - "}<br>
      <strong>Observação:</strong> ${janela.observacao || "-"}<br><br>
      <button class="botao-acao aceitar" data-id="${janela.id_janela}">Aceitar</button>
      <button class="botao-acao recusar" data-id="${janela.id_janela}">Recusar</button>
    </td>
    `;

    tbody.appendChild(tr);
    tbody.appendChild(trDetalhes);
  });

  document.querySelectorAll(".botao-detalhes").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      const detalhesRow = document.querySelectorAll(".detalhes")[index];
      const isVisible = detalhesRow.classList.contains("visivel");
      detalhesRow.classList.toggle("visivel");
      btn.textContent = isVisible ? "Ver mais" : "Ver menos";
    });
  });
})
.catch((error) => {
  console.error("Erro ao carregar janelas:", error);
});
document.addEventListener("click", function (e) {
if (e.target.classList.contains("botao-acao")) {
const id = e.target.getAttribute("data-id");
const acao = e.target.classList.contains("aceitar") ? "aceitar" : "recusar";

fetch(`/janela/${id}/${acao}`, {
method: "POST",
})
.then((res) => {
  if (res.ok) {
    alert(`Janela ${acao} com sucesso!`);
    // Aqui você pode atualizar a tabela ou recarregar os dados se quiser
  } else {
    alert("Erro ao processar a solicitação.");
  }
})
.catch((err) => {
  console.error("Erro na requisição:", err);
  alert("Erro de conexão.");
});
}
});

