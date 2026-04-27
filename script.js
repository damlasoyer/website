const items = document.querySelectorAll('.section-item');
const hoverWords = document.getElementById('hover-words');
const epigraph = document.getElementById('epigraph');

// map section labels to their page URLs
const sectionLinks = {
  '01 — About &amp; CV': 'about.html',
  '02 — Works': 'works.html',
  '03 — Experiments': 'experiments.html',
  '04 — Case Studies': 'cases.html',
  '05 — Texts': 'texts.html',
};

// about
const about = document.querySelector('.about');

if (about) {
  about.style.cursor = 'pointer';
  about.addEventListener('click', () => {
    window.location.href = 'about.html';
  });
}

// === epigraph text rotation (daily) ===
const epigraphs = [
  "Design is not the production of objects. It is the construction of systems.",
  "Design is not objects. It is systems.",
  "Most design circulates. Few designs persist.",
  "What works is repeated. What repeats becomes culture.",
  "The role of the designer is to construct systems that can grow.",
  "Design is not harmless.",
  "It is what continues to work when no one is thinking about it."
];

if (epigraph) {
  const today = new Date().toISOString().split('T')[0];
  const dayNumber = Math.floor(new Date(today).getTime() / 86400000);
  const index = dayNumber % epigraphs.length;

  epigraph.textContent = epigraphs[index];
}
if (epigraph && !sessionStorage.getItem('epigraphShown')) {
  sessionStorage.setItem('epigraphShown', 'true');

  // start visible after a short delay
  setTimeout(() => {
    epigraph.classList.add('visible');
  }, 400);

  // fade out after a few seconds
  setTimeout(() => {
    epigraph.classList.remove('visible');
    epigraph.classList.add('faded');
  }, 4000);
} else if (epigraph) {
  // already shown this session — hide immediately
  epigraph.style.display = 'none';
}

// === section items: hover + click ===
items.forEach((item) => {
  // hover behavior (desktop)
  item.addEventListener('mouseenter', () => {
    const raw = item.dataset.hover || '';
    const words = raw.split('|').filter(Boolean);

    hoverWords.innerHTML = words
      .map(word => `<span class="hover-word">${word}</span>`)
      .join('');

    hoverWords.classList.add('active');
  });

  item.addEventListener('mouseleave', () => {
    hoverWords.classList.remove('active');
    hoverWords.innerHTML = '';
  });

  // click to navigate
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const label = item.querySelector('strong');
    if (!label) return;
    const url = sectionLinks[label.textContent.trim()];
    if (url) {
      window.location.href = url;
    }
  });
});