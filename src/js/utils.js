/**
 * Formata uma data ISO para o padrão pt-BR.
 * @param {string} dataISO
 * @returns {string}
 */
export const formatarData = (dataISO) => {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(dataISO));
};

/**
 * Retorna a cor associada a uma prioridade.
 * @param {'baixa'|'media'|'alta'} prioridade
 * @returns {string}
 */
export const prioridadeCor = (prioridade) => {
  const mapa = {
    baixa: '#27ae60',
    media: '#f39c12',
    alta: '#e74c3c',
  };
  return mapa[prioridade] || '#555';
};

/**
 * Cria e retorna um elemento DOM com propriedades e filhos.
 * @param {string} tag
 * @param {object} props
 * @param {Node[]} filhos
 * @returns {HTMLElement}
 */
export const criaElemento = (tag, props = {}, filhos = []) => {
  const el = document.createElement(tag);
  Object.assign(el, props);
  el.append(...filhos);
  return el;
};