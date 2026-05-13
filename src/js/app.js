import { Tarefa, GerenciadorDeTarefas } from './classes.js';
import { prioridadeCor, formatarData } from './utils.js';

const gerenciador = new GerenciadorDeTarefas();
const form = document.getElementById('taskForm');
const listaPendentes = document.querySelector('#listaPendentes ul');
const listaConcluidas = document.querySelector('#listaConcluidas ul');
const filtros = document.querySelectorAll('.filters button');

let filtroAtivo = 'todas';

// ─── Renderização ──────────────────────────────────────────────────────────────

function criarItemTarefa(tarefa) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = tarefa.id;
  if (tarefa.concluida) li.classList.add('concluida');

  li.innerHTML = `
    <input type="checkbox" id="chk-${tarefa.id}" ${tarefa.concluida ? 'checked' : ''} aria-label="Marcar como concluída">
    <div class="task-info">
      <span class="task-titulo" style="color: ${prioridadeCor(tarefa.prioridade)}">${tarefa.titulo}</span>
      <span class="task-data">${formatarData(tarefa.dataCriacao)}</span>
    </div>
    <span class="task-prioridade badge-${tarefa.prioridade}">${tarefa.prioridade}</span>
    <button class="btn-remover" aria-label="Remover tarefa">×</button>
  `;

  li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTarefa(tarefa.id));
  li.querySelector('.btn-remover').addEventListener('click', () => removeTarefa(tarefa.id));

  return li;
}

function criarEstadoVazio(mensagem) {
  const li = document.createElement('li');
  li.className = 'estado-vazio';
  li.textContent = mensagem;
  return li;
}

function renderizar(filtro = filtroAtivo) {
  filtroAtivo = filtro;
  listaPendentes.innerHTML = '';
  listaConcluidas.innerHTML = '';

  const mapa = {
    todas: gerenciador.obterTodas(),
    pendentes: gerenciador.obterPendentes(),
    concluidas: gerenciador.obterConcluidas(),
  };

  const tarefas = mapa[filtro] ?? gerenciador.obterTodas();

  const pendentes = tarefas.filter((t) => !t.concluida);
  const concluidas = tarefas.filter((t) => t.concluida);

  if (pendentes.length === 0) {
    listaPendentes.appendChild(criarEstadoVazio('Nenhuma tarefa pendente.'));
  } else {
    pendentes.forEach((t) => listaPendentes.appendChild(criarItemTarefa(t)));
  }

  if (concluidas.length === 0) {
    listaConcluidas.appendChild(criarEstadoVazio('Nenhuma tarefa concluída.'));
  } else {
    concluidas.forEach((t) => listaConcluidas.appendChild(criarItemTarefa(t)));
  }
}

// ─── Adicionar ─────────────────────────────────────────────────────────────────

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = form.titulo.value.trim();
  if (!titulo) return;

  const tarefa = new Tarefa(
    titulo,
    form.prioridade.value,
    form.descricao.value.trim()
  );

  gerenciador.adicionar(tarefa);
  form.reset();
  renderizar();
});

// ─── Toggle ────────────────────────────────────────────────────────────────────

function toggleTarefa(id) {
  const tarefa = gerenciador.obterTodas().find((t) => t.id === id);
  if (tarefa) {
    tarefa.toggle();
    gerenciador.salvar();
    renderizar();
  }
}

// ─── Remover ───────────────────────────────────────────────────────────────────

function removeTarefa(id) {
  gerenciador.remover(id);
  renderizar();
}

// ─── Filtros ───────────────────────────────────────────────────────────────────

filtros.forEach((btn) =>
  btn.addEventListener('click', () => {
    filtros.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderizar(btn.dataset.filter);
  })
);

// ─── Inicialização ─────────────────────────────────────────────────────────────

renderizar();