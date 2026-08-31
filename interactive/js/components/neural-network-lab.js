const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function mount(element, config) {
  const initial = config.initial ?? {};
  element.innerHTML = `<div class="nn-lab"><div class="nn-controls"><label>Задача<select data-role="task">${(config.tasks ?? ['classification','regression','image']).map(task => `<option value="${esc(task)}" ${task === initial.task ? 'selected' : ''}>${esc(taskLabel(task))}</option>`).join('')}</select></label><label>Прихованих шарів <strong data-role="layersValue"></strong><input data-role="layers" type="range" min="1" max="5" value="${Number(initial.layers ?? 2)}"></label><label>Нейронів/шар <strong data-role="unitsValue"></strong><input data-role="units" type="range" min="8" max="128" step="8" value="${Number(initial.units ?? 32)}"></label><label>Dropout <strong data-role="dropoutValue"></strong><input data-role="dropout" type="range" min="0" max="50" step="5" value="${Math.round(Number(initial.dropout ?? 0.2) * 100)}"></label></div><div class="nn-architecture" data-role="architecture"></div><div class="metric-grid" data-role="metrics"></div><div class="analytics-callout" data-role="insight"></div><p class="microcopy">Показники є синтетичною навчальною моделлю trade-offs, а не результатом реального TensorFlow training.</p></div>`;
  const task = element.querySelector('[data-role="task"]');
  const layers = element.querySelector('[data-role="layers"]');
  const units = element.querySelector('[data-role="units"]');
  const dropout = element.querySelector('[data-role="dropout"]');
  const architecture = element.querySelector('[data-role="architecture"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const insight = element.querySelector('[data-role="insight"]');

  function render() {
    const l = Number(layers.value), u = Number(units.value), d = Number(dropout.value) / 100;
    element.querySelector('[data-role="layersValue"]').textContent = l;
    element.querySelector('[data-role="unitsValue"]').textContent = u;
    element.querySelector('[data-role="dropoutValue"]').textContent = d.toFixed(2);
    const taskName = task.value;
    const inputs = taskName === 'image' ? 784 : 12;
    const outputs = taskName === 'regression' ? 1 : taskName === 'image' ? 10 : 3;
    let params = inputs * u + u;
    for (let i = 1; i < l; i += 1) params += u * u + u;
    params += u * outputs + outputs;
    const capacity = clamp((l * 16 + u / 2) / 100, 0.15, 1.2);
    const regularization = d * 0.7;
    const train = clamp(0.68 + capacity * 0.25 - d * 0.08, 0.62, 0.995);
    const val = clamp(0.66 + Math.min(capacity, 0.75) * 0.24 - Math.max(0, capacity - 0.72) * 0.23 + regularization * 0.08, 0.52, 0.92);
    const gap = train - val;
    architecture.innerHTML = `<div class="nn-layer nn-layer--input"><span>Input</span><strong>${inputs}</strong></div>${Array.from({length:l}, (_, index) => `<b>→</b><div class="nn-layer"><span>Dense ${index + 1}</span><strong>${u}</strong><small>ReLU${d ? ` · dropout ${d.toFixed(2)}` : ''}</small></div>`).join('')}<b>→</b><div class="nn-layer nn-layer--output"><span>Output</span><strong>${outputs}</strong><small>${esc(outputLabel(taskName))}</small></div>`;
    metrics.innerHTML = metric('Parameters', params.toLocaleString('uk-UA')) + metric('Train score', `${Math.round(train * 100)}%`) + metric('Validation score', `${Math.round(val * 100)}%`) + metric('Generalization gap', `${Math.round(gap * 100)} pp`);
    const verdict = gap > 0.12 ? 'Мережа має надлишкову місткість відносно навчального сценарію: train зростає швидше за validation.' : capacity < 0.35 ? 'Мережа може бути занадто простою для складної залежності.' : 'Архітектура демонструє відносно збалансований trade-off між місткістю та узагальненням.';
    insight.innerHTML = `<strong>Інтерпретація:</strong> ${verdict} ${esc(config.note ?? 'Кількість шарів сама по собі не гарантує кращу модель.')}`;
  }
  [task,layers,units,dropout].forEach(control => control.addEventListener('input', render));
  render();
}

function taskLabel(task) { return ({classification:'Класифікація', regression:'Регресія', image:'Зображення / MNIST'})[task] ?? task; }
function outputLabel(task) { return task === 'regression' ? 'linear' : 'softmax'; }
function metric(label, value) { return `<div class="metric"><span class="metric__value">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`; }
