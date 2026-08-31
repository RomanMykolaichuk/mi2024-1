function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

export function mount(element, config) {
  const items = config.items ?? [];
  if (!items.length) { element.textContent = 'Немає моделей для відображення.'; return; }
  element.innerHTML = `
    <p class="component-intro">${escapeHtml(config.intro ?? '')}</p>
    <div class="storage-tabs" role="tablist" aria-label="Моделі зберігання">
      ${items.map((item, index) => `<button class="storage-tab ${index === 0 ? 'is-active' : ''}" type="button" role="tab" data-model="${escapeHtml(item.id)}" aria-selected="${index === 0}"><span>${escapeHtml(item.icon ?? '')}</span>${escapeHtml(item.label)}</button>`).join('')}
    </div>
    <div class="storage-model-detail" data-role="model-detail"></div>`;
  const detail = element.querySelector('[data-role="model-detail"]');
  const tabs = [...element.querySelectorAll('[data-model]')];
  const render = id => {
    const item = items.find(candidate => candidate.id === id) ?? items[0];
    detail.innerHTML = `
      <div class="model-detail__header"><p class="eyebrow">${escapeHtml(item.icon ?? '')}</p><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.structure)}</p></div>
      <div class="model-detail__grid">
        <div><h4>Сильні сторони</h4><ul>${(item.strengths ?? []).map(v=>`<li>${escapeHtml(v)}</li>`).join('')}</ul></div>
        <div><h4>Обмеження</h4><ul>${(item.limits ?? []).map(v=>`<li>${escapeHtml(v)}</li>`).join('')}</ul></div>
        <div><h4>Найкраще для</h4><p>${escapeHtml(item.bestFor)}</p><p class="microcopy">Приклади: ${escapeHtml(item.examples)}</p></div>
      </div>
      <div class="analytics-callout"><strong>Місце у військовій аналітиці:</strong> ${escapeHtml(item.analytics)}</div>`;
    tabs.forEach(tab => { const active=tab.dataset.model===item.id; tab.classList.toggle('is-active',active); tab.setAttribute('aria-selected',String(active)); });
  };
  tabs.forEach(tab => tab.addEventListener('click',()=>render(tab.dataset.model)));
  render(items[0].id);
}
