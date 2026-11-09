const tbody = document.getElementById('itemsBody');
const form = document.getElementById('itemForm');
const dialog = document.getElementById('itemDialog');
const confirmDialog = document.getElementById('confirmDialog');
const formError = document.getElementById('formError');
const toast = document.getElementById('toast');
let items = [];
let deleteId = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function render() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const rows = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  tbody.innerHTML = rows.length ? rows.map(i => `
    <tr>
      <td><strong>${esc(i.name)}</strong></td>
      <td>${esc(i.category)}</td>
      <td class="num">${i.quantity}</td>
      <td class="num">${money(i.price)}</td>
      <td>${stockBadge(i.quantity)}</td>
      <td class="actions">
        <button class="btn small" data-edit="${i.id}">Edit</button>
        <button class="btn small danger" data-delete="${i.id}">Delete</button>
      </td>
    </tr>`).join('')
    : `<tr><td colspan="6" class="empty">${q ? 'No items match your search.' : 'No items yet. Select “Add item” to create one.'}</td></tr>`;
}

async function load() {
  try { items = await api('/api/items'); render(); }
  catch (e) { tbody.innerHTML = `<tr><td colspan="6" class="empty">${esc(e.message)}</td></tr>`; }
}

function openForm(item) {
  form.reset();
  formError.textContent = '';
  document.getElementById('dialogTitle').textContent = item ? 'Edit item' : 'Add item';
  form.id.value = item ? item.id : '';
  if (item) {
    form.name.value = item.name; form.category.value = item.category;
    form.quantity.value = item.quantity; form.price.value = item.price;
  }
  dialog.showModal();
}

document.getElementById('addBtn').addEventListener('click', () => openForm(null));
document.getElementById('search').addEventListener('input', render);
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));

tbody.addEventListener('click', e => {
  const edit = e.target.closest('[data-edit]');
  const del = e.target.closest('[data-delete]');
  if (edit) openForm(items.find(i => i.id === +edit.dataset.edit));
  if (del) {
    deleteId = +del.dataset.delete;
    document.getElementById('confirmName').textContent = items.find(i => i.id === deleteId).name;
    confirmDialog.showModal();
  }
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const id = form.id.value;
  const payload = { name: form.name.value, category: form.category.value, quantity: form.quantity.value, price: form.price.value };
  try {
    await api(id ? `/api/items/${id}` : '/api/items', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    dialog.close();
    showToast(id ? 'Item updated' : 'Item added');
    load();
  } catch (err) { formError.textContent = err.message; }
});

document.getElementById('confirmDelete').addEventListener('click', async () => {
  try {
    await api(`/api/items/${deleteId}`, { method: 'DELETE' });
    confirmDialog.close();
    showToast('Item deleted');
    load();
  } catch (err) { confirmDialog.close(); showToast(err.message); }
});

load();
