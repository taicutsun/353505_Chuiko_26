// Plots the series approximation vs analytic function using Chart.js
(function () {
  'use strict';

  function qs(id) { return document.getElementById(id); }

  // compute analytic function F(x) = ln((x+1)/(x-1))
  function analyticF(x) {
    return Math.log((x + 1) / (x - 1));
  }

  // compute series sum up to maxTerms or until term < eps
  // series: 2 * sum_{k=1..} 1/((2k+1) * x^(2k+1))
  function seriesF(x, maxTerms, eps) {
    let sum = 0;
    for (let k = 1; k <= maxTerms; k++) {
      const denom = (2 * k + 1) * Math.pow(x, 2 * k + 1);
      const term = 1 / denom;
      sum += term;
      if (Math.abs(term) < eps) break;
    }
    return 2 * sum;
  }

  // build x array
  function buildX(start, end, step) {
    const res = [];
    if (step <= 0) return res;
    const ascending = end >= start;
    if (ascending) {
      for (let x = start; x <= end + 1e-12; x = +(x + step).toFixed(12)) res.push(x);
    } else {
      for (let x = start; x >= end - 1e-12; x = +(x - step).toFixed(12)) res.push(x);
    }
    return res;
  }

  // generate table HTML
  function renderTable(container, rows) {
    const el = qs(container);
    if (!el) return;
    if (!rows || rows.length === 0) { el.innerHTML = '<em>нет данных</em>'; return; }
    let html = '<table class="table table-sm"><thead><tr><th>x</th><th>n used</th><th>F(x) series</th><th>Math F(x)</th><th>eps (last term)</th></tr></thead><tbody>';
    for (const r of rows) {
      html += '<tr>' +
        '<td>' + r.x + '</td>' +
        '<td>' + r.n + '</td>' +
        '<td>' + r.Fseries + '</td>' +
        '<td>' + r.Fmath + '</td>' +
        '<td>' + r.lastTerm + '</td>' +
        '</tr>';
    }
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  // create chart instance and keep reference
  let chart = null;

  function plot() {
    const start = parseFloat(qs('x-start').value || '1.2');
    const end = parseFloat(qs('x-end').value || '5');
    const step = parseFloat(qs('x-step').value || '0.2');
    const nTerms = parseInt(qs('n-terms').value || '20', 10);
    const eps = parseFloat(qs('eps').value || '1e-8');

    const xs = buildX(start, end, Math.abs(step));
    // filter out |x| <= 1 where series doesn't converge
    const valid = xs.filter(x => Math.abs(x) > 1);
    const labels = valid.map(x => x.toString());

    const analytic = [];
    const approx = [];
    const rows = [];

    for (const x of valid) {
      const Fm = analyticF(x);
      // compute series and track last term used
      let sum = 0;
      let lastTerm = 0;
      let used = 0;
      for (let k = 1; k <= nTerms; k++) {
        const term = 1 / ((2 * k + 1) * Math.pow(x, 2 * k + 1));
        sum += term;
        lastTerm = term;
        used = k;
        if (Math.abs(term) < eps) break;
      }
      const Fseries = 2 * sum;
      analytic.push(+Fm.toFixed(10));
      approx.push(+Fseries.toFixed(10));
      rows.push({ x: x, n: used, Fseries: Fseries.toPrecision(10), Fmath: Fm.toPrecision(10), lastTerm: lastTerm.toExponential(2) });
    }

    // destroy previous chart
    if (chart) { chart.destroy(); chart = null; }

    const ctx = qs('series-chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Series approximation (n max = ' + nTerms + ')',
            data: approx,
            borderColor: 'rgba(220,20,60,1)',
            backgroundColor: 'rgba(220,20,60,0.1)',
            pointRadius: 3,
            fill: false,
            tension: 0.2,
          },
          {
            label: 'Analytic Math F(x)',
            data: analytic,
            borderColor: 'rgba(30,144,255,1)',
            backgroundColor: 'rgba(30,144,255,0.1)',
            pointRadius: 3,
            fill: false,
            tension: 0.2,
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          title: { display: true, text: 'Ряд vs Аналитическая функция — ln((x+1)/(x-1))' },
          legend: { display: true, position: 'top' },
          annotation: {
            annotations: {
              y0: {
                type: 'line',
                yMin: 0,
                yMax: 0,
                borderColor: 'gray',
                borderWidth: 1,
                label: { content: 'y = 0', enabled: true, position: 'start' }
              }
            }
          }
        },
        scales: {
          x: { display: true, title: { display: true, text: 'x' } },
          y: { display: true, title: { display: true, text: 'F(x)' } }
        }
      }
    });

    renderTable('series-table', rows);
  }

  function savePNG() {
    if (!chart) { alert('Сначала постройте график.'); return; }
    const url = chart.toBase64Image();
    // create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'series_chart.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const plotBtn = qs('plot-btn');
    const saveBtn = qs('save-btn');
    plotBtn && plotBtn.addEventListener('click', plot);
    saveBtn && saveBtn.addEventListener('click', savePNG);
    // initial plot
    plot();
  });

})();
