const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config) {
  const cases = config.cases ?? [];
  if (!cases.length) return;
  let current = 0;
  let answered = new Set();

  element.innerHTML = `<div class="method-selector"><div class="method-case-tabs" data-role="tabs"></div><div data-role="case"></div><div class="method-score" data-role="score"></div></div>`;
  const tabs = element.querySelector('[data-role="tabs"]');
  const panel = element.querySelector('[data-role="case"]');
  const score = element.querySelector('[data-role="score"]');

  function renderTabs() {
    tabs.innerHTML = cases.map((item, index) => `<button class="method-case-tab ${index === current ? 'is-active' : ''}" data-case="${index}">${index + 1}. ${esc(item.short ?? item.title)}</button>`).join('');
    tabs.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
      current = Number(button.dataset.case);
      renderTabs();
      renderCase();
    }));
  }

  function renderCase() {
    const item = cases[current];
    panel.innerHTML = `<article class="method-case"><p class="eyebrow">ANALYTICAL TASK</p><h3>${esc(item.title)}</h3><p class="component-intro">${esc(item.context)}</p><div class="method-constraints">${(item.constraints ?? []).map(value => `<span>${esc(value)}</span>`).join('')}</div><p class="method-question">${esc(item.question ?? 'Який метод найбільш доречний?')}</p><div class="method-options">${(item.options ?? []).map((option, index) => `<button class="method-option" data-option="${index}"><strong>${esc(option.label)}</strong><span>${esc(option.description ?? '')}</span></button>`).join('')}</div><div class="method-feedback" data-role="feedback" aria-live="polite"></div></article>`;
    const feedback = panel.querySelector('[data-role="feedback"]');
    panel.querySelectorAll('[data-option]').forEach(button => button.addEventListener('click', () => {
      const index = Number(button.dataset.option);
      const option = item.options[index];
      panel.querySelectorAll('[data-option]').forEach(node => node.classList.toggle('is-selected', Number(node.dataset.option) === index));
      const correct = index === item.answer;
      feedback.className = `method-feedback ${correct ? 'is-good' : 'is-warning'}`;
      feedback.innerHTML = `<strong>${correct ? 'Обґрунтований вибір' : 'Перевірте компроміси'}</strong><p>${esc(option.feedback ?? item.feedback ?? '')}</p>${item.takeaway ? `<p><strong>Takeaway:</strong> ${esc(item.takeaway)}</p>` : ''}`;
      if (correct) answered.add(item.id ?? String(current));
      score.textContent = `Обґрунтовано: ${answered.size}/${cases.length}`;
    }));
  }

  renderTabs();
  renderCase();
  score.textContent = `Обґрунтовано: 0/${cases.length}`;
}
