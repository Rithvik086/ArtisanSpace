const approvedTab = document.getElementById('tab-approved');
const pendingTab = document.getElementById('tab-pending');
const disapprovedTab = document.getElementById('tab-disapproved');

const approvedSection = document.getElementById('approved-section');
const pendingSection = document.getElementById('pending-section');
const disapprovedSection = document.getElementById('disapproved-section');

const countApproved = document.getElementById('count-approved');
const countPending = document.getElementById('count-pending');
const countDisapproved = document.getElementById('count-disapproved');

approvedTab.addEventListener('click', () => switchTab('approved'));
pendingTab.addEventListener('click', () => switchTab('pending'));
disapprovedTab.addEventListener('click', () => switchTab('disapproved'));

function switchTab(tab) {
  [approvedTab, pendingTab, disapprovedTab].forEach(t => t.classList.remove('active'));
  [approvedSection, pendingSection, disapprovedSection].forEach(s => s.classList.add('hidden'));

  if (tab === 'approved') {
    approvedTab.classList.add('active');
    approvedSection.classList.remove('hidden');
  } else if (tab === 'pending') {
    pendingTab.classList.add('active');
    pendingSection.classList.remove('hidden');
  } else {
    disapprovedTab.classList.add('active');
    disapprovedSection.classList.remove('hidden');
  }
}

function approveProduct(button) {
  const row = button.closest('tr');
  document.getElementById('approved-products').appendChild(row);
  row.querySelectorAll('.btn').forEach(btn => btn.remove()); // Remove buttons
  updateCounts();
  switchTab('approved'); // Switch to Approved tab
}

function disapproveProduct(button) {
  const row = button.closest('tr');
  document.getElementById('disapproved-products').appendChild(row);
  row.querySelectorAll('.btn').forEach(btn => btn.remove()); // Remove buttons
  updateCounts();
  switchTab('disapproved'); // Switch to Disapproved tab
}

function updateCounts() {
  countApproved.textContent = document.getElementById('approved-products').rows.length;
  countPending.textContent = document.getElementById('pending-products').rows.length;
  countDisapproved.textContent = document.getElementById('disapproved-products').rows.length;
}