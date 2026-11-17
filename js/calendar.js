/**
 * 侧栏日历小部件（模仿博客园云隙光面板）
 * 插入位置：作者卡片下方
 */
(function () {
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
  let curYear, curMonth; // curMonth: 0-11

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // 统一使用东八区（UTC+8）时间，与访客本地时区无关
  function cstNow() {
    const d = new Date();
    return new Date(d.getTime() + (8 * 60 + d.getTimezoneOffset()) * 60000);
  }

  function render() {
    const grid = document.getElementById('cal-grid');
    const label = document.getElementById('cal-label');
    if (!grid || !label) return;

    label.textContent = curYear + ' 年 ' + pad(curMonth + 1) + ' 月';

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const today = cstNow();
    const isThisMonth = today.getFullYear() === curYear && today.getMonth() === curMonth;

    let html = WEEK.map(w => '<span class="cal-week">' + w + '</span>').join('');
    for (let i = 0; i < firstDay; i++) html += '<span class="cal-day cal-empty"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isThisMonth && d === today.getDate();
      html += '<span class="cal-day' + (isToday ? ' cal-today' : '') + '">' + d + '</span>';
    }
    grid.innerHTML = html;
  }

  function shift(delta) {
    curMonth += delta;
    if (curMonth < 0) { curMonth = 11; curYear--; }
    if (curMonth > 11) { curMonth = 0; curYear++; }
    render();
  }

  // defer 脚本执行时 DOM 已解析完成，用 DOMContentLoaded 触发即可。
  // 不用 window.load：它会被不蒜子/jsdelivr 等慢速外部脚本拖住，导致日历迟迟不出现
  document.addEventListener('DOMContentLoaded', function () {
    const aside = document.getElementById('aside-content');
    if (!aside) return;

    const now = cstNow();
    curYear = now.getFullYear();
    curMonth = now.getMonth();

    const card = document.createElement('div');
    card.className = 'card-widget card-calendar';
    card.innerHTML =
      '<div class="item-headline"><i class="fas fa-calendar-days"></i><span>日历</span></div>' +
      '<div class="calendar-box">' +
        '<div class="cal-header">' +
          '<button type="button" class="cal-btn" id="cal-prev" aria-label="上个月">‹</button>' +
          '<span id="cal-label"></span>' +
          '<button type="button" class="cal-btn" id="cal-next" aria-label="下个月">›</button>' +
        '</div>' +
        '<div class="cal-grid" id="cal-grid"></div>' +
      '</div>';

    const first = aside.querySelector('.card-widget');
    if (first) first.after(card); else aside.prepend(card);

    document.getElementById('cal-prev').addEventListener('click', function () { shift(-1); });
    document.getElementById('cal-next').addEventListener('click', function () { shift(1); });

    render();
  });
})();
