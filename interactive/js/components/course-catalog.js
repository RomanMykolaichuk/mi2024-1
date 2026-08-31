export function mount(element, config) {
  const items = config.items ?? [];

  element.innerHTML = `
    <div class="course-grid">
      ${items.map(renderCard).join('')}
    </div>
  `;
}

function renderCard(item) {
  const status = item.status ?? 'planned';
  const enabled = status === 'prototype' || status === 'ready';
  const tag = enabled ? 'a' : 'article';
  const href = enabled ? ` href="${item.href}"` : '';
  const disabled = enabled ? '' : ' aria-disabled="true"';

  return `
    <${tag} class="course-card"${href}${disabled}>
      <div>
        <span class="course-card__status">${statusLabel(status)}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
      <p>${enabled ? 'Відкрити →' : 'Заплановано'}</p>
    </${tag}>
  `;
}

function statusLabel(status) {
  return {
    ready: 'ready',
    prototype: 'prototype',
    planned: 'planned',
  }[status] ?? status;
}
