// Cart dynamic radio generator
(function(){
  const STORAGE_KEY = 'cart_custom_radios_v1';
  const ENABLE_KEY = 'cart_custom_radios_enabled_v1';

  function readState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function writeState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function readEnabled(){ return localStorage.getItem(ENABLE_KEY) === '1'; }
  function writeEnabled(v){ localStorage.setItem(ENABLE_KEY, v ? '1' : '0'); }

  function makeId(){ return 'r'+Date.now()+Math.floor(Math.random()*1000); }

  function createRadioBlock(entry){
    const el = document.createElement('div'); el.className = 'cd-radio-block'; el.dataset.id = entry.id;

    // preview
    const preview = document.createElement('div'); preview.className = 'cd-preview';
    const radio = document.createElement('input'); radio.type = 'radio';
    radio.name = entry.name; radio.value = entry.value;
    radio.checked = !!entry.checked; radio.required = !!entry.required; radio.disabled = !!entry.disabled;
    preview.appendChild(radio);
    const label = document.createElement('span'); label.textContent = ' ' + (entry.value || '(no value)'); preview.appendChild(label);

    // controls
    const ctrl = document.createElement('div'); ctrl.className = 'cd-controls';
    ctrl.innerHTML = `
      <label>Name: <input class="cd-input-name" type="text"></label>
      <label>Value: <input class="cd-input-value" type="text"></label>
      <label><input class="cd-input-checked" type="checkbox"> checked</label>
      <label><input class="cd-input-required" type="checkbox"> required</label>
      <label><input class="cd-input-disabled" type="checkbox"> disabled</label>
      <button class="cd-delete btn">Delete</button>
    `;

    el.appendChild(preview); el.appendChild(ctrl);

    // populate inputs
    ctrl.querySelector('.cd-input-name').value = entry.name || '';
    ctrl.querySelector('.cd-input-value').value = entry.value || '';
    ctrl.querySelector('.cd-input-checked').checked = !!entry.checked;
    ctrl.querySelector('.cd-input-required').checked = !!entry.required;
    ctrl.querySelector('.cd-input-disabled').checked = !!entry.disabled;

    // events
    function sync(){
      const name = ctrl.querySelector('.cd-input-name').value;
      const value = ctrl.querySelector('.cd-input-value').value;
      const checked = !!ctrl.querySelector('.cd-input-checked').checked;
      const required = !!ctrl.querySelector('.cd-input-required').checked;
      const disabled = !!ctrl.querySelector('.cd-input-disabled').checked;

      radio.name = name; radio.value = value; radio.checked = checked; radio.required = required; radio.disabled = disabled;
      label.textContent = ' ' + (value || '(no value)');

      // update state
      const state = readState();
      const idx = state.findIndex(s=>s.id===entry.id);
      if (idx>=0){ state[idx] = { id: entry.id, name, value, checked, required, disabled }; writeState(state); }
      // after changing name, radios grouping automatically follows the name attribute
    }

    ctrl.querySelector('.cd-input-name').addEventListener('input', sync);
    ctrl.querySelector('.cd-input-value').addEventListener('input', sync);
    ctrl.querySelector('.cd-input-checked').addEventListener('change', sync);
    ctrl.querySelector('.cd-input-required').addEventListener('change', sync);
    ctrl.querySelector('.cd-input-disabled').addEventListener('change', sync);

    ctrl.querySelector('.cd-delete').addEventListener('click', function(){
      // remove from DOM and state
      el.remove();
      const state = readState().filter(s=>s.id!==entry.id); writeState(state);
    });

    return el;
  }

  function renderAll(container){
    container.innerHTML = '';
    const state = readState();
    state.forEach(entry=>{
      const el = createRadioBlock(entry);
      container.appendChild(el);
      console.debug('[cart_dynamic] rendered entry', entry.id);
    });
  }

  function init(){
    try {
      console.debug('[cart_dynamic] init start');
      const root = document.getElementById('cart-customizer-root');
      if (!root) { console.debug('[cart_dynamic] root not found'); return; }

    const toggle = document.getElementById('cart-customizer-enable');
    const addBtn = document.getElementById('cart-customizer-add');
    const list = document.getElementById('cart-customizer-list');

    // set initial toggle from storage
    const enabled = readEnabled(); toggle.checked = !!enabled;
    root.classList.toggle('cd-enabled', !!enabled);

    toggle.addEventListener('change', function(){
      const on = !!this.checked; writeEnabled(on); root.classList.toggle('cd-enabled', on);
      console.debug('[cart_dynamic] toggle changed', on);

      if (on) {
        const state = readState();
        if (state.length === 0) {
          // Generate first radio button when checkbox is checked
          const id = makeId();
          const entry = { id, name: 'group1', value: 'val1', checked: false, required: false, disabled: false };
          state.push(entry);
          writeState(state);
          const newEl = createRadioBlock(entry);
          list.appendChild(newEl);
          try{ newEl.scrollIntoView({behavior:'smooth', block:'center'}); }catch(e){}
          console.debug('[cart_dynamic] generated first radio on checkbox click', entry.id);
        }
      }
    });

    addBtn.addEventListener('click', function(){
      console.debug('[cart_dynamic] add button clicked');
      const state = readState();
      const id = makeId();
      const name = 'group'+(Math.max(1, state.length+1));
      const entry = { id, name, value: 'val'+(state.length+1), checked:false, required:false, disabled:false };
      state.push(entry); writeState(state);
      const newEl = createRadioBlock(entry);
      list.appendChild(newEl);
      // reveal the new element in the panel
      try{ newEl.scrollIntoView({behavior:'smooth', block:'center'}); }catch(e){}
      console.debug('[cart_dynamic] appended entry', entry.id);
    });

    // initial render
    renderAll(list);
    const st = readState();
    console.debug('[cart_dynamic] initial render done', st);
    } catch (e) { console.error('[cart_dynamic] init error', e); }
  }

  // initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);
})();
