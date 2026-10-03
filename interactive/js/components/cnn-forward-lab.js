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
  const builder = {
    inputSize: 64,
    conv1Filters: 16,
    conv1Kernel: 3,
    pool1: true,
    conv2Filters: 32,
    conv2Kernel: 3,
    pool2: true,
    denseUnits: 64,
  };

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

      <section class="cnn-panel cnn-builder" aria-labelledby="cnn-builder-title">
        <div class="cnn-builder__intro">
          <div>
            <p class="eyebrow">ДОДАТКОВА ПРАКТИКА · ЗБЕРИ CNN САМ</p>
            <h3 id="cnn-builder-title">Змініть архітектуру та простежте, як змінюються tensor shape і кількість параметрів</h3>
            <p class="microcopy">У конструкторі використовується padding="same", тому Conv2D не змінює ширину та висоту. MaxPooling2D(2) зменшує їх приблизно вдвічі. Формули параметрів наведені під схемою.</p>
          </div>
          <div class="cnn-builder__mission"><span>Міні-завдання</span><strong>Спробуйте отримати модель &lt; 300 тис. параметрів</strong><small>і залишити два згорткові блоки.</small></div>
        </div>

        <div class="cnn-builder__controls">
          <label>Розмір входу
            <select data-builder="inputSize">
              <option value="32">32×32×3</option>
              <option value="64" selected>64×64×3</option>
              <option value="128">128×128×3</option>
            </select>
          </label>
          <label>Conv1 filters
            <select data-builder="conv1Filters">
              <option value="8">8</option><option value="16" selected>16</option><option value="32">32</option><option value="64">64</option>
            </select>
          </label>
          <label>Conv1 kernel
            <select data-builder="conv1Kernel">
              <option value="3" selected>3×3</option><option value="5">5×5</option>
            </select>
          </label>
          <label class="cnn-builder__check"><input type="checkbox" data-builder="pool1" checked> MaxPooling після Conv1</label>
          <label>Conv2 filters
            <select data-builder="conv2Filters">
              <option value="16">16</option><option value="32" selected>32</option><option value="64">64</option><option value="128">128</option>
            </select>
          </label>
          <label>Conv2 kernel
            <select data-builder="conv2Kernel">
              <option value="3" selected>3×3</option><option value="5">5×5</option>
            </select>
          </label>
          <label class="cnn-builder__check"><input type="checkbox" data-builder="pool2" checked> MaxPooling після Conv2</label>
          <label>Dense neurons
            <select data-builder="denseUnits">
              <option value="16">16</option><option value="32">32</option><option value="64" selected>64</option><option value="128">128</option>
            </select>
          </label>
        </div>

        <div class="cnn-builder__summary">
          <div><span>Параметри</span><strong data-role="builder-total"></strong></div>
          <div><span>Flatten vector</span><strong data-role="builder-flatten"></strong></div>
          <div><span>Класів</span><strong>${classes.length}</strong></div>
          <div data-role="builder-target"></div>
        </div>

        <div class="cnn-builder__architecture" data-role="builder-architecture" aria-live="polite"></div>
        <div class="cnn-builder__details" data-role="builder-details"></div>

        <div class="cnn-builder__code-wrap">
          <div><p class="eyebrow">KERAS SEQUENTIAL</p><h4>Та сама архітектура у коді</h4></div>
          <pre class="cnn-builder__code"><code data-role="builder-code"></code></pre>
        </div>
      </section>
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
  const builderTotal = element.querySelector('[data-role="builder-total"]');
  const builderFlatten = element.querySelector('[data-role="builder-flatten"]');
  const builderTarget = element.querySelector('[data-role="builder-target"]');
  const builderArchitecture = element.querySelector('[data-role="builder-architecture"]');
  const builderDetails = element.querySelector('[data-role="builder-details"]');
  const builderCode = element.querySelector('[data-role="builder-code"]');

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

  function renderBuilder() {
    const model = calculateArchitecture(builder, classes.length);
    builderTotal.textContent = formatInteger(model.totalParams);
    builderFlatten.textContent = formatInteger(model.flattenSize);
    const targetReached = model.totalParams < 300000;
    builderTarget.className = `cnn-builder__target ${targetReached ? 'is-reached' : ''}`;
    builderTarget.innerHTML = `<span>Міні-завдання</span><strong>${targetReached ? '✓ < 300 тис.' : 'Ще > 300 тис.'}</strong>`;

    builderArchitecture.innerHTML = model.layers.map((layer,index) => `
      <div class="cnn-layer-card ${layer.kind === 'pool' ? 'is-pool' : ''} ${layer.kind === 'dense' ? 'is-dense' : ''}">
        <small>${index + 1}</small>
        <strong>${esc(layer.name)}</strong>
        <span>${esc(layer.shape)}</span>
        <em>${formatInteger(layer.params)} params</em>
      </div>${index < model.layers.length - 1 ? '<div class="cnn-layer-arrow">→</div>' : ''}`).join('');

    const denseShare = model.totalParams ? model.denseParams / model.totalParams : 0;
    const warning = denseShare > .8
      ? '<strong>Зверніть увагу:</strong> понад 80% параметрів зосереджено у Dense-частині після Flatten. Спробуйте додати pooling, зменшити input або Dense neurons і подивіться, як різко зміниться розмір моделі.'
      : '<strong>Баланс параметрів:</strong> Dense-частина вже не домінує настільки різко. Порівняйте цей варіант із конфігурацією без pooling.';

    builderDetails.innerHTML = `
      <div><strong>Conv1:</strong> (${builder.conv1Kernel}×${builder.conv1Kernel}×3 + 1) × ${builder.conv1Filters} = ${formatInteger(model.conv1Params)}</div>
      <div><strong>Conv2:</strong> (${builder.conv2Kernel}×${builder.conv2Kernel}×${builder.conv1Filters} + 1) × ${builder.conv2Filters} = ${formatInteger(model.conv2Params)}</div>
      <div><strong>Dense:</strong> (${formatInteger(model.flattenSize)} + 1) × ${builder.denseUnits} = ${formatInteger(model.dense1Params)}</div>
      <div><strong>Output:</strong> (${builder.denseUnits} + 1) × ${classes.length} = ${formatInteger(model.outputParams)}</div>
      <div class="analytics-callout">${warning}</div>`;

    builderCode.textContent = kerasCode(builder, classes.length);
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

  element.querySelectorAll('[data-builder]').forEach(control => control.addEventListener('change', () => {
    const key = control.dataset.builder;
    builder[key] = control.type === 'checkbox' ? control.checked : Number(control.value);
    renderBuilder();
  }));

  renderPooling();
  renderFlatten();
  renderProbabilities();
  renderBuilder();
}

function calculateArchitecture(builder, classCount) {
  let height = builder.inputSize;
  let width = builder.inputSize;
  let channels = 3;
  const layers = [{name:'Input',shape:`${height}×${width}×${channels}`,params:0,kind:'input'}];

  const conv1Params = (builder.conv1Kernel * builder.conv1Kernel * channels + 1) * builder.conv1Filters;
  channels = builder.conv1Filters;
  layers.push({name:`Conv2D ${channels} · ${builder.conv1Kernel}×${builder.conv1Kernel}`,shape:`${height}×${width}×${channels}`,params:conv1Params,kind:'conv'});
  if (builder.pool1) {
    height = Math.floor(height / 2);
    width = Math.floor(width / 2);
    layers.push({name:'MaxPool 2×2',shape:`${height}×${width}×${channels}`,params:0,kind:'pool'});
  }

  const conv2Params = (builder.conv2Kernel * builder.conv2Kernel * channels + 1) * builder.conv2Filters;
  channels = builder.conv2Filters;
  layers.push({name:`Conv2D ${channels} · ${builder.conv2Kernel}×${builder.conv2Kernel}`,shape:`${height}×${width}×${channels}`,params:conv2Params,kind:'conv'});
  if (builder.pool2) {
    height = Math.floor(height / 2);
    width = Math.floor(width / 2);
    layers.push({name:'MaxPool 2×2',shape:`${height}×${width}×${channels}`,params:0,kind:'pool'});
  }

  const flattenSize = height * width * channels;
  layers.push({name:'Flatten',shape:`${formatInteger(flattenSize)}`,params:0,kind:'flatten'});
  const dense1Params = (flattenSize + 1) * builder.denseUnits;
  layers.push({name:`Dense ${builder.denseUnits}`,shape:`${builder.denseUnits}`,params:dense1Params,kind:'dense'});
  const outputParams = (builder.denseUnits + 1) * classCount;
  layers.push({name:`Softmax ${classCount}`,shape:`${classCount}`,params:outputParams,kind:'dense'});

  const denseParams = dense1Params + outputParams;
  return {
    layers,
    flattenSize,
    conv1Params,
    conv2Params,
    dense1Params,
    outputParams,
    denseParams,
    totalParams: conv1Params + conv2Params + denseParams,
  };
}

function kerasCode(builder, classCount) {
  const lines = [
    'model = keras.Sequential([',
    `    layers.Rescaling(1./255, input_shape=(${builder.inputSize}, ${builder.inputSize}, 3)),`,
    `    layers.Conv2D(${builder.conv1Filters}, ${builder.conv1Kernel}, padding="same", activation="relu"),`,
  ];
  if (builder.pool1) lines.push('    layers.MaxPooling2D(2),');
  lines.push(`    layers.Conv2D(${builder.conv2Filters}, ${builder.conv2Kernel}, padding="same", activation="relu"),`);
  if (builder.pool2) lines.push('    layers.MaxPooling2D(2),');
  lines.push(
    '    layers.Flatten(),',
    `    layers.Dense(${builder.denseUnits}, activation="relu"),`,
    `    layers.Dense(${classCount}, activation="softmax"),`,
    '])',
    '',
    'model.summary()',
  );
  return lines.join('\n');
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

function formatInteger(value) {
  return new Intl.NumberFormat('uk-UA').format(Number(value));
}
