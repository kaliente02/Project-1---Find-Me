const toggle      = document.getElementById('filterToggle');
const fields      = document.getElementById('filterFields');
const actions     = document.getElementById('actions');
const applyBtn    = document.getElementById('applyBtn');
const clearBtn    = document.getElementById('clearBtn');
const toast       = document.getElementById('toast');
const searchInput = document.getElementById('searchInput');

let toastTimer;

// Toggle filter panel
toggle.addEventListener('click', () => {
  const open = fields.classList.toggle('open');
  actions.classList.toggle('visible', open);
  toggle.classList.toggle('active', open);
  toggle.setAttribute('aria-expanded', open);
});

// Apply filter
applyBtn.addEventListener('click', () => {
  const filters = {
    search:   searchInput.value.trim(),
    category: document.getElementById('category').value,
    status:   document.getElementById('status').value,
    location: document.getElementById('location').value.trim(),
    date:     document.getElementById('date').value,
    color:    document.getElementById('color').value,
  };

  const active = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

  showToast(active.length
    ? `Filtering by ${active.length} field${active.length > 1 ? 's' : ''}`
    : 'No filters applied');

  console.log('Applied filters:', filters);
});

// Clear filter
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  ['category', 'status', 'color'].forEach(id => {
    document.getElementById(id).selectedIndex = 0;
  });
  document.getElementById('location').value = '';
  document.getElementById('date').value = '';
  showToast('Filters cleared');
});

function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}