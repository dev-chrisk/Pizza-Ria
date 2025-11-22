// Zentrale Menü-Logik für alle Varianten
// Nutzt die Bilder aus dem Ordner /images der Projektwurzel

const MENU_IMAGES = [
  // Pfade relativ zu public/v1…v10, zurück zur Projektwurzel und dann in /images
  '../../images/Pizza 1.jpg',
  '../../images/Pizza 2.jpg',
  '../../images/Pizza 3.jpg',
  '../../images/Pizza 4.jpg',
  '../../images/Speise 1.jpg',
  '../../images/Speise 2.jpg',
  '../../images/Speise 4.jpg',
  '../../images/Speise 5.jpg',
  '../../images/Speise 6.jpg',
  '../../images/logo.jpg',
  // Weitere Bilder hier ergänzen, z. B. '../../images/andere-pizza.jpg'
];

// Fallback-Items wurden entfernt – es soll ausschließlich menu.json verwendet werden
const MENU_ITEMS = [];

// URL zu menu.json relativ zur geladenen Script-Datei ermitteln
// So funktioniert es sowohl bei:
// - index.html im Projekt-Root  -> /public/assets/scripts/menu.js
// - Seiten unter /public/...    -> /public/assets/scripts/menu.js
// - /public als Dokument-Root   -> /assets/scripts/menu.js
const MENU_JSON_URL = (function () {
  try {
    var script = document.currentScript;
    if (script && script.src) {
      return new URL('../menu.json', script.src).toString();
    }
  } catch (_e) {
    // Fallback ignorieren, unten wird ein Standard verwendet
  }
  // Fallback: relativ zum Dokument-Root
  return '/assets/menu.json';
})();

// Dynamische Daten aus /assets/menu.json (neue Speisekarte)
let MENU_DATA = null;
let RICH_MENU_ITEMS = null;

async function loadMenuData() {
  if (MENU_DATA) return MENU_DATA;

  try {
    const res = await fetch(MENU_JSON_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('menu.json nicht gefunden');
    const data = await res.json();
    MENU_DATA = data;

    const preferredCategories = ['pizza_klassisch', 'pizza_spezial', 'pasta'];
    const items = [];

    if (Array.isArray(data.categories)) {
      data.categories.forEach((cat) => {
        if (!preferredCategories.includes(cat.id)) return;
        if (!Array.isArray(cat.items)) return;

        cat.items.forEach((entry) => {
          const label = entry.code ? `${entry.code} ${entry.name}` : entry.name;
          const price =
            Array.isArray(entry.prices) && entry.prices.length ? entry.prices[0] : '';

          items.push({
            name: label,
            description: entry.description || '',
            price,
          });
        });
      });
    }

    if (items.length) {
      RICH_MENU_ITEMS = items;
    }
  } catch (err) {
    // Bei file:// Aufruf ohne Server oder falschem Pfad kann fetch fehlschlagen
    console.warn('menu.json konnte nicht geladen werden:', err);
  }

  return MENU_DATA;
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRandomImages(count) {
  if (!MENU_IMAGES.length) return new Array(count).fill('');
  const result = [];
  while (result.length < count) {
    const batch = shuffle(MENU_IMAGES);
    for (let i = 0; i < batch.length && result.length < count; i++) {
      result.push(batch[i]);
    }
  }
  return result;
}

function getItems(count) {
  const baseItems =
    Array.isArray(RICH_MENU_ITEMS) && RICH_MENU_ITEMS.length ? RICH_MENU_ITEMS : MENU_ITEMS;
  if (!baseItems.length) return [];
  const items = shuffle(baseItems);
  const result = [];
  while (result.length < count) {
    for (let i = 0; i < items.length && result.length < count; i++) {
      result.push(items[i]);
    }
  }
  return result;
}

function renderStandardMenu(container, count) {
  const items = getItems(count);
  const images = getRandomImages(count);
  container.innerHTML = '';

  items.forEach((item, index) => {
    const article = document.createElement('article');
    article.className = 'card';

    const img = document.createElement('img');
    img.src = images[index];
    img.alt = item.name;

    const h3 = document.createElement('h3');
    h3.textContent = item.name;

    const p = document.createElement('p');
    p.textContent = item.description;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = item.price;

    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(price);
    container.appendChild(article);
  });
}

function renderBentoMenu(container, count) {
  const items = getItems(count);
  const images = getRandomImages(count);
  container.innerHTML = '';

  const classesPattern = ['large', 'tall', '', 'wide', '', ''];

  items.forEach((item, index) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    const patternClass = classesPattern[index % classesPattern.length];
    if (patternClass) {
      tile.classList.add(patternClass);
    }

    const img = document.createElement('img');
    img.src = images[index];
    img.alt = item.name;

    const label = document.createElement('strong');
    label.textContent = `${item.name} – ${item.price}`;

    tile.appendChild(img);
    tile.appendChild(label);
    container.appendChild(tile);
  });
}

async function initMenus() {
  const containers = document.querySelectorAll('[data-menu]');
  if (!containers.length) return;

  // Versuche zuerst, die strukturierte Speisekarte zu laden
  try {
    await loadMenuData();
  } catch (_err) {
    // bewusst ignoriert – es bleiben dann die Fallback-Items aktiv
  }

  containers.forEach((container) => {
    const layout = container.getAttribute('data-menu') || 'standard';
    const countAttr = container.getAttribute('data-items');
    const count = Number.parseInt(countAttr || '6', 10) || 6;

    if (layout === 'bento') {
      renderBentoMenu(container, count);
    } else {
      renderStandardMenu(container, count);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMenus();
  });
} else {
  initMenus();
}


