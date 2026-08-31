const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config) {
  const cases = config.cases ?? [];
  const answers = new Map();

  element.innerHTML = `
    <p class="component-intro">${esc(config.intro ?? 'Оберіть рішення і проаналізуйте наслідок.')}</p>
    <div class="decision-case-list" data-role="cases"></div>
    <div class="decision-progress" aria-live="polite">
      <strong data-role="score">0/${cases.length}</strong>
      <span data-role="message">Пройдіть усі ситуації.</span>
    </div>
  `;

  const root = element.querySelector('[data-role="cases"]');
  const score = element.querySelector('[data-role="score"]');
  const message = element.querySelector('[data-role="message"]');

  function render() {
    root.innerHTML = cases.map((item, index) => {
      const selected = answers.get(item.id);
      const chosen = item.options?.[selected];
      return `
        <article class="decision-case ${selected !== undefined ? 'is-answered' : ''}">
          <div class="decision-case__head">
            <span class="decision-case__number">${index + 1}</span>
            <div><p class="eyebrow">${esc(item.kicker ?? 'СИТУАЦІЯ')}</p><h3>${esc(item.title)}</h3></div>
          </div>
          <p class="decision-case__scenario">${esc(item.scenario)}</p>
          <p class="decision-case__question"><strong>${esc(item.question)}</strong></p>
          <div class="decision-options">
            ${(item.options ?? []).map((option, optionIndex) => `
              <button class="decision-option ${selected === optionIndex ? 'is-selected' : ''}" type="button" data-case="${esc(item.id)}" data-option="${optionIndex}">
                ${esc(option.label)}
              </button>
            `).join('')}
          </div>
          ${chosen ? `
            <div class="decision-feedback ${chosen.correct ? 'is-good' : 'is-risk'}">
              <strong>${chosen.correct ? 'Обґрунтоване рішення' : 'Ризиковане рішення'}</strong>
              <p>${esc(chosen.consequence)}</p>
              ${chosen.rationale ? `<p><strong>Чому:</strong> ${esc(chosen.rationale)}</p>` : ''}
            </div>
            ${item.takeaway ? `<p class="decision-takeaway"><strong>Висновок:</strong> ${esc(item.takeaway)}</p>` : ''}
          ` : ''}
        </article>
      `;
    }).join('');

    root.querySelectorAll('[data-case]').forEach(button => {
      button.addEventListener('click', () => {
        answers.set(button.dataset.case, Number(button.dataset.option));
        render();
      });
    });

    const correct = [...answers.entries()].filter(([caseId, optionIndex]) => {
      const item = cases.find(entry => entry.id === caseId);
      return Boolean(item?.options?.[optionIndex]?.correct);
    }).length;
    score.textContent = `${answers.size}/${cases.length}`;

    if (answers.size === cases.length) {
      message.textContent = `${correct} із ${cases.length} рішень обґрунтовані. ${config.complete ?? 'Порівняйте наслідки й сформулюйте власне правило.'}`;
    } else {
      message.textContent = `Розглянуто ${answers.size} із ${cases.length} ситуацій.`;
    }
  }

  render();
}
