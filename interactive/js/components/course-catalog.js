const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config) {
  const groups = config.groups?.length
    ? config.groups
    : [{id:'all', title:'Інтерактивні заняття', description:'', items:config.items ?? []}];
  const resources = config.resources ?? [];

  element.innerHTML = `
    <div class="course-themes">
      ${groups.map(renderGroup).join('')}
    </div>
    ${resources.length ? `
      <section class="course-resources" aria-label="Ресурси курсу">
        <div class="course-resources__head"><p class="eyebrow">COURSE RESOURCES</p><h3>Документація і карта розробки</h3></div>
        <div class="course-resource-grid">${resources.map(renderCard).join('')}</div>
      </section>` : ''}
  `;
}

function renderGroup(group) {
  const items = group.items ?? [];
  const implemented = Number(group.progress?.implemented ?? items.filter(item => item.status === 'implemented').length);
  const total = Number(group.progress?.total ?? items.length);
  const percent = total > 0 ? Math.round((implemented / total) * 100) : 0;

  return `
    <section class="course-theme" id="${esc(group.id)}">
      <header class="course-theme__header">
        <div>
          <div class="course-theme__kicker">
            <span class="course-card__status">${statusLabel(group.status ?? 'planned')}</span>
            ${total ? `<span>${implemented}/${total} занять</span>` : ''}
          </div>
          <h3>${esc(group.title)}</h3>
          <p>${esc(group.description ?? '')}</p>
        </div>
        ${total ? `
          <div class="course-theme__progress" aria-label="Реалізовано ${implemented} із ${total}">
            <strong>${percent}%</strong>
            <div class="course-theme__progress-track"><span style="width:${percent}%"></span></div>
          </div>` : ''}
      </header>
      ${items.length
        ? `<div class="course-grid course-grid--theme">${items.map(renderCard).join('')}</div>`
        : `<p class="course-theme__empty">Інтерактивні заняття цієї теми ще в розробці.</p>`}
    </section>
  `;
}

function renderCard(item) {
  const status = item.status ?? 'planned';
  const disabledStatuses = new Set(['planned', 'audit-needed', 'source-gap']);
  const enabled = Boolean(item.href) && !disabledStatuses.has(status);
  const tag = enabled ? 'a' : 'article';
  const href = enabled ? ` href="${esc(item.href)}"` : '';
  const disabled = enabled ? '' : ' aria-disabled="true"';

  return `
    <${tag} class="course-card"${href}${disabled}>
      <div>
        <div class="course-card__meta">
          <span class="course-card__status">${statusLabel(status)}</span>
          ${item.duration ? `<span class="course-card__duration">${esc(item.duration)}</span>` : ''}
        </div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.description)}</p>
      </div>
      <p class="course-card__action">${enabled ? 'Відкрити →' : 'Заплановано'}</p>
    </${tag}>
  `;
}

function statusLabel(status) {
  return {
    ready: 'ready',
    prototype: 'prototype',
    implemented: 'реалізовано',
    planned: 'заплановано',
    'in-progress': 'у розробці',
    'audit-needed': 'потрібен аудит',
    roadmap: 'roadmap',
  }[status] ?? status;
}
