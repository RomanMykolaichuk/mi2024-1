const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config = {}) {
  const featureMap = config.featureMap ?? [
    [0,2,1,0],
    [1,5,4,0],
    [0,3,6,1],
    [0,0,2,4],
  ];
  const classes = config.classes ?? ['БПЛА','літак','інше'];
  const logits = config.logits ?? [2.4,1.3,0.2];
  let pooling = 'max';
  let flattened = false;
  let temperature = 1;

  element.innerHTML = `
    <div class="cnn-forward-lab">
      <div class="cnn-stepper" aria-label="Етапи прямого проходу CNN">
        <span class="is-active">1 · feature map</span><span>2 · pooling</span><span>3 · flatten</span><span>4 · dense/logits</span><span>5 · softmax</span>
      </div>

      <div class="cnn-forward-grid">
        <section class="cnn-panel">
          <p class="eyebrow">POOLING</p>
          <h3>Стиснути карту ознак, не втративши головний сигнал</h3>
          <p class="microcopy">Кожне вікно 2×2 перетворюється на одне число. Перемикайте max/average і простежте, як змінюється результат.</p>
          <div class="cnn-toggle" data-role="pooling-toggle">
            <button class="prep-tab is-active" type="button" data-mode="max">Max pooling</button>
            <button class="prep-tab" type="button" data-mode="avg">Average pooling</button>
          </div>
          <div class="cnn-matrix-flow">
            <div><small>feature map 4×4</small><div class="cnn-matrix cnn-matrix--4" data-role="feature-map"></div></div>
            <strong>→</strong>
            <div><small data-role="pool-label">max pool 2×2</small><div class="cnn-matrix cnn-matrix--2" data-role="pooled"></div></div>
          </div>
          <div class="analytics-callout" data-role="pooling-explanation"></div>
        </section>

        <section class="cnn-panel">
          <p class="eyebrow">FLATTEN → SOFTMAX</p>
          <h3>Від просторових ознак до ймовірностей класів</h3>
          <button class="btn btn--secondary" type="button" data-role="flatten-button">Розгорнути 2D → 1D</button>
          <div class="cnn-vector" data-role="flatten-vector" aria-live="polite"></div>
          <div class="cnn-dense-box">
            <span>Dense layer</span><strong>→ logits</strong>
            <div class="cnn-logits" data-role="logits"></div>
          </div>
          <label class="cnn-slider-label" for="softmax-temperature">Температура softmax: <strong data-role="temperature-value">1.0</strong></label>
          <input id="softmax-temperature" data-role="temperature" type="range" min="0.5" max="2" value="1" step="0.1">
          <div class="cnn-probabilities" data-role="probabilities"></div>
          <div class="analytics-callout"><strong>Softmax:</strong> перетворює logits на додатні значення, сума яких дорівнює 1. Це зручно читати як розподіл імовірностей між класами, але не як гарантію правильності.</div>
        </section>
      </div>
    </div>`;

  const featureNode = element.querySelector('[data-role="feature-map"]');
  const pooledNode = element.querySelector('[data-role="pooled"]');
  const poolLabel = element.querySelector('[data-role="pool-label"]');
  const poolExplanation = element.querySelector('[data-role="pooling-explanation"]');
  const toggle = element.querySelector('[data-role="pooling-toggle"]');
  const flattenButton = element.querySelector('[data-role="flatten-button"]');
  const flattenVector = element.querySelector('[data-role="flatten-vector"]');
  const logitsNode = element.querySelector('[data-role="logits"]');
  const temperatureInput = element.querySelector('[data-role="temperature"]');
  const temperatureValue = element.querySelector('[data-role="temperature-value"]');
  const probabilitiesNode = element.querySelector('[data-role="probabilities"]');

  featureNode.innerHTML = renderMatrix(featureMap);
  logitsNode.innerHTML = logits.map((value,index) => `<span><small>${esc(classes[index] ?? `клас ${index + 1}`)}</small><strong>${Number(value).toFixed(1)}</strong></span>`).join('');

  function renderPooling() {
    const pooled = pool2x2(featureMap, pooling);
    pooledNode.innerHTML = renderMatrix(pooled, true);
    poolLabel.textContent = `${pooling === 'max' ? 'max' : 'average'} pool 2×2`;
    poolExplanation.innerHTML = pooling === 'max'
      ? '<strong>Max pooling</strong> залишає найсильнішу локальну активацію у кожному вікні 2×2. Просторова розмірність зменшується 4×4 → 2×2.'
      : '<strong>Average pooling</strong> усереднює локальні активації. Інформація згладжується, а розмірність так само зменшується 4×4 → 2×2.';
    if (flattened) renderFlatten();
  }

  function renderFlatten() {
    const vector = pool2x2(featureMap, pooling).flat();
    flattenVector.innerHTML = flattened
      ? `<span class="cnn-vector__label">1D-вектор:</span>${vector.map((value,index) => `<span title="елемент ${index + 1}">${format(value)}</span>`).join('')}<small>Flatten не навчається і не змінює значення — лише форму tensor: 2×2 → 4.</small>`
      : '<span class="microcopy">Натисніть кнопку, щоб побачити, як матриця 2×2 перетворюється на послідовність з 4 чисел.</span>';
    flattenButton.textContent = flattened ? 'Повернути 1D → 2D' : 'Розгорнути 2D → 1D';
  }

  function renderProbabilities() {
    const probabilities = softmax(logits, temperature);
    temperatureValue.textContent = temperature.toFixed(1);
    probabilitiesNode.innerHTML = probabilities.map((probability,index) => `
      <div class="cnn-probability-row">
        <span>${esc(classes[index] ?? `клас ${index + 1}`)}</span>
        <div class="cnn-probability-track"><i style="width:${(probability * 100).toFixed(1)}%"></i></div>
        <strong>${(probability * 100).toFixed(1)}%</strong>
      </div>`).join('');
  }

  toggle.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    pooling = button.dataset.mode;
    toggle.querySelectorAll('[data-mode]').forEach(item => item.classList.toggle('is-active', item === button));
    renderPooling();
  }));

  flattenButton.addEventListener('click', () => {
    flattened = !flattened;
    renderFlatten();
  });

  temperatureInput.addEventListener('input', () => {
    temperature = Number(temperatureInput.value);
    renderProbabilities();
  });

  renderPooling();
  renderFlatten();
  renderProbabilities();
}

function pool2x2(matrix, mode) {
  const result = [];
  for (let row = 0; row < matrix.length; row += 2) {
    const outRow = [];
    for (let col = 0; col < matrix[0].length; col += 2) {
      const values = [matrix[row][col], matrix[row][col + 1], matrix[row + 1][col], matrix[row + 1][col + 1]];
      outRow.push(mode === 'avg' ? values.reduce((sum,value) => sum + value, 0) / values.length : Math.max(...values));
    }
    result.push(outRow);
  }
  return result;
}

function softmax(logits, temperature = 1) {
  const scaled = logits.map(value => value / Math.max(temperature, 0.01));
  const max = Math.max(...scaled);
  const exps = scaled.map(value => Math.exp(value - max));
  const total = exps.reduce((sum,value) => sum + value, 0);
  return exps.map(value => value / total);
}

function renderMatrix(matrix, hot = false) {
  const max = Math.max(...matrix.flat().map(Number));
  return matrix.flat().map(value => `<span class="cnn-cell${hot && Number(value) === max ? ' is-hot' : ''}">${format(value)}</span>`).join('');
}

function format(value) {
  return Number.isInteger(Number(value)) ? String(Number(value)) : Number(value).toFixed(2);
}
