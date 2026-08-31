const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function mount(element, config) {
  const transfer = config.transfer ?? {};
  const rl = config.rl ?? {};
  element.innerHTML = `<div class="transfer-rl-lab"><div class="prep-tabs"><button class="prep-tab is-active" data-tab="transfer">Transfer Learning</button><button class="prep-tab" data-tab="rl">Reinforcement Learning</button></div><div data-role="panel"></div></div>`;
  const panel = element.querySelector('[data-role="panel"]');
  const tabs = [...element.querySelectorAll('[data-tab]')];
  let active = 'transfer';
  tabs.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.tab;
    tabs.forEach(node => node.classList.toggle('is-active', node === button));
    render();
  }));

  function render() {
    if (active === 'transfer') renderTransfer(panel, transfer);
    else renderRl(panel, rl);
  }
  render();
}

function renderTransfer(panel, config) {
  const strategies = config.strategies ?? [
    {id:'extractor',label:'Feature extractor',trainable:8,cost:25,risk:25,note:'Заморожено майже всю backbone; навчається нова head.'},
    {id:'partial',label:'Partial fine-tune',trainable:35,cost:55,risk:45,note:'Розморожено верхні блоки; компроміс між адаптацією та стабільністю.'},
    {id:'full',label:'Full fine-tune',trainable:100,cost:100,risk:75,note:'Навчається вся мережа; найбільша потреба у даних і ресурсах.'}
  ];
  panel.innerHTML = `<div class="transfer-panel"><p class="component-intro">${esc(config.intro ?? 'Виберіть стратегію адаптації попередньо навченої моделі до нового домену.')}</p><div class="transfer-strategies">${strategies.map((s,i)=>`<button class="transfer-strategy ${i===1?'is-selected':''}" data-strategy="${esc(s.id)}"><strong>${esc(s.label)}</strong><span>${esc(s.note)}</span></button>`).join('')}</div><div class="metric-grid" data-role="metrics"></div><div class="transfer-flow" data-role="flow"></div><div class="analytics-callout" data-role="insight"></div></div>`;
  const metrics = panel.querySelector('[data-role="metrics"]');
  const flow = panel.querySelector('[data-role="flow"]');
  const insight = panel.querySelector('[data-role="insight"]');
  let current = strategies[1] ?? strategies[0];
  function render() {
    panel.querySelectorAll('[data-strategy]').forEach(button => button.classList.toggle('is-selected', button.dataset.strategy === current.id));
    const domainGap = Number(config.domainGap ?? 45);
    const adaptation = clamp(45 + current.trainable * .38 - domainGap * .15, 30, 88);
    metrics.innerHTML = metric('Trainable weights', `${current.trainable}%`) + metric('Compute cost', `${current.cost}%`) + metric('Overfit risk', `${current.risk}%`) + metric('Domain adaptation', `${Math.round(adaptation)}%`);
    flow.innerHTML = `<div class="transfer-node"><span>Pretrained model</span><strong>generic representations</strong></div><b>→</b><div class="transfer-node"><span>${esc(current.label)}</span><strong>${current.trainable}% trainable</strong></div><b>→</b><div class="transfer-node"><span>Target task</span><strong>new data + validation</strong></div>`;
    insight.innerHTML = `<strong>Аналітичний висновок:</strong> ${esc(current.note)} Стратегія залежить від обсягу нових даних, domain shift, обчислювальних ресурсів і вимог до валідації.`;
  }
  panel.querySelectorAll('[data-strategy]').forEach(button => button.addEventListener('click', () => { current = strategies.find(item => item.id === button.dataset.strategy) ?? current; render(); }));
  render();
}

function renderRl(panel, config) {
  const initial = Number(config.riskWeight ?? 60);
  panel.innerHTML = `<div class="rl-panel"><p class="component-intro">${esc(config.intro ?? 'RL навчає policy через взаємодію agent ↔ environment. Нижче — безпечна абстрактна симуляція маршрутизації ресурсів.')}</p><div class="rl-loop"><div><span>STATE</span><strong>load, delay, capacity</strong></div><b>→</b><div><span>ACTION</span><strong>choose route</strong></div><b>→</b><div><span>ENVIRONMENT</span><strong>transition</strong></div><b>→</b><div><span>REWARD</span><strong>utility − risk</strong></div></div><div class="metric-control"><label>Вага ризику у reward <strong data-role="risk">${initial}%</strong></label><input data-role="slider" type="range" min="0" max="100" value="${initial}"></div><div class="metric-grid" data-role="metrics"></div><div class="analytics-callout" data-role="insight"></div></div>`;
  const slider = panel.querySelector('[data-role="slider"]');
  const risk = panel.querySelector('[data-role="risk"]');
  const metrics = panel.querySelector('[data-role="metrics"]');
  const insight = panel.querySelector('[data-role="insight"]');
  function render() {
    const w = Number(slider.value) / 100;
    risk.textContent = `${Math.round(w * 100)}%`;
    const speed = clamp(88 - w * 45, 38, 88);
    const safety = clamp(42 + w * 52, 42, 94);
    const utility = clamp(speed * .55 + safety * .45, 35, 95);
    const exploration = clamp(72 - w * 30, 35, 72);
    metrics.innerHTML = metric('Speed preference', `${Math.round(speed)}%`) + metric('Risk avoidance', `${Math.round(safety)}%`) + metric('Utility', `${Math.round(utility)}%`) + metric('Exploration', `${Math.round(exploration)}%`);
    insight.innerHTML = `<strong>Reward design matters:</strong> ${w < .35 ? 'Низька вага ризику штовхає policy до швидких, але менш консервативних рішень.' : w > .75 ? 'Висока вага ризику робить policy консервативнішою і може знижувати оперативність.' : 'Баланс reward формує компроміс між швидкістю та ризиком.'} У реальному застосуванні reward, simulation validity і human oversight потребують окремої перевірки.`;
  }
  slider.addEventListener('input', render);
  render();
}

function metric(label, value) { return `<div class="metric"><span class="metric__value">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`; }
