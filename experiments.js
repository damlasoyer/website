const workTriggers = document.querySelectorAll('.work-trigger');
const panels = document.querySelectorAll('.project-panel');
const layout = document.querySelector('.works-layout');

const mobileHeader = document.getElementById('mobile-content-header');
const mobileProjectLabel = document.getElementById('mobile-project-label');
const mobilePrevBtn = document.getElementById('mobile-prev-btn');
const mobileNextBtn = document.getElementById('mobile-next-btn');

const projectLabels = {
  chaos: '01 — Chaos and Cymatics',
  seed: '02 — Seed: Space and Architecture',
  dskin: '03 — Digital Skin',
  synth1: '04 — Synth I: Body as Interface',
  synth2: '05 — Synth II: Motion-Driven Fashion'
};

// ordered list of project keys for prev/next navigation
const projectOrder = ['chaos', 'seed', 'dskin', 'synth1', 'synth2'];

function isMobile() {
  return window.innerWidth <= 820;
}

function hideAllPanels() {
  panels.forEach(panel => panel.classList.remove('active'));
}

function deactivateAllTriggers() {
  workTriggers.forEach(trigger => trigger.classList.remove('active'));
}

function hideMobileHeader() {
  if (mobileHeader) mobileHeader.classList.remove('active');
  if (layout) layout.classList.remove('mobile-content-open');
}

function showMobileHeader(projectKey) {
  if (!isMobile() || !mobileHeader) return;
  mobileProjectLabel.textContent = projectLabels[projectKey] || '';
  mobileHeader.classList.add('active');
  layout.classList.add('mobile-content-open');
}

// find which project is currently active
function getActiveProject() {
  for (const trigger of workTriggers) {
    if (trigger.classList.contains('active')) {
      return trigger.dataset.project;
    }
  }
  return null;
}

// navigate to a project by offset (-1 = prev, +1 = next)
function navigateProject(offset) {
  const current = getActiveProject();
  if (!current) return;

  const idx = projectOrder.indexOf(current);
  if (idx === -1) return;

  let next = idx + offset;
  if (next < 0) next = projectOrder.length - 1;
  if (next >= projectOrder.length) next = 0;

  // find and click the matching work-trigger
  for (const trigger of workTriggers) {
    if (trigger.dataset.project === projectOrder[next]) {
      trigger.click();
      return;
    }
  }
}

if (mobilePrevBtn) {
  mobilePrevBtn.addEventListener('click', () => navigateProject(-1));
}
if (mobileNextBtn) {
  mobileNextBtn.addEventListener('click', () => navigateProject(1));
}

if (mobileProjectLabel) {
  mobileProjectLabel.addEventListener('click', () => {
    deactivateAllTriggers();
    hideAllPanels();
    hideMobileHeader();
  });
}

workTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const project = trigger.dataset.project;
    const panel = document.querySelector(`[data-panel="${project}-default"]`);
    const isAlreadyOpen = trigger.classList.contains('active');

    deactivateAllTriggers();
    hideAllPanels();
    hideMobileHeader();

    if (isAlreadyOpen) return;

    trigger.classList.add('active');

    if (panel) {
      panel.classList.add('active');
      if (isMobile()) showMobileHeader(project);
    }
  });
});

// ===== LIGHTBOX =====
(function () {
  if (isMobile()) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const img = document.createElement('img');
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  document.querySelector('.works-content').addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName !== 'IMG') return;
    if (isMobile()) return;

    img.src = target.src;
    img.alt = target.alt;
    overlay.classList.add('active');
  });

  overlay.addEventListener('click', function () {
    overlay.classList.remove('active');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  });
})();