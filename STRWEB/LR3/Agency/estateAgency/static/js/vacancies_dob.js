// Front-end-only DOB widget for vacancies page
(function(){
  'use strict';
  function calcAgeYears(birth){
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
    return years;
  }
  function dayOfWeekName(d){
    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d];
  }

  function showMessage(container, html, isWarning){
    container.innerHTML = '';
    const p = document.createElement('div');
    p.innerHTML = html;
    if (isWarning) p.style.color = '#e74c3c';
    container.appendChild(p);
  }

  function init(){
    const root = document.getElementById('vacancy-dob-widget');
    if (!root) return;
    const input = document.getElementById('dob-input');
    const btn = document.getElementById('dob-check');
    const result = document.getElementById('dob-result');

    function handle(value){
      if (!value){ showMessage(result, 'Пожалуйста, выберите дату.'); return; }
      const parts = value.split('-');
      // value expected in YYYY-MM-DD
      const year = parseInt(parts[0],10);
      const month = parseInt(parts[1],10)-1;
      const day = parseInt(parts[2],10);
      const birth = new Date(year, month, day);
      if (isNaN(birth.getTime())){ showMessage(result, 'Неверная дата.'); return; }
      const age = calcAgeYears(birth);
      const dow = dayOfWeekName(birth.getDay());
      if (age >= 18){
        showMessage(result, `Вы ${age} ${age===1? 'год':'лет'}; вы родились в ${dow}.`);
      } else {
        // minor: show inline warning; avoid repeated modal alerts
        const txt = `Вам ${age} ${age===1? 'год':'лет'}. Для использования сайта требуется разрешение родителей.`;
        showMessage(result, txt, true);
        try{
          // show modal alert at most once per session to avoid loops/annoyance
          if (!sessionStorage.getItem('vacancy_dob_alert_shown')){
            sessionStorage.setItem('vacancy_dob_alert_shown', '1');
            alert('Вы несовершеннолетний(ая): требуется разрешение родителей для использования сайта.');
          }
        }catch(e){}
      }
    }

    btn.addEventListener('click', function(){ handle(input.value); });
    input.addEventListener('change', function(){ handle(this.value); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
