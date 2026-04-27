const cells = document.querySelectorAll('.art-cell');
const navItems = document.querySelectorAll('.art-nav-item');

let currentIndex = -1;

// ===== BUILD LIGHTBOX =====

const lightbox = document.createElement('div');
lightbox.className = 'art-lightbox';
lightbox.innerHTML = `
  <button class="art-lightbox-close">&times;</button>
  <div class="art-lightbox-image"><img src="" alt=""></div>
  <div class="art-lightbox-info">
    <div class="art-lightbox-number"></div>
    <div class="art-lightbox-title"></div>
    <div class="art-lightbox-year"></div>
    <div class="art-lightbox-desc"></div>
  </div>
  <div class="art-lightbox-nav">
    <button class="art-lightbox-arrow" data-dir="-1">&lt;</button>
    <button class="art-lightbox-arrow" data-dir="1">&gt;</button>
  </div>
`;
document.body.appendChild(lightbox);

const lbImg = lightbox.querySelector('.art-lightbox-image img');
const lbNumber = lightbox.querySelector('.art-lightbox-number');
const lbTitle = lightbox.querySelector('.art-lightbox-title');
const lbYear = lightbox.querySelector('.art-lightbox-year');
const lbDesc = lightbox.querySelector('.art-lightbox-desc');
const lbClose = lightbox.querySelector('.art-lightbox-close');
const lbArrows = lightbox.querySelectorAll('.art-lightbox-arrow');


// ===== OPEN LIGHTBOX =====

function openLightbox(index) {
  if (index < 0 || index >= cells.length) return;
  currentIndex = index;

  const cell = cells[index];
  const overlay = cell.querySelector('.art-overlay');

  lbImg.src = cell.querySelector('img').src;
  lbImg.alt = cell.querySelector('img').alt;
  lbNumber.textContent = overlay.querySelector('.art-overlay-number').textContent;
  lbTitle.textContent = overlay.querySelector('.art-overlay-title').textContent;
  lbYear.textContent = overlay.querySelector('.art-overlay-year').textContent;
  lbDesc.textContent = overlay.querySelector('.art-overlay-desc').textContent;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // highlight nav item
  navItems.forEach(n => n.classList.remove('active'));
  if (navItems[index]) navItems[index].classList.add('active');
}


// ===== CLOSE LIGHTBOX =====

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  currentIndex = -1;
  navItems.forEach(n => n.classList.remove('active'));
}


// ===== NAVIGATE =====

function navigate(dir) {
  let next = currentIndex + dir;
  if (next < 0) next = cells.length - 1;
  if (next >= cells.length) next = 0;
  openLightbox(next);
}


// ===== EVENT LISTENERS =====

// grid cells
cells.forEach((cell, i) => {
  cell.addEventListener('click', () => openLightbox(i));
});

// nav items
navItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

// close
lbClose.addEventListener('click', closeLightbox);

// click on background to close (not on image or info)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// arrows
lbArrows.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigate(parseInt(btn.dataset.dir));
  });
});

// keyboard
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});
