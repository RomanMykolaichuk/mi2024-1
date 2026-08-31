export function mount(element, config) {
  const stages = config.stages ?? [];
  const activeId = config.active;

  element.innerHTML = `
    <div class="pipeline" role="list" aria-label="Етапи аналітичного процесу">
      ${stages.map(stage => `
        <button
          class="pipeline__stage ${stage.id === activeId ? 'is-active' : ''}"
          type="button"
          data-stage-id="${stage.id}"
          role="listitem"
          aria-pressed="${stage.id === activeId}">
          ${stage.label}
        </button>
      `).join('')}
    </div>
    <div class="pipeline__info" aria-live="polite"></div>
  `;

  const info = element.querySelector('.pipeline__info');
  const buttons = [...element.querySelectorAll('[data-stage-id]')];

  const show = id => {
    const stage = stages.find(item => item.id === id) ?? stages[0];
    if (!stage) return;

    buttons.forEach(button => {
      const selected = button.dataset.stageId === stage.id;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    info.innerHTML = `
      <strong>${stage.label}</strong><br>
      ${stage.description ?? ''}
      ${stage.output ? `<br><strong>Результат:</strong> ${stage.output}` : ''}
    `;
  };

  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.stageId)));
  show(activeId ?? stages[0]?.id);
}
