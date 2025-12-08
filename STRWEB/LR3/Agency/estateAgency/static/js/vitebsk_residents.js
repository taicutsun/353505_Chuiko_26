// Implements two variants to manage residents and find a pair of surnames
// living in different cities but at the same address.
// 1) Prototypal (constructor + prototype / functional style)
// 2) ES6 classes (class / extends)

(function () {
  'use strict';

  // Sample data
  const sample = [
    { surname: 'Иванов', city: 'Витебск', street: 'Ленина', house: '12', apt: '5' },
    { surname: 'Петров', city: 'Орша', street: 'Ленина', house: '12', apt: '5' },
    { surname: 'Сидоров', city: 'Витебск', street: 'Мира', house: '2', apt: '10' },
    { surname: 'Климова', city: 'Новополоцк', street: 'Победы', house: '1', apt: '1' },
    { surname: 'Козлов', city: 'Полоцк', street: 'Мира', house: '2', apt: '10' }
  ];

  // Utility: normalize the address key (street|house|apt)
  function addressKey(r) {
    return [String(r.street).trim().toLowerCase(), String(r.house).trim().toLowerCase(), String(r.apt).trim().toLowerCase()].join('|');
  }

  // --- Prototypal implementation (constructor + prototype) ---
  function BaseResidentsProto(initial) {
    this.residents = Array.isArray(initial) ? initial.slice() : [];
  }

  BaseResidentsProto.prototype.getResidents = function () {
    return this.residents.slice();
  };

  BaseResidentsProto.prototype.setResidents = function (arr) {
    this.residents = Array.isArray(arr) ? arr.slice() : [];
  };

  // formElement is a HTMLFormElement — we expect inputs named surname, city, street, house, apt
  BaseResidentsProto.prototype.addFromForm = function (formElement) {
    if (!formElement) return null;
    const data = {};
    ['surname', 'city', 'street', 'house', 'apt'].forEach(name => {
      const el = formElement.querySelector('[name="' + name + '"]');
      data[name] = el ? el.value.trim() : '';
    });
    if (!data.surname) return null;
    this.residents.push(data);
    return data;
  };

  BaseResidentsProto.prototype.displayAll = function (container) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el) return;
    if (this.residents.length === 0) {
      el.innerHTML = '<em>нет записей</em>';
      return;
    }
    const rows = this.residents.map(r => '<tr><td>' + escapeHtml(r.surname) + '</td><td>' + escapeHtml(r.city) + '</td><td>' + escapeHtml(r.street) + '</td><td>' + escapeHtml(r.house) + '</td><td>' + escapeHtml(r.apt) + '</td></tr>');
    el.innerHTML = '<table class="vitebsk-table"><thead><tr><th>Фамилия</th><th>Город</th><th>Улица</th><th>Дом</th><th>Кв.</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  };

  BaseResidentsProto.prototype.displayResult = function (container, text) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el) return;
    el.innerHTML = text ? '<div class="vitebsk-result">' + escapeHtml(text) + '</div>' : '<div class="vitebsk-result"><em>Ничего не найдено</em></div>';
  };

  // Successor: adds the searching algorithm (keeps prototype inheritance)
  function ExtendedResidentsProto(initial) {
    BaseResidentsProto.call(this, initial);
  }
  ExtendedResidentsProto.prototype = Object.create(BaseResidentsProto.prototype);
  ExtendedResidentsProto.prototype.constructor = ExtendedResidentsProto;

  ExtendedResidentsProto.prototype.findPairDifferentCitiesSameAddress = function () {
    // group by address
    const map = new Map();
    for (const r of this.residents) {
      const k = addressKey(r);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(r);
    }
    // find any group where there are residents from at least two different cities
    for (const group of map.values()) {
      if (group.length < 2) continue;
      // check cities
      const cities = new Set(group.map(x => (x.city || '').trim().toLowerCase()));
      if (cities.size >= 2) {
        // pick any two with different cities
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            if ((group[i].city || '').trim().toLowerCase() !== (group[j].city || '').trim().toLowerCase()) {
              return [group[i].surname, group[j].surname];
            }
          }
        }
      }
    }
    return null;
  };

  // --- Class-based implementation (ES6) ---
  class BaseResidentsClass {
    constructor(initial) {
      this.residents = Array.isArray(initial) ? initial.slice() : [];
    }
    getResidents() { return this.residents.slice(); }
    setResidents(arr) { this.residents = Array.isArray(arr) ? arr.slice() : []; }
    addFromForm(formElement) {
      if (!formElement) return null;
      const data = {};
      ['surname', 'city', 'street', 'house', 'apt'].forEach(name => {
        const el = formElement.querySelector('[name="' + name + '"]');
        data[name] = el ? el.value.trim() : '';
      });
      if (!data.surname) return null;
      this.residents.push(data);
      return data;
    }
    displayAll(container) {
      const el = typeof container === 'string' ? document.getElementById(container) : container;
      if (!el) return;
      if (this.residents.length === 0) { el.innerHTML = '<em>нет записей</em>'; return; }
      const rows = this.residents.map(r => '<tr><td>' + escapeHtml(r.surname) + '</td><td>' + escapeHtml(r.city) + '</td><td>' + escapeHtml(r.street) + '</td><td>' + escapeHtml(r.house) + '</td><td>' + escapeHtml(r.apt) + '</td></tr>');
      el.innerHTML = '<table class="vitebsk-table"><thead><tr><th>Фамилия</th><th>Город</th><th>Улица</th><th>Дом</th><th>Кв.</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    }
    displayResult(container, text) {
      const el = typeof container === 'string' ? document.getElementById(container) : container;
      if (!el) return;
      el.innerHTML = text ? '<div class="vitebsk-result">' + escapeHtml(text) + '</div>' : '<div class="vitebsk-result"><em>Ничего не найдено</em></div>';
    }
  }

  class ExtendedResidentsClass extends BaseResidentsClass {
    constructor(initial) { super(initial); }
    findPairDifferentCitiesSameAddress() {
      const map = new Map();
      for (const r of this.residents) {
        const k = addressKey(r);
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(r);
      }
      for (const group of map.values()) {
        if (group.length < 2) continue;
        const cities = new Set(group.map(x => (x.city || '').trim().toLowerCase()));
        if (cities.size >= 2) {
          for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
              if ((group[i].city || '').trim().toLowerCase() !== (group[j].city || '').trim().toLowerCase()) {
                return [group[i].surname, group[j].surname];
              }
            }
          }
        }
      }
      return null;
    }
  }

  // --- Small helper: escape HTML to avoid injection from form inputs ---
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (s) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
    });
  }

  // --- Wiring: instantiate and connect to the DOM ---
  document.addEventListener('DOMContentLoaded', function () {
    // Prototypal instance
    const proto = new ExtendedResidentsProto(sample);
    proto.displayAll('list-proto');
    proto.displayResult('result-proto', 'Готово. Используйте кнопку "Найти пару (proto)"');

    // Class instance
    const klass = new ExtendedResidentsClass(sample);
    klass.displayAll('list-class');
    klass.displayResult('result-class', 'Готово. Используйте кнопку "Найти пару (class)"');

    // Hook proto form
    const formProto = document.getElementById('form-proto');
    const addProtoBtn = document.getElementById('add-proto');
    const runProtoBtn = document.getElementById('run-proto');
    addProtoBtn && addProtoBtn.addEventListener('click', function () {
      const added = proto.addFromForm(formProto);
      proto.displayAll('list-proto');
      proto.displayResult('result-proto', added ? 'Добавлено: ' + added.surname : 'Ошибка добавления');
      formProto && formProto.reset();
    });
    runProtoBtn && runProtoBtn.addEventListener('click', function () {
      const pair = proto.findPairDifferentCitiesSameAddress();
      if (pair) proto.displayResult('result-proto', 'Найдена пара: ' + pair[0] + ' и ' + pair[1]);
      else proto.displayResult('result-proto', 'Пара не найдена');
    });

    // Hook class form
    const formClass = document.getElementById('form-class');
    const addClassBtn = document.getElementById('add-class');
    const runClassBtn = document.getElementById('run-class');
    addClassBtn && addClassBtn.addEventListener('click', function () {
      const added = klass.addFromForm(formClass);
      klass.displayAll('list-class');
      klass.displayResult('result-class', added ? 'Добавлено: ' + added.surname : 'Ошибка добавления');
      formClass && formClass.reset();
    });
    runClassBtn && runClassBtn.addEventListener('click', function () {
      const pair = klass.findPairDifferentCitiesSameAddress();
      if (pair) klass.displayResult('result-class', 'Найдена пара: ' + pair[0] + ' и ' + pair[1]);
      else klass.displayResult('result-class', 'Пара не найдена');
    });
  });

})();
