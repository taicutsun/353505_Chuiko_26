(function () {
  'use strict';

  function text(id) { return document.getElementById(id); }

  // --- Geolocation ---
  function geoInit() {
    const btn = text('geo-get');
    const out = text('geo-result');
    if (!btn || !out) return;
    btn.addEventListener('click', function () {
      out.textContent = 'Запрашиваю позицию...';
      if (!navigator.geolocation) {
        out.textContent = 'Geolocation не поддерживается в этом браузере.';
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        const c = pos.coords;
        out.textContent = 'Широта: ' + c.latitude.toFixed(6) + ', Долгота: ' + c.longitude.toFixed(6) + ', Точность: ' + c.accuracy + 'м';
      }, function (err) {
        out.textContent = 'Ошибка позиции: ' + err.message;
      }, { enableHighAccuracy: true, timeout: 10000 });
    });
  }

  // --- Speech Synthesis ---
  function speechInit() {
    const btn = text('speak-btn');
    const input = text('speak-text');
    const out = text('speak-result');
    if (!btn || !input || !out) return;
    btn.addEventListener('click', function () {
      const textToSpeak = String(input.value || '').trim();
      if (!textToSpeak) { out.textContent = 'Введите текст.'; return; }
      if (!('speechSynthesis' in window)) { out.textContent = 'SpeechSynthesis не поддерживается.'; return; }
      try {
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        // choose a Russian voice when available
        const voices = speechSynthesis.getVoices();
        const ru = voices.find(v => /ru/i.test(v.lang)) || voices[0];
        if (ru) utter.voice = ru;
        utter.rate = 1;
        utter.pitch = 1;
        utter.onstart = () => { out.textContent = 'Воспроизведение...'; };
        utter.onend = () => { out.textContent = 'Готово.'; };
        utter.onerror = (e) => { out.textContent = 'Ошибка озвучивания: ' + (e.error || e.message || 'unknown'); };
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      } catch (e) {
        out.textContent = 'Ошибка: ' + e.message;
      }
    });
  }

  // --- Battery ---
  function batteryInit() {
    const btn = text('battery-get');
    const out = text('battery-result');
    if (!btn || !out) return;
    btn.addEventListener('click', function () {
      if (!navigator.getBattery) {
        out.textContent = 'Battery API не поддерживается в этом браузере.';
        return;
      }
      out.textContent = 'Получаю состояние батареи...';
      navigator.getBattery().then(function (battery) {
        function render() {
          out.innerHTML = 'Уровень: ' + Math.round(battery.level * 100) + '%; ' + (battery.charging ? 'Зарядка' : 'Не заряжает');
        }
        render();
        battery.addEventListener('levelchange', render);
        battery.addEventListener('chargingchange', render);
      }).catch(function (err) {
        out.textContent = 'Ошибка получения батареи: ' + err.message;
      });
    });
  }

  // --- Network Info ---
  function networkInit() {
    const btn = text('net-get');
    const out = text('net-result');
    if (!btn || !out) return;
    btn.addEventListener('click', function () {
      const nav = navigator;
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection || null;
      if (!conn) {
        out.textContent = 'Network Information API не доступен.';
        return;
      }
      const info = [];
      info.push('Тип соединения: ' + (conn.type || '—'));
      info.push('Эффективный тип: ' + (conn.effectiveType || '—'));
      info.push('Downlink: ' + (conn.downlink || '—') + 'Mbps');
      info.push('RTT: ' + (conn.rtt || '—') + 'ms');
      out.textContent = info.join('; ');
    });
  }

  // --- Clipboard (copy) ---
  function clipboardInit() {
    const btn = text('clip-copy');
    const inp = text('clip-text');
    const out = text('clip-result');
    if (!btn || !inp || !out) return;
    btn.addEventListener('click', function () {
      const t = String(inp.value || '');
      if (!navigator.clipboard) {
        // fallback
        try {
          const ta = document.createElement('textarea');
          ta.value = t;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          out.textContent = 'Скопировано (fallback).';
        } catch (e) {
          out.textContent = 'Копирование не поддерживается.';
        }
        return;
      }
      navigator.clipboard.writeText(t).then(function () { out.textContent = 'Скопировано в буфер обмена.'; }, function (err) { out.textContent = 'Ошибка копирования: ' + err; });
    });
  }

  // Initialize all demos on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    geoInit();
    speechInit();
    batteryInit();
    networkInit();
    clipboardInit();
  });

})();
