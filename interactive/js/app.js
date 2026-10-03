import { registry } from './core/registry.js';
import { resolveConfig } from './core/data.js';

async function mountElement(element) {
  if (!element || element.dataset.mounted === 'true') return;

  const name = element.dataset.component;
  const mount = registry[name];

  if (!mount) {
    renderError(element, `Невідомий компонент: ${name}`);
    return;
  }

  try {
    const config = await resolveConfig(element);
    await mount(element, config);
    element.dataset.mounted = 'true';
  } catch (error) {
    console.error(`[MI2024] ${name}`, error);
    renderError(element, 'Не вдалося завантажити інтерактивний блок. Перевірте JSON та browser console.');
  }
}

async function mountComponents() {
  const elements = [...document.querySelectorAll('[data-component]')];
  for (const element of elements) await mountElement(element);
  await mountLessonEnhancements();
}

async function mountLessonEnhancements() {
  const lessonId = new URLSearchParams(window.location.search).get('lesson');
  if (lessonId !== 't4-l9' || document.querySelector('[data-component="cnn-feature-map-lab"]')) return;

  const forward = document.querySelector('[data-component="cnn-forward-lab"]');
  const forwardSection = forward?.closest('.section-shell');
  if (!forwardSection) return;

  const section = document.createElement('section');
  section.className = 'section-shell';
  section.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">CNN PLAYGROUND · FEATURE MAPS</p>
      <h2>Що бачать шари CNN</h2>
      <p>Перемикайте synthetic input і проходьте модель крок за кроком: Input → Conv1 feature maps → Pool1 → Conv2 → prediction. Мета — побачити, як локальні межі поступово перетворюються на складніше представлення.</p>
    </div>
    <div data-component="cnn-feature-map-lab"></div>`;

  forwardSection.insertAdjacentElement('afterend', section);
  await mountElement(section.querySelector('[data-component="cnn-feature-map-lab"]'));
}

function renderError(element, message) {
  element.innerHTML = `<div class="component-error" role="alert">${message}</div>`;
}

mountComponents();
