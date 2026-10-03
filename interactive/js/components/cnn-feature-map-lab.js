const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

const patterns = {
  cross: {
    label: 'Перехрестя',
    explanation: 'Є вертикальна і горизонтальна структура, тому різні фільтри активуються одночасно.',
    matrix: [
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
    ],
  },
  vertical: {
    label: 'Вертикальний сигнал',
    explanation: 'Переважає одна орієнтація. Порівняйте, які карти ознак стають найактивнішими.',
    matrix: [
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,1,1,1,1,0,0],
    ],
  },
  frame: {
    label: 'Контур',
    explanation: 'Замкнений контур містить межі різних напрямків — корисний приклад композиції простих ознак.',
    matrix: [
      [0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0],
    ],
  },
};

const kernels = [
  {id:'vertical', label:'Вертикальні межі', values:[[-1,0,1],[-1,0,1],[-1,0,1]]},
  {id:'horizontal', label:'Горизонтальні межі', values:[[-1,-1,-1],[0,0,0],[1,1,1]]},
  {id:'diagonal', label:'Діагональні зміни', values:[[1,1,0],[1,0,-1],[0,-1,-1]]},
];

export function mount(element) {
  let patternId = 'cross';
  let activeStage = 'input';
  let relu = true;

  element.innerHTML = `
    <div class="cnn-feature-playground">
      <div class="cnn-playground-toolbar">
        <div>
          <p class="eyebrow">SYNTHETIC INPUT</p>
          <div class="cnn-toggle" data-role="patterns">
            ${Object.entries(patterns).map(([id,item],index) => `<button type="button" class="prep-tab${index === 0 ? ' is-active' : ''}" data-pattern="${id}">${esc(item.label)}</button>`).join('')}
          </div>
        </div>
        <label class="cnn-check"><input type="checkbox" data-role="relu" checked> ReLU після Conv1</label>
      </div>

      <div class="cnn-playground-stagebar" data-role="stagebar">
        <button type="button" data-stage="input" class="is-active">1 · Input</button>
        <button type="button" data-stage="conv1">2 · Conv1</button>
        <button type="button" data-stage="pool1">3 · Pooling</button>
        <button type="button" data-stage="conv2">4 · Conv2</button>
        <button type="button" data-stage="prediction">5 · Prediction</button>
      </div>

      <div class="cnn-playground-summary" data-role="summary"></div>
      <div class="cnn-playground-canvas" data-role="canvas"></div>
      <div class="analytics-callout cnn-playground-note" data-role="note"></div>
    </div>`;

  const patternButtons = [...element.querySelectorAll('[data-pattern]')];
  const stageButtons = [...element.querySelectorAll('[data-stage]')];
  const reluToggle = element.querySelector('[data-role="relu"]');
  const summary = element.querySelector('[data-role="summary"]');
  const canvas = element.querySelector('[data-role="canvas"]');
  const note = element.querySelector('[data-role="note"]');

  patternButtons.forEach(button => button.addEventListener('click', () => {
    patternId = button.dataset.pattern;
    patternButtons.forEach(item => item.classList.toggle('is-active', item === button));
    render();
  }));

  stageButtons.forEach(button => button.addEventListener('click', () => {
    activeStage = button.dataset.stage;
    stageButtons.forEach(item => item.classList.toggle('is-active', item === button));
    render();
  }));

  reluToggle.addEventListener('change', () => {
    relu = reluToggle.checked;
    render();
  });

  function render() {
    const source = patterns[patternId];
    const rawMaps = kernels.map(kernel => convolve(source.matrix, kernel.values));
    const convMaps = relu ? rawMaps.map(map => map.map(row => row.map(value => Math.max(0,value)))) : rawMaps;
    const pooledMaps = convMaps.map(map => maxPool2(map));
    const combined = combineMaps(pooledMaps);
    const conv2 = reluMatrix(convolve(combined, [[1,-1],[-1,1]]));
    const scores = classify(source.matrix, pooledMaps, conv2);
    const probabilities = softmax(scores);

    summary.innerHTML = `<strong>${esc(source.label)}</strong><span>8×8 input</span><span>Conv1: 3 карти 6×6</span><span>Pool1: 3 карти 3×3</span><span>Conv2: 2×2</span>`;

    if (activeStage === 'input') {
      canvas.innerHTML = `<div class="cnn-stage-single"><div>${renderMap(source.matrix,'Вхід 8×8',true)}</div></div>`;
      note.innerHTML = `<strong>Крок 1 — Input.</strong> ${esc(source.explanation)} Значення 0/1 тут лише навчальна абстракція пікселів; справжнє зображення мало б канали RGB та значно більшу розмірність.`;
      return;
    }

    if (activeStage === 'conv1') {
      canvas.innerHTML = `<div class="cnn-stage-source">${renderMap(source.matrix,'Input')}</div><div class="cnn-stage-arrow">→</div><div class="cnn-feature-stack">${kernels.map((kernel,index) => `<article><h4>${esc(kernel.label)}</h4>${renderKernel(kernel.values)}${renderMap(convMaps[index],`feature map ${index + 1}`)}</article>`).join('')}</div>`;
      note.innerHTML = `<strong>Крок 2 — Conv1.</strong> Три різні kernels дивляться на той самий input, але реагують на різні локальні структури. ${relu ? 'ReLU обнуляє від’ємні responses і залишає додатні активації.' : 'ReLU вимкнено, тому видно і додатні, і від’ємні responses.'}`;
      return;
    }

    if (activeStage === 'pool1') {
      canvas.innerHTML = `<div class="cnn-feature-stack">${pooledMaps.map((map,index) => `<article><h4>${esc(kernels[index].label)}</h4>${renderMap(convMaps[index],'6×6')}<div class="cnn-stage-down">↓ max pool 2×2</div>${renderMap(map,'3×3')}</article>`).join('')}</div>`;
      note.innerHTML = '<strong>Крок 3 — Pooling.</strong> Кожна карта 6×6 стискається до 3×3. Max pooling залишає найсильніший response у локальному вікні, зменшуючи обсяг представлення та роблячи його менш чутливим до невеликих зміщень.';
      return;
    }

    if (activeStage === 'conv2') {
      canvas.innerHTML = `<div class="cnn-feature-stack cnn-feature-stack--compact">${pooledMaps.map((map,index) => `<article>${renderMap(map,`Pool ${index + 1}`)}</article>`).join('')}</div><div class="cnn-stage-arrow">→</div><div class="cnn-stage-combine">${renderMap(combined,'Комбінація каналів 3×3')}<div class="cnn-stage-down">↓ Conv2</div>${renderMap(conv2,'Складніша ознака 2×2')}</div>`;
      note.innerHTML = '<strong>Крок 4 — Conv2.</strong> Глибший шар уже працює не з сирими пікселями, а з картами ознак попереднього шару. У реальній CNN ваги цих комбінацій навчаються; тут використано прозору синтетичну операцію, щоб показати сам принцип ієрархії ознак.';
      return;
    }

    canvas.innerHTML = `<div class="cnn-prediction-flow"><div>${renderMap(conv2,'Останнє представлення')}</div><div class="cnn-stage-arrow">→</div><div class="cnn-prediction-card"><p class="eyebrow">SYNTHETIC HEAD</p><h3>Ймовірності класів</h3>${['перехрестя','вертикальний сигнал','контур'].map((label,index) => `<div class="cnn-probability-row"><span>${label}</span><div class="cnn-probability-track"><i style="width:${(probabilities[index]*100).toFixed(1)}%"></i></div><strong>${(probabilities[index]*100).toFixed(1)}%</strong></div>`).join('')}</div></div>`;
    note.innerHTML = '<strong>Крок 5 — Prediction.</strong> Для демонстрації probabilities обчислюються з простих synthetic scores, а не з навченої Dense-голови. Важлива ідея: classification head отримує вже високорівневе представлення, а не вихідні пікселі.';
  }

  render();
}

function convolve(input, kernel) {
  const rows = input.length - kernel.length + 1;
  const cols = input[0].length - kernel[0].length + 1;
  const output = [];
  for (let r = 0; r < rows; r += 1) {
    const row = [];
    for (let c = 0; c < cols; c += 1) {
      let sum = 0;
      for (let kr = 0; kr < kernel.length; kr += 1) {
        for (let kc = 0; kc < kernel[0].length; kc += 1) sum += input[r+kr][c+kc] * kernel[kr][kc];
      }
      row.push(sum);
    }
    output.push(row);
  }
  return output;
}

function maxPool2(matrix) {
  const output = [];
  for (let r = 0; r + 1 < matrix.length; r += 2) {
    const row = [];
    for (let c = 0; c + 1 < matrix[0].length; c += 2) {
      row.push(Math.max(matrix[r][c],matrix[r][c+1],matrix[r+1][c],matrix[r+1][c+1]));
    }
    output.push(row);
  }
  return output;
}

function combineMaps(maps) {
  return maps[0].map((row,r) => row.map((_,c) => maps.reduce((sum,map,index) => sum + map[r][c] * [0.45,0.35,0.2][index], 0)));
}

function reluMatrix(matrix) {
  return matrix.map(row => row.map(value => Math.max(0,value)));
}

function classify(input, pooledMaps, conv2) {
  const verticalEnergy = sum(pooledMaps[0]);
  const horizontalEnergy = sum(pooledMaps[1]);
  const diagonalEnergy = sum(pooledMaps[2]);
  const border = borderEnergy(input);
  const deep = sum(conv2);
  return [
    (verticalEnergy + horizontalEnergy) * .35 + deep * .2,
    verticalEnergy * .6 + diagonalEnergy * .1,
    border * .55 + horizontalEnergy * .12 + diagonalEnergy * .12,
  ];
}

function borderEnergy(matrix) {
  const top = matrix[1]?.slice(1,-1).reduce((a,b)=>a+b,0) ?? 0;
  const bottom = matrix[matrix.length-2]?.slice(1,-1).reduce((a,b)=>a+b,0) ?? 0;
  let sides = 0;
  for (let r=1;r<matrix.length-1;r+=1) sides += (matrix[r][1] ?? 0) + (matrix[r][matrix[0].length-2] ?? 0);
  return top + bottom + sides;
}

function sum(matrix) {
  return matrix.flat().reduce((total,value) => total + Math.abs(Number(value)), 0);
}

function softmax(values) {
  const max = Math.max(...values);
  const exp = values.map(value => Math.exp((value-max)/Math.max(1,Math.abs(max)*.2)));
  const total = exp.reduce((a,b)=>a+b,0);
  return exp.map(value => value/total);
}

function renderKernel(matrix) {
  return `<div class="cnn-mini-kernel">${matrix.flat().map(value => `<span>${esc(value)}</span>`).join('')}</div>`;
}

function renderMap(matrix,label,input=false) {
  const flat = matrix.flat().map(Number);
  const maxAbs = Math.max(1,...flat.map(value => Math.abs(value)));
  const cols = matrix[0].length;
  return `<div class="cnn-map-wrap"><small>${esc(label)}</small><div class="cnn-heatmap${input ? ' is-input' : ''}" style="--cols:${cols}">${flat.map(value => {
    const level = Math.min(1,Math.abs(value)/maxAbs);
    return `<span style="--level:${level.toFixed(3)}" title="${Number(value).toFixed(2)}">${cols <= 3 ? Number(value).toFixed(1) : ''}</span>`;
  }).join('')}</div></div>`;
}
