import { addItem, getInventory, getLeaderboard, getRandomItem, login, register } from './api.js';
import { setupScore, updateLoginStatus } from './setup.js';

const $ = (id) => document.getElementById(id);

// Elements
const loginModal = $('authModal');
const openLogin  = $('openAuthModal');
const closeLogin = $('closeAuthModal');
const loginForm  = $('authForm');
const loginMsg   = $('authMessage');

const leaderboardModal = $('leaderboardModal');
const openLeaderboard  = $('openLeaderboardModal');
const closeLeaderboard = $('closeLeaderboardModal');
const leaderboardBody = $('leaderboardBody');
const leaderboardStatus = $('leaderboardStatus');

const inventoryModal  = $('inventoryModal');
const openInventory   = $('openInventoryModal');
const closeInventory = $('closeInventoryModal');
const inventoryBody = $('inventoryBody');

const shopModal  = $('shopModal');
const openShop   = $('openShopModal');
const closeShop = $('closeShopModal');
const shopBody = $('shopBody');
const generateItemButton = $('generateItemButton');

// Modal helpers
function openModal(modalEl, firstFocusSelector) {
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');
    const first = modalEl.querySelector(firstFocusSelector);
    setTimeout(() => first?.focus?.(), 40);
    document.addEventListener('keydown', trapFocus);
    document.addEventListener('keydown', onEscClose);
}

function closeModal(modalEl) {
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trapFocus);
    document.removeEventListener('keydown', onEscClose);
}

function onEscClose(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.open').forEach(el => closeModal(el));
    }
}

function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const modal = document.querySelector('.modal.open');
    if (!modal) return;
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const list = Array.from(focusables).filter(el => !el.disabled);
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
}

// Wire login modal
openLogin.addEventListener('click', () => openModal(loginModal, '#username'));
closeLogin.addEventListener('click', () => closeModal(loginModal));
// loginModal.addEventListener('click', (e) => { if (e.currentTarget === e.target) closeModal(loginModal); });

// Wire leaderboard modal
openLeaderboard.addEventListener('click', async() => {
    openModal(leaderboardModal, '#closeLeaderboardModal');
    loadLeaderboard();
});
closeLeaderboard.addEventListener('click', () => closeModal(leaderboardModal));
leaderboardModal.addEventListener('click', (e) => { if (e.target === leaderboardModal) closeModal(leaderboardModal); });

// Wire inventory modal
openInventory.addEventListener('click', async() => {
  openModal(inventoryModal, '#closeInventoryModal');
  loadInventory();
});
closeInventory.addEventListener('click', () => closeModal(inventoryModal));
inventoryModal.addEventListener('click', (e) => { if (e.target === inventoryModal) closeModal(inventoryModal); });

// Wire shop modal
openShop.addEventListener('click', async() => {
  shopBody.innerHTML = '';
  openModal(shopModal, '#closeShopModal');
});
generateItemButton.addEventListener('click', async () => {
  loadShop();
});
closeShop.addEventListener('click', () => closeModal(shopModal));
shopModal.addEventListener('click', (e) => { if (e.target === shopModal) closeModal(shopModal); });

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitter = e.submitter || document.activeElement;
  const username = $('username').value;
  const password = $('password').value;

  if (submitter && submitter.name === 'register') {
    loginMsg.textContent = 'Registering...';
    try {
      await register(username, password);
      loginMsg.textContent = 'Registered and Logged in ✓';
      updateLoginStatus();
      setTimeout(() => closeModal(loginModal), 2000);
    } catch (err) {
      loginMsg.textContent = `Registration failed: ${err?.message || err}`;
    }
  } else {
    loginMsg.textContent = 'Logging in...';
    try {
      await login(username, password);   
      loginMsg.textContent = 'Logged in ✓';
      updateLoginStatus();
      setTimeout(() => closeModal(loginModal), 2000);
    } catch (err) {
      loginMsg.textContent = `Login failed: ${err?.message || err}`;
    }
  }
});

// --- Load and render leaderboard ---
async function loadLeaderboard() {
  try {
    const data = await getLeaderboard();

    const list = Array.isArray(data) ? data : [];

    if (!list.length) {
      leaderboardStatus.textContent = 'No entries yet.';
      return;
    }

    renderLeaderboard(list);
  } catch (err) {
    leaderboardStatus.textContent = `Error: ${err?.message || err}`;
  }
}

function renderLeaderboard(users) {
  leaderboardBody.innerHTML = '';
  users.forEach((u, idx) => {
    const tr = document.createElement('tr');
    const rankTd = document.createElement('td');
    const rank = idx + 1;
    const rankSpan = document.createElement('span');
    rankSpan.className = `rank-badge rank-${rank}`;
    rankSpan.textContent = String(rank);
    if (rank > 3) rankSpan.className = 'rank-badge'; // only style top 3
    rankTd.appendChild(rankSpan);

    const userTd = document.createElement('td');
    userTd.textContent = u.userId;

    const scoreTd = document.createElement('td');
    scoreTd.textContent = u.highestScore;

    tr.appendChild(rankTd);
    tr.appendChild(userTd);
    tr.appendChild(scoreTd);
    leaderboardBody.appendChild(tr);
  });
}

// --- Load and render inventory ---
async function loadInventory() {
  try {
    const data = await getInventory();
    const list = Array.isArray(data) ? data : [];

    if (!list.length) {
      inventoryStatus.textContent = 'No items collected :(';
      inventoryBody.innerHTML = '';
      return;
    }
    renderInventory(list);
  } catch (err) {
    inventoryStatus.textContent = `Error: ${err?.message || err}`;
  }
}

function renderInventory(items) {
  inventoryStatus.textContent = '';
  inventoryBody.innerHTML = '';
  items.forEach((item) => {
    const inventoryGrid = document.createElement('div');
    inventoryGrid.className = 'inventory-item';
    const itemName = document.createElement('h3');
    const itemQuantity = document.createElement('p');
    itemName.textContent = item.name;
    itemQuantity.textContent = `x ${item.quantity}`;
    inventoryGrid.appendChild(itemName);
    inventoryGrid.appendChild(itemQuantity);
    inventoryBody.appendChild(inventoryGrid);
  });
}

// --- Load and render shop ---
async function loadShop(){
  try {
    const data = await addItem(); 
    const textContent = `Kaching -500! You got a ${data.name}!`;
    setupScore(); // Update points display
    renderShop(textContent);
  } catch (err) {
    renderShop(`Error: ${err?.message || err}`);
  }
}

function renderShop(textContent) {
  shopBody.innerHTML = '';
  const itemStatement = document.createElement('p');
  itemStatement.textContent = textContent
  shopBody.appendChild(itemStatement);
}


