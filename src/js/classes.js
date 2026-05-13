// Classe Tarefa
export class Tarefa {
  constructor(titulo, prioridade, descricao = '') {
    this.id = crypto.randomUUID();
    this.titulo = titulo;
    this.prioridade = prioridade;
    this.descricao = descricao;
    this.concluida = false;
    this.dataCriacao = new Date().toISOString();
    this.dataAtualizacao = new Date().toISOString();
  }

  toggle() {
    this.concluida = !this.concluida;
    this.dataAtualizacao = new Date().toISOString();
  }
}

// Classe GerenciadorDeTarefas
export class GerenciadorDeTarefas {
  constructor() {
    this.tarefas = this.carregar();
  }

  adicionar(tarefa) {
    this.tarefas.push(tarefa);
    this.salvar();
  }

  remover(id) {
    this.tarefas = this.tarefas.filter((t) => t.id !== id);
    this.salvar();
  }

  obterTodas() {
    return Array.from(this.tarefas);
  }

  obterPendentes() {
    return this.tarefas.filter((t) => !t.concluida);
  }

  obterConcluidas() {
    return this.tarefas.filter((t) => t.concluida);
  }

  salvar() {
    localStorage.setItem('gestao-tarefas-es6', JSON.stringify(this.tarefas));
  }

  carregar() {
    const dados = localStorage.getItem('gestao-tarefas-es6');
    if (!dados) return [];

    // Reidrata os objetos como instâncias de Tarefa para preservar os métodos
    return JSON.parse(dados).map((obj) => {
      const tarefa = new Tarefa(obj.titulo, obj.prioridade, obj.descricao);
      tarefa.id = obj.id;
      tarefa.concluida = obj.concluida;
      tarefa.dataCriacao = obj.dataCriacao;
      tarefa.dataAtualizacao = obj.dataAtualizacao;
      return tarefa;
    });
  }
}