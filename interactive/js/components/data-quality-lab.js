export function mount(element, config) {
  const initial = structuredClone(config.initial ?? {});
  const state = structuredClone(initial);
  const applied = new Set();

  element.innerHTML = `
    <div class="metric-grid" data-role="metrics"></div>

    <div class="progress-block">
      <div class="progress-block__row">
        <span>Analytical readiness</span>
        <strong data-role="readiness-value"></strong>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-track__bar" data-role="readiness-bar"></div>
      </div>
    </div>

    <div class="action-grid" data-role="actions"></div>

    <div class="lab-toolbar">
      <p class="lab-feedback" data-role="feedback" aria-live="polite"></p>
      <button class="btn btn--secondary" type="button" data-action="reset">Скинути</button>
    </div>
  `;

  const metricsNode = element.querySelector('[data-role="metrics"]');
  const actionsNode = element.querySelector('[data-role="actions"]');
  const feedbackNode = element.querySelector('[data-role="feedback"]');
  const readinessValue = element.querySelector('[data-role="readiness-value"]');
  const readinessBar = element.querySelector('[data-role="readiness-bar"]');

  actionsNode.innerHTML = (config.actions ?? []).map(action => `
    <article class="action-card">
      <h3>${action.title}</h3>
      <p>${action.description}</p>
      <button class="btn" type="button" data-lab-action="${action.id}">${action.label}</button>
    </article>
  `).join('');

  actionsNode.addEventListener('click', event => {
    const button = event.target.closest('[data-lab-action]');
    if (!button) return;

    const action = (config.actions ?? []).find(item => item.id === button.dataset.labAction);
    if (!action || applied.has(action.id)) return;

    applyEffects(state, action.effects ?? {});
    applied.add(action.id);
    feedbackNode.textContent = action.feedback ?? 'Дію застосовано.';
    render();
  });

  element.querySelector('[data-action="reset"]').addEventListener('click', () => {
    Object.keys(state).forEach(key => delete state[key]);
    Object.assign(state, structuredClone(initial));
    applied.clear();
    feedbackNode.textContent = 'Початковий стан відновлено.';
    render();
  });

  function render() {
    metricsNode.innerHTML = (config.metrics ?? []).map(metric => `
      <div class="metric">
        <strong class="metric__value">${formatMetric(state[metric.key], metric)}</strong>
        <span class="metric__label">${metric.label}</span>
      </div>
    `).join('');

    const readiness = clamp(Number(state.readiness ?? 0), 0, 100);
    readinessValue.textContent = `${readiness}%`;
    readinessBar.style.width = `${readiness}%`;

    element.querySelectorAll('[data-lab-action]').forEach(button => {
      button.disabled = applied.has(button.dataset.labAction);
      if (button.disabled) button.textContent = 'Застосовано';
      else {
        const action = (config.actions ?? []).find(item => item.id === button.dataset.labAction);
        button.textContent = action?.label ?? 'Застосувати';
      }
    });
  }

  render();
}

function applyEffects(state, effects) {
  Object.entries(effects).forEach(([key, effect]) => {
    if (typeof effect === 'number') {
      state[key] = effect;
      return;
    }
    if (Object.hasOwn(effect, 'set')) state[key] = effect.set;
    if (Object.hasOwn(effect, 'add')) state[key] = Number(state[key] ?? 0) + effect.add;
    if (['quality', 'readiness'].includes(key)) state[key] = clamp(state[key], 0, 100);
  });
}

function formatMetric(value, metric) {
  if (metric.suffix) return `${value}${metric.suffix}`;
  return String(value ?? '—');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
