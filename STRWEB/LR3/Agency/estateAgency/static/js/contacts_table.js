(() => {
  // Utility regex validators
  const urlValidator = (url) => {
    // Must start with http:// or https:// and end with .php or .html
    try {
      if (typeof url !== 'string') return false;
      const re = /^https?:\/\/.+\.(php|html)$/i;
      return re.test(url.trim());
    } catch(e) { return false; }
  };

  const phoneValidator = (phone) => {
    // Accepts +375 or 8 beginnings, optional spaces, parentheses, hyphens
    // Format: 8 + 3-digit operator + 7-digit subscriber = 11 digits total
    // Format: +375 + 2-digit operator + 7-digit subscriber = 12 chars total
    if (typeof phone !== 'string') return false;
    const digits = phone.replace(/[\s\-()]/g, '');
    // Allow +375XXXXXXXXX (9 digits after +375) or 8XXXXXXXXXX (10 digits after 8)
    return /^(\+375\d{9}|8\d{10})$/.test(digits);
  };

  // Main component
  window.ContactsTable = function(opts) {
    const data = opts.data || [];
    const perPage = opts.perPage || 3;
    let state = {
      all: data.slice(),
      filtered: data.slice(),
      sortBy: null,
      sortDir: 'asc',
      page: 1
    };

    const $tableBody = document.querySelector('#contacts-table-body');
    const $pager = document.querySelector('#contacts-pager');
    const $filterInput = document.querySelector('#contacts-filter-input');
    const $filterBtn = document.querySelector('#contacts-filter-btn');
    const $details = document.querySelector('#contacts-details');
    const $addBtn = document.querySelector('#contacts-add-btn');
    const $addForm = document.querySelector('#contacts-add-form');
    const $rewardBtn = document.querySelector('#contacts-reward-btn');
    const $rewardResult = document.querySelector('#contacts-reward-result');

    function renderTable() {
      // Ensure page bounds
      const total = state.filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / perPage));
      if (state.page > totalPages) state.page = totalPages;

      const start = (state.page -1) * perPage;
      const pageItems = state.filtered.slice(start, start + perPage);

      $tableBody.innerHTML = '';
      pageItems.forEach((row, idx) => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-index', start + idx);

        tr.innerHTML = `
            <td><input type="checkbox" class="select-row" data-index="${start+idx}"></td>
            <td><img src="${row.photo || ''}" class="contacts-photo"/></td>
            <td class="col-name">${escapeHtml(row.full_name)}</td>
            <td class="col-position">${escapeHtml(row.position||'')}</td>
            <td class="col-phone">${escapeHtml(row.phone||'')}</td>
            <td class="col-email">${escapeHtml(row.email||'')}</td>
          `;

        const img = tr.querySelector('img.contacts-photo');
        if (img) {
          img.addEventListener('error', function() {
            try { this.src = 'https://via.placeholder.com/64'; } catch(e){}
          });
          if (!img.src || img.src.trim() === '') img.src = 'https://via.placeholder.com/64';
        }

        // row click shows details
        tr.addEventListener('click', function(e){
          if (e.target && e.target.matches('input[type="checkbox"]')) return;
          showDetails(row);
        });

        $tableBody.appendChild(tr);
      });

      renderPager(totalPages);
    }

    function renderPager(totalPages) {
      $pager.innerHTML = '';
      const prev = document.createElement('button'); prev.textContent = 'Prev';
      prev.disabled = state.page <= 1;
      prev.addEventListener('click', ()=> { state.page--; renderTable(); });
      $pager.appendChild(prev);

      for (let p=1;p<=totalPages;p++){
        const btn = document.createElement('button'); btn.textContent = p; 
        if (p===state.page) btn.disabled = true;
        btn.addEventListener('click', ()=> { state.page = p; renderTable(); });
        $pager.appendChild(btn);
      }

      const next = document.createElement('button'); next.textContent = 'Next';
      next.disabled = state.page >= totalPages;
      next.addEventListener('click', ()=> { state.page++; renderTable(); });
      $pager.appendChild(next);
    }

    function applySort(key) {
      if (state.sortBy === key) state.sortDir = (state.sortDir === 'asc') ? 'desc' : 'asc';
      else { state.sortBy = key; state.sortDir = 'asc'; }

      state.filtered.sort((a,b)=>{
        const va = (a[key]||'').toString().toLowerCase();
        const vb = (b[key]||'').toString().toLowerCase();
        if (va < vb) return state.sortDir === 'asc' ? -1 : 1;
        if (va > vb) return state.sortDir === 'asc' ? 1 : -1;
        return 0;
      });

      document.querySelectorAll('.contacts-table thead th').forEach(th=>{
        const k = th.getAttribute('data-key');
        const ind = th.querySelector('.sort-indicator');
        if (!ind) return;
        if (k === state.sortBy) ind.textContent = state.sortDir === 'asc' ? '▲' : '▼';
        else ind.textContent = '';
      });
      state.page = 1;
      renderTable();
    }

    function doFilter() {
      const q = ($filterInput.value||'').trim().toLowerCase();
      if (!q) state.filtered = state.all.slice();
      else {
        state.filtered = state.all.filter(r=>{
          return (r.full_name||'').toLowerCase().includes(q)
              || (r.position||'').toLowerCase().includes(q)
              || (r.email||'').toLowerCase().includes(q)
              || (r.phone||'').toLowerCase().includes(q)
              || (r.description||'').toLowerCase().includes(q);
        });
      }
      state.page = 1; renderTable();
    }

    function showDetails(row) {
      $details.innerHTML = `
        <h4>${escapeHtml(row.full_name)}</h4>
        <p><strong>Position:</strong> ${escapeHtml(row.position||'')}</p>
        <p><strong>Phone:</strong> ${escapeHtml(row.phone||'')}</p>
        <p><strong>Email:</strong> ${escapeHtml(row.email||'')}</p>
        <p>${escapeHtml(row.description||'')}</p>
      `;
    }

    function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // header click binding
    document.querySelectorAll('.contacts-table thead th[data-key]').forEach(th=>{
      th.addEventListener('click', ()=> applySort(th.getAttribute('data-key')));
    });

    // filter button
    $filterBtn.addEventListener('click', ()=> doFilter());

    // Add form toggle
    $addBtn.addEventListener('click', ()=> { $addForm.classList.toggle('d-none'); });

    // form behavior
    const $addFull = document.querySelector('#add-full_name');
    const $addPhoto = document.querySelector('#add-photo');
    const $addDesc = document.querySelector('#add-description');
    const $addPhone = document.querySelector('#add-phone');
    const $addEmail = document.querySelector('#add-email');
    const $addValidateUrlResult = document.querySelector('#add-url-result');
    const $addValidatePhoneResult = document.querySelector('#add-phone-result');
    const $addSubmit = document.querySelector('#add-submit');

    function validateAddInputs(){
      const urlOk = urlValidator($addPhoto.value);
      const phoneOk = phoneValidator($addPhone.value);

      // show results
      $addValidateUrlResult.textContent = urlOk ? 'URL valid' : 'URL invalid (must start http(s) and end .php or .html)';
      $addValidateUrlResult.style.color = urlOk ? 'limegreen' : '#b91c1c';

      $addValidatePhoneResult.textContent = phoneOk ? 'Phone valid' : 'Phone invalid';
      $addValidatePhoneResult.style.color = phoneOk ? 'limegreen' : '#b91c1c';

      // highlight
      $addPhoto.classList.toggle('field-invalid', !urlOk);
      $addPhone.classList.toggle('field-invalid', !phoneOk);

      const allFilled = $addFull.value.trim() && $addPhoto.value.trim() && $addPhone.value.trim() && $addEmail.value.trim();
      $addSubmit.disabled = !(allFilled && urlOk && phoneOk);
    }

    [$addFull,$addPhoto,$addPhone,$addEmail,$addDesc].forEach(el=> el.addEventListener('input', validateAddInputs));

    $addSubmit.addEventListener('click', ()=>{
      const newRow = {
        full_name: $addFull.value.trim(),
        photo: $addPhoto.value.trim(),
        description: $addDesc.value.trim(),
        phone: $addPhone.value.trim(),
        email: $addEmail.value.trim(),
        position: ''
      };
      state.all.unshift(newRow); // add to front
      doFilter();
      $addForm.classList.add('d-none');
      // clear
      [$addFull,$addPhoto,$addPhone,$addEmail,$addDesc].forEach(i=> i.value=''); validateAddInputs();
    });

    // Reward
    $rewardBtn.addEventListener('click', ()=>{
      const checked = Array.from(document.querySelectorAll('.select-row:checked'))
        .map(cb => state.filtered[parseInt(cb.getAttribute('data-index'))]);
      if (!checked.length) { $rewardResult.textContent = 'No employees selected.'; return; }
      const names = checked.map(c=> c.full_name || c.name);
      $rewardResult.textContent = `Awarded: ${names.join(', ')}`;
    });

    // initial render
    renderTable();
  };
})();
