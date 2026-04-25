/* ===== PORTFOLIO ADMIN ===== */
const STORAGE_KEY = 'angeldev_portfolio';

function getPortfolioItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePortfolioItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function extractNameFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const name = hostname.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'Project';
  }
}

function extractDomainFromUrl(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/* ===== RENDER ===== */
const portfolioList = document.getElementById('portfolioList');
const emptyState = document.getElementById('emptyState');
const itemCount = document.getElementById('itemCount');

function renderItems() {
  const items = getPortfolioItems();

  const count = items.length;
  itemCount.textContent = count + (count === 1 ? ' item' : ' items');

  if (count === 0) {
    emptyState.style.display = 'block';
    const existing = portfolioList.querySelectorAll('.portfolio-list-item');
    existing.forEach(el => el.remove());
    return;
  }

  emptyState.style.display = 'none';

  const existing = portfolioList.querySelectorAll('.portfolio-list-item');
  existing.forEach(el => el.remove());

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'portfolio-list-item';
    el.setAttribute('data-id', item.id);
    el.innerHTML = `
      <div class="item-preview">
        <div class="item-preview-wrap">
          <iframe src="${item.url}" loading="lazy" sandbox="allow-scripts allow-same-origin" title="${item.name}"></iframe>
        </div>
      </div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>${item.description || item.url}</p>
      </div>
      <div class="item-actions">
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="Visit site">
          <i class="fas fa-external-link-alt"></i>
        </a>
        <button class="btn-icon btn-danger" title="Remove" data-delete="${item.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    portfolioList.appendChild(el);
  });
}

/* ===== ADD PROJECT ===== */
const addForm = document.getElementById('addProjectForm');
const urlInput = document.getElementById('projectUrl');
const nameInput = document.getElementById('projectName');
const descInput = document.getElementById('projectDesc');

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  try {
    new URL(url);
  } catch {
    showToast('Please enter a valid URL', 'error');
    return;
  }

  const name = nameInput.value.trim() || extractNameFromUrl(url);
  const description = descInput.value.trim() || extractDomainFromUrl(url);

  const items = getPortfolioItems();
  items.push({
    id: generateId(),
    url: url,
    name: name,
    description: description
  });
  savePortfolioItems(items);

  addForm.reset();
  renderItems();
  showToast('Project added to portfolio', 'success');
});

/* ===== DELETE ===== */
portfolioList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('[data-delete]');
  if (!deleteBtn) return;

  const id = deleteBtn.getAttribute('data-delete');
  const items = getPortfolioItems().filter(item => item.id !== id);
  savePortfolioItems(items);
  renderItems();
  showToast('Project removed', 'success');
});

/* ===== TOAST ===== */
function showToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ===== MOBILE SIDEBAR ===== */
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

let overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

menuToggle.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

/* ===== INIT ===== */
renderItems();
