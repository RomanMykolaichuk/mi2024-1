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
  const enabledStatuses = new Set(['prototype', 'ready', 'implemented']);
  const enabled = enabledStatuses.has(status) && Boolean(item.href);
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
    implemented: 'implemented',
    planned: 'planned',
  }[status] ?? status;
}
