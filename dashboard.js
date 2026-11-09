(async function () {
  try {
    const { totals, categories, recent } = await api('/api/stats');
    document.getElementById('statItems').textContent = totals.items;
    document.getElementById('statUnits').textContent = totals.units.toLocaleString();
    document.getElementById('statValue').textContent = money(totals.value);
    document.getElementById('statLow').textContent = totals.low;

    const max = Math.max(1, ...categories.map(c => c.count));
    document.getElementById('categoryBars').innerHTML = categories.length
      ? categories.map(c => `
        <div class="bar-row">
          <span>${esc(c.category)}</span>
          <div class="bar"><i style="width:${(c.count / max) * 100}%"></i></div>
          <strong>${c.count}</strong>
        </div>`).join('')
      : '<p class="empty">No categories yet. Add an item to get started.</p>';

    document.getElementById('recentList').innerHTML = recent.length
      ? recent.map(i => `
        <li><div><strong>${esc(i.name)}</strong><small>${esc(i.category)}</small></div>
        <div class="right">${stockBadge(i.quantity)}<small>${i.quantity} units</small></div></li>`).join('')
      : '<li class="empty">No items yet.</li>';
  } catch (e) {
    document.getElementById('recentList').innerHTML = `<li class="empty">${esc(e.message)}</li>`;
  }
})();
