const workTriggers = document.querySelectorAll('.work-trigger');
const subnavs = document.querySelectorAll('.work-subnav');
const subTriggers = document.querySelectorAll('.sub-trigger');
const panels = document.querySelectorAll('.project-panel');
const layout = document.querySelector('.works-layout');

// mobile content header elements
const mobileHeader = document.getElementById('mobile-content-header');
const mobileProjectLabel = document.getElementById('mobile-project-label');
const mobileSubLabel = document.getElementById('mobile-sub-label');
const mobilePrevBtn = document.getElementById('mobile-prev-btn');
const mobileNextBtn = document.getElementById('mobile-next-btn');

// map of project keys to their display labels
const projectLabels = {
  xult: '01 — XULT',
  tlon: '02 — TLÖN UQBAR',
  nar: '03 — NAR',
  protokol: '04 — PROTOKOL 001: SEOUL'
};

function isMobile() {
  return window.innerWidth <= 820;
}

function hideAllPanels() {
  panels.forEach(panel => panel.classList.remove('active'));
}

function deactivateAllWorkTriggers() {
  workTriggers.forEach(trigger => trigger.classList.remove('active'));
}

function deactivateAllSubTriggers() {
  subTriggers.forEach(trigger => trigger.classList.remove('active'));
}

function closeAllSubnavs() {
  subnavs.forEach(subnav => subnav.classList.remove('active'));
}

function hideMobileHeader() {
  if (mobileHeader) {
    mobileHeader.classList.remove('active');
  }
  if (layout) {
    layout.classList.remove('mobile-content-open');
  }
}

function showMobileHeader(projectKey, subLabel) {
  if (!isMobile() || !mobileHeader) return;

  mobileProjectLabel.textContent = projectLabels[projectKey] || '';
  mobileSubLabel.textContent = subLabel || '';
  mobileHeader.classList.add('active');
  layout.classList.add('mobile-content-open');
}

// get sub-triggers for a given project
function getSubsForProject(projectKey) {
  const subnav = document.querySelector(`[data-subnav="${projectKey}"]`);
  if (!subnav) return [];
  return Array.from(subnav.querySelectorAll('.sub-trigger'));
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

// find the currently active sub-trigger's index within its parent subnav
function getActiveSubIndex(projectKey) {
  const subs = getSubsForProject(projectKey);
  for (let i = 0; i < subs.length; i++) {
    if (subs[i].classList.contains('active')) return i;
  }
  return -1;
}

// navigate to a sub-trigger by offset (-1 = prev, +1 = next)
function navigateSub(offset) {
  const projectKey = getActiveProject();
  if (!projectKey) return;

  const subs = getSubsForProject(projectKey);
  if (subs.length === 0) return;

  const currentIdx = getActiveSubIndex(projectKey);
  let nextIdx = currentIdx + offset;

  // wrap around
  if (nextIdx < 0) nextIdx = subs.length - 1;
  if (nextIdx >= subs.length) nextIdx = 0;

  subs[nextIdx].click();
}

// prev/next button handlers
if (mobilePrevBtn) {
  mobilePrevBtn.addEventListener('click', () => navigateSub(-1));
}
if (mobileNextBtn) {
  mobileNextBtn.addEventListener('click', () => navigateSub(1));
}

// mobile project label: tap to go back to project list
if (mobileProjectLabel) {
  mobileProjectLabel.addEventListener('click', () => {
    deactivateAllWorkTriggers();
    deactivateAllSubTriggers();
    closeAllSubnavs();
    hideAllPanels();
    hideMobileHeader();
  });
}

workTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const project = trigger.dataset.project;
    const matchingSubnav = document.querySelector(`[data-subnav="${project}"]`);
    const defaultPanel = document.querySelector(`[data-panel="${project}-default"]`);

    const isAlreadyOpen =
      trigger.classList.contains('active') &&
      matchingSubnav &&
      matchingSubnav.classList.contains('active');

    deactivateAllWorkTriggers();
    deactivateAllSubTriggers();
    closeAllSubnavs();
    hideAllPanels();
    hideMobileHeader();

    if (isAlreadyOpen) {
      return;
    }

    trigger.classList.add('active');

    if (matchingSubnav && matchingSubnav.querySelector('.sub-trigger')) {
      matchingSubnav.classList.add('active');
    } else if (defaultPanel) {
      defaultPanel.classList.add('active');

      if (isMobile()) {
        showMobileHeader(project, '');
      }
    }
  });
});

subTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const panelName = trigger.dataset.subcontent;
    const parentSubnav = trigger.closest('.work-subnav');

    if (!parentSubnav) return;

    parentSubnav.querySelectorAll('.sub-trigger').forEach(item => {
      item.classList.remove('active');
    });

    trigger.classList.add('active');
    hideAllPanels();

    const activePanel = document.querySelector(`[data-panel="${panelName}"]`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // update mobile header
    if (isMobile()) {
      const projectKey = getActiveProject();
      showMobileHeader(projectKey, trigger.textContent.trim());
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