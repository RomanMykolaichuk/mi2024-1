const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config = {}) {
  const rawPixels = config.rawPixels ?? [0, 32, 96, 160, 224, 255];
  const epochs = config.epochs ?? [
    {epoch:1,trainLoss:1.08,valLoss:1.02,trainAcc:.52,valAcc:.55},
    {epoch:2,trainLoss:.78,valLoss:.74,trainAcc:.68,valAcc:.69},
    {epoch:3,trainLoss:.58,valLoss:.56,trainAcc:.77,valAcc:.76},
    {epoch:4,trainLoss:.43,valLoss:.46,trainAcc:.84,valAcc:.81},
    {epoch:5,trainLoss:.32,valLoss:.40,trainAcc:.89,valAcc:.84},
    {epoch:6,trainLoss:.24,valLoss:.43,trainAcc:.93,valAcc:.83},
    {epoch:7,trainLoss:.18,valLoss:.49,trainAcc:.96,valAcc:.81},
    {epoch:8,trainLoss:.14,valLoss:.57,trainAcc:.98,valAcc:.79},
  ];
  const test = config.test ?? {
    accuracy:.82,
    classes:['БПЛА','літак','інше'],
    confusion:[[18,2,1],[3,16,2],[1,2,15]],
  };
  let normalized = true;
  let epochIndex = Math.min(4, epochs.length - 1);
  let frozen = false;
  let testOpened = false;

  element.innerHTML = `
    <div class="cnn-training-lab">
      <div class="cnn-training-grid">
        <section class="cnn-panel">
          <p class="eyebrow">NORMALIZATION</p>
          <h3>Привести пікселі до зручного масштабу</h3>
          <div class="cnn-toggle" data-role="normalization-toggle">
            <button class="prep-tab is-active" type="button" data-normalized="true">0…1</button>
            <button class="prep-tab" type="button" data-normalized="false">0…255</button>
          </div>
          <div class="cnn-pixel-strip" data-role="pixel-strip"></div>
          <div class="analytics-callout" data-role="normalization-note"></div>
        </section>

        <section class="cnn-panel">
          <p class="eyebrow">TRAINING</p>
          <h3>Спостерігати train/validation, а не лише train accuracy</h3>
          <label class="cnn-slider-label" for="cnn-epoch">Епоха: <strong data-role="epoch-value"></strong></label>
          <input id="cnn-epoch" data-role="epoch" type="range" min="1" max="${epochs.length}" value="${epochIndex + 1}" step="1">
          <div class="cnn-metric-pairs" data-role="metrics"></div>
          <div class="cnn-loss-chart" data-role="loss-chart" aria-label="Навчальна крива train і validation loss"></div>
          <div class="analytics-callout" data-role="training-note"></div>
          <button class="btn" type="button" data-role="freeze">Зафіксувати модель на цій епосі</button>
        </section>
      </div>

      <section class="cnn-panel cnn-panel--evaluation">
        <p class="eyebrow">EVALUATION</p>
        <h3>Test відкриваємо після вибору моделі за validation</h3>
        <div class="cnn-eval-gate">
          <div><strong data-role="freeze-status">Модель ще не зафіксована</strong><p class="microcopy">Не підбирайте архітектуру або epoch за test set — інакше test перестає бути незалежною фінальною перевіркою.</p></div>
          <button class="btn btn--secondary" type="button" data-role="open-test" disabled>Відкрити test-оцінку</button>
        </div>
        <div class="cnn-test-result" data-role="test-result" aria-live="polite"></div>
      </section>
    </div>`;

  const normalizationToggle = element.querySelector('[data-role="normalization-toggle"]');
  const pixelStrip = element.querySelector('[data-role="pixel-strip"]');
  const normalizationNote = element.querySelector('[data-role="normalization-note"]');
  const epochInput = element.querySelector('[data-role="epoch"]');
  const epochValue = element.querySelector('[data-role="epoch-value"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const lossChart = element.querySelector('[data-role="loss-chart"]');
  const trainingNote = element.querySelector('[data-role="training-note"]');
  const freezeButton = element.querySelector('[data-role="freeze"]');
  const freezeStatus = element.querySelector('[data-role="freeze-status"]');
  const openTestButton = element.querySelector('[data-role="open-test"]');
  const testResult = element.querySelector('[data-role="test-result"]');

  function renderNormalization() {
    const values = normalized ? rawPixels.map(value => value / 255) : rawPixels;
    pixelStrip.innerHTML = values.map((value,index) => `<span style="--level:${rawPixels[index] / 255}"><i></i><strong>${normalized ? Number(value).toFixed(2) : value}</strong></span>`).join('');
    normalizationNote.innerHTML = normalized
      ? '<strong>x / 255:</strong> масштаб пікселів стає 0…1. Це не “покращує” зображення, а робить числовий масштаб входів одноріднішим і зазвичай зручнішим для оптимізації.'
      : '<strong>Сирий масштаб 0…255:</strong> значення містять ту саму візуальну інформацію, але мають значно більший числовий діапазон. Для нейромереж вхід часто нормалізують перед навчанням.';
  }

  function renderTraining() {
    const point = epochs[epochIndex];
    const bestIndex = epochs.reduce((best,indexed,currentIndex,array) => indexed.valLoss < array[best].valLoss ? currentIndex : best, 0);
    epochValue.textContent = `${point.epoch} / ${epochs.length}`;
    metrics.innerHTML = [
      ['train loss',point.trainLoss.toFixed(2)],['validation loss',point.valLoss.toFixed(2)],
      ['train accuracy',`${(point.trainAcc * 100).toFixed(0)}%`],['validation accuracy',`${(point.valAcc * 100).toFixed(0)}%`],
    ].map(([label,value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
    lossChart.innerHTML = renderLossChart(epochs, epochIndex);

    if (epochIndex < bestIndex) {
      trainingNote.innerHTML = '<strong>Ще навчається:</strong> train і validation loss одночасно знижуються. Модель поки що покращує узагальнення.';
    } else if (epochIndex === bestIndex) {
      trainingNote.innerHTML = '<strong>Найкраща validation-точка у цій симуляції:</strong> validation loss мінімальний. Це природний кандидат для early stopping.';
    } else {
      trainingNote.innerHTML = '<strong>Ознака overfitting:</strong> train loss продовжує падати, але validation loss уже зростає. Більше епох не означає кращу модель.';
    }

    if (!frozen) {
      freezeButton.textContent = `Зафіксувати epoch ${point.epoch}`;
    }
  }

  function renderEvaluation() {
    openTestButton.disabled = !frozen;
    if (!frozen) {
      freezeStatus.textContent = 'Модель ще не зафіксована';
      testResult.innerHTML = '';
      return;
    }
    freezeStatus.textContent = `Зафіксовано epoch ${epochs[epochIndex].epoch}`;
    if (!testOpened) {
      testResult.innerHTML = '<p class="microcopy">Тепер test можна використати один раз як незалежну фінальну перевірку.</p>';
      return;
    }

    const classes = test.classes ?? [];
    const confusion = test.confusion ?? [];
    const total = confusion.flat().reduce((sum,value) => sum + Number(value), 0);
    const correct = confusion.reduce((sum,row,index) => sum + Number(row[index] ?? 0), 0);
    const accuracy = Number.isFinite(test.accuracy) ? test.accuracy : (total ? correct / total : 0);
    testResult.innerHTML = `
      <div class="cnn-test-summary"><span>test accuracy</span><strong>${(accuracy * 100).toFixed(1)}%</strong><small>${correct} правильних із ${total}</small></div>
      <div class="cnn-confusion-wrap">
        <div><p class="microcopy">Матриця помилок: рядок = істинний клас, стовпець = передбачений.</p>${renderConfusion(confusion, classes)}</div>
        <div class="analytics-callout"><strong>Що перевіряти далі:</strong> не лише загальну accuracy, а конкретні класи, типові помилки, приклади misclassification та зміщення даних відносно реального середовища застосування.</div>
      </div>`;
  }

  normalizationToggle.querySelectorAll('[data-normalized]').forEach(button => button.addEventListener('click', () => {
    normalized = button.dataset.normalized === 'true';
    normalizationToggle.querySelectorAll('[data-normalized]').forEach(item => item.classList.toggle('is-active', item === button));
    renderNormalization();
  }));

  epochInput.addEventListener('input', () => {
    epochIndex = Number(epochInput.value) - 1;
    frozen = false;
    testOpened = false;
    renderTraining();
    renderEvaluation();
  });

  freezeButton.addEventListener('click', () => {
    frozen = true;
    testOpened = false;
    freezeButton.textContent = `Зафіксовано epoch ${epochs[epochIndex].epoch}`;
    renderEvaluation();
  });

  openTestButton.addEventListener('click', () => {
    if (!frozen) return;
    testOpened = true;
    renderEvaluation();
  });

  renderNormalization();
  renderTraining();
  renderEvaluation();
}

function renderLossChart(points, activeIndex) {
  const maxLoss = Math.max(...points.flatMap(point => [point.trainLoss, point.valLoss]), 1);
  return `<div class="cnn-chart-legend"><span><i></i>train loss</span><span><i></i>validation loss</span></div>
    <div class="cnn-chart-bars">${points.map((point,index) => `
      <button type="button" class="cnn-chart-epoch${index === activeIndex ? ' is-active' : ''}" tabindex="-1" aria-label="Епоха ${point.epoch}">
        <span class="cnn-bar cnn-bar--train" style="height:${Math.max(5, point.trainLoss / maxLoss * 100)}%"></span>
        <span class="cnn-bar cnn-bar--val" style="height:${Math.max(5, point.valLoss / maxLoss * 100)}%"></span>
        <small>${point.epoch}</small>
      </button>`).join('')}</div>`;
}

function renderConfusion(matrix, classes) {
  const size = matrix.length;
  const headers = classes.slice(0,size).map(label => `<span class="cnn-confusion-label">${esc(label)}</span>`).join('');
  return `<div class="cnn-confusion" style="--size:${size}"><span></span>${headers}${matrix.map((row,rowIndex) => `<span class="cnn-confusion-label">${esc(classes[rowIndex] ?? rowIndex + 1)}</span>${row.map((value,colIndex) => `<strong class="${rowIndex === colIndex ? 'is-diagonal' : ''}">${esc(value)}</strong>`).join('')}`).join('')}</div>`;
}
