(() => {
  'use strict';
  let language = 'zh';
  let topic = 'all';
  let toastTimer = null;
  let solarTimer = null;
  let themeMode = document.documentElement.dataset.themeMode || 'auto';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const rows = $$('.paper-row');
  const search = $('#paper-search');
  const toast = $('#toast');
  const themeBtn = $('#theme-toggle');
  const themeIcon = $('#theme-icon');
  const themeLabel = $('#theme-label');
  const themeBadge = $('#theme-badge');
  const solarPill = $('#solar-pill');

  const SUN_SVG =
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"/></svg>';
  const MOON_SVG =
    '<svg viewBox="0 0 24 24"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>';

  const projects = {
    droplet: {
      eyebrow: 'DIGITAL MICROFLUIDICS · VISION & PLANNING',
      zh: {
        title: '智能微流控液滴视觉与规划平台',
        paragraphs: [
          '面向数字微流控（DMF）自动化实验，构建集液滴视觉感知、形态定量分析与多液滴协同路径规划于一体的科研软件平台。'
        ],
        bullets: [
          '实时检测与分割：结合 YOLO 目标检测与 SAM 分割模型，识别电极阵列上的多液滴位置与边界。',
          '形态与体积估计：基于 OpenCV 亚像素轮廓分析，追踪液滴形变、接触角变化与分裂/合并状态。',
          '防冲突路径规划：在离散电极网格上引入时空约束搜索，生成多液滴并行调度的无碰撞控制序列。'
        ],
        note: '当前状态：实验室研究与软件系统持续迭代中。'
      },
      en: {
        title: 'Intelligent Droplet Vision & Planning Platform',
        paragraphs: [
          'A research software platform integrating visual perception, quantitative morphological analysis, and multi-droplet path planning for automated digital microfluidic (DMF) experiments.'
        ],
        bullets: [
          'Detection & segmentation: Combines YOLO object detection and SAM segmentation to localize droplets across electrode arrays.',
          'Morphological metrology: Uses OpenCV contour analysis to track droplet deformation, splitting, merging, and volume.',
          'Collision-free routing: Spatio-temporal grid search for safe, parallel multi-droplet scheduling.'
        ],
        note: 'Status: Ongoing research platform and experimental software integration.'
      }
    },
    him: {
      eyebrow: 'CLINICAL MACHINE LEARNING · LONGITUDINAL MODELING',
      zh: {
        title: 'Hemodynamic Instability Memory',
        paragraphs: [
          '围绕维持性血液透析中的血流动力学不稳定性（如透析中低血压 IDH），系统评估患者既往已完成的纵向治疗历史是否提供超越当次基线状态的增量预测信息。'
        ],
        bullets: [
          '严格时间因果边界：仅使用目标透析开始前已完整结束的历史记录，杜绝任何未来信息或同次治疗后段信号泄漏。',
          '患者级独立划分：所有模型训练、超参数选择与外部验证均严格按患者 ID 隔离。',
          '增量价值量化：在最强当次基线模型之上，通过多中心队列验证历史序列特征的可迁移性与稳健性。'
        ],
        note: '学术声明：本研究聚焦于纵向预测信息的统计评价，不据此推断生理记忆机制或直接因果效应。'
      },
      en: {
        title: 'Hemodynamic Instability Memory',
        paragraphs: [
          'Systematically evaluating whether completed longitudinal dialysis histories provide incremental predictive information for subsequent intradialytic hemodynamic instability beyond the latest pre-treatment baseline.'
        ],
        bullets: [
          'Strict temporal causality: Uses only fully completed prior sessions without lookahead or intra-session leakage.',
          'Patient-level isolation: Enforces zero patient overlap across training, validation, and multicenter test cohorts.',
          'Incremental evaluation: Quantifies predictive gain over strong single-session baselines across independent clinical centers.'
        ],
        note: 'Protocol note: Evaluates statistical predictive information; physiological memory or causal effects are not inferred.'
      }
    }
  };

  function getSolarState(date = new Date()) {
    if (typeof window.__COMPUTE_SOLAR__ === 'function') {
      return window.__COMPUTE_SOLAR__(date);
    }
    const nowMin = date.getHours() * 60 + date.getMinutes();
    return {
      sunriseMin: 390,
      sunsetMin: 1080,
      sunriseStr: '06:30',
      sunsetStr: '18:00',
      nowMin,
      isDaytime: nowMin >= 390 && nowMin < 1080
    };
  }

  function applyTheme(mode, notify = false) {
    themeMode = mode;
    const solar = getSolarState(new Date());
    const resolved = mode === 'auto' ? (solar.isDaytime ? 'light' : 'dark') : mode;
    const isDark = resolved === 'dark';

    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.themeMode = mode;

    const csMeta = document.querySelector('meta[name="color-scheme"]');
    if (csMeta) csMeta.content = resolved;

    const tcMeta = document.getElementById('meta-theme-color');
    if (tcMeta) tcMeta.content = isDark ? '#141614' : '#faf9f5';

    try {
      if (mode === 'auto') {
        localStorage.removeItem('qi-theme-mode');
      } else {
        localStorage.setItem('qi-theme-mode', mode);
      }
    } catch {}

    if (themeIcon) {
      themeIcon.innerHTML = isDark ? MOON_SVG : SUN_SVG;
    }

    if (themeLabel) {
      themeLabel.textContent =
        language === 'zh' ? (isDark ? '夜间' : '日间') : isDark ? 'Night' : 'Day';
    }

    if (themeBadge) {
      themeBadge.textContent = mode === 'auto' ? 'AUTO' : isDark ? 'NIGHT' : 'DAY';
    }

    const statusZh =
      mode === 'auto'
        ? `自动昼夜 · 今日日出 ${solar.sunriseStr} / 日落 ${solar.sunsetStr}（当前：${isDark ? '夜间模式' : '日间模式'}）`
        : `手动固定：${isDark ? '夜间模式' : '日间模式'}（点击切换，今日日落 ${solar.sunsetStr}）`;
    const statusEn =
      mode === 'auto'
        ? `Auto Solar · Sunrise ${solar.sunriseStr} / Sunset ${solar.sunsetStr} (Current: ${isDark ? 'Night' : 'Day'})`
        : `Pinned: ${isDark ? 'Night mode' : 'Day mode'} (Click to switch, Sunset ${solar.sunsetStr})`;

    if (themeBtn) {
      themeBtn.title = language === 'zh' ? statusZh : statusEn;
      themeBtn.setAttribute('aria-label', language === 'zh' ? statusZh : statusEn);
    }

    if (solarPill) {
      const modeTagZh = mode === 'auto' ? `自动${isDark ? '夜间' : '日间'}` : `固定${isDark ? '夜间' : '日间'}`;
      const modeTagEn = mode === 'auto' ? `Auto ${isDark ? 'Night' : 'Day'}` : `Pinned ${isDark ? 'Night' : 'Day'}`;
      solarPill.textContent =
        language === 'zh'
          ? `☀ ${solar.sunriseStr} · ☾ ${solar.sunsetStr} · ${modeTagZh}`
          : `☀ ${solar.sunriseStr} · ☾ ${solar.sunsetStr} · ${modeTagEn}`;
    }

    if (notify) {
      const msgZh =
        mode === 'auto'
          ? `已开启日出日落自动切换（日出 ${solar.sunriseStr} · 日落 ${solar.sunsetStr}）`
          : `已切换至${isDark ? '夜间暗色版本' : '日间暖纸版本'}`;
      const msgEn =
        mode === 'auto'
          ? `Auto sunrise/sunset enabled (${solar.sunriseStr} – ${solar.sunsetStr})`
          : `Switched to ${isDark ? 'Night (Warm Obsidian)' : 'Day (Warm Paper)'} theme`;
      showToast(language === 'zh' ? msgZh : msgEn);
    }

    scheduleSolarCheck();
  }

  function scheduleSolarCheck() {
    clearTimeout(solarTimer);
    if (themeMode !== 'auto') return;
    const now = new Date();
    const solar = getSolarState(now);
    let minutesUntilNextChange;
    if (solar.nowMin < solar.sunriseMin) {
      minutesUntilNextChange = solar.sunriseMin - solar.nowMin;
    } else if (solar.nowMin < solar.sunsetMin) {
      minutesUntilNextChange = solar.sunsetMin - solar.nowMin;
    } else {
      minutesUntilNextChange = 1440 - solar.nowMin + solar.sunriseMin;
    }
    const delayMs = Math.max(30000, minutesUntilNextChange * 60000 - now.getSeconds() * 1000 + 1500);
    solarTimer = setTimeout(() => {
      if (themeMode === 'auto') {
        applyTheme('auto', false);
      }
    }, Math.min(delayMs, 3600000));
  }

  function cycleThemeMode() {
    const solar = getSolarState(new Date());
    const autoResolved = solar.isDaytime ? 'light' : 'dark';
    const oppositeOfAuto = autoResolved === 'light' ? 'dark' : 'light';
    let nextMode;
    if (themeMode === 'auto') {
      nextMode = oppositeOfAuto;
    } else if (themeMode === oppositeOfAuto) {
      nextMode = autoResolved;
    } else {
      nextMode = 'auto';
    }
    applyTheme(nextMode, true);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2600);
  }

  function filterPapers() {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    rows.forEach((row) => {
      const text = row.textContent.toLocaleLowerCase();
      const matchesTopic = topic === 'all' || row.dataset.topic === topic;
      const matchesSearch = terms.every((term) => text.includes(term));
      row.hidden = !(matchesTopic && matchesSearch);
      if (!row.hidden) count++;
    });
    $('#paper-empty').hidden = count !== 0;
    $('#paper-count').textContent =
      language === 'zh' ? `当前显示 ${count} 篇论文` : `Showing ${count} ${count === 1 ? 'paper' : 'papers'}`;
  }

  function closeMenu() {
    const nav = $('#nav');
    const menu = $('#menu');
    if (nav) nav.classList.remove('open');
    if (menu) menu.setAttribute('aria-expanded', 'false');
  }

  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    document.title = next === 'zh' ? 'Qi Guo · AI 与真实世界' : 'Qi Guo · AI for the Physical World';
    document.body.classList.toggle('en', next === 'en');
    $$('[data-zh][data-en]').forEach((el) => {
      el.textContent = el.dataset[next];
    });
    search.placeholder = search.dataset[next === 'zh' ? 'placeholderZh' : 'placeholderEn'];
    $('#language').textContent = next === 'zh' ? 'EN' : '中文';
    $('#language').setAttribute('aria-label', next === 'zh' ? 'Switch to English' : '切换为中文');
    $('#menu').setAttribute('aria-label', next === 'zh' ? '切换导航' : 'Toggle navigation');
    $$('.close-dialog').forEach((el) => el.setAttribute('aria-label', next === 'zh' ? '关闭' : 'Close'));
    $('#copy-status').textContent = '';
    filterPapers();
    applyTheme(themeMode, false);
  }

  async function copyCitationText(key, triggerButton) {
    const bib = window.PUBLICATION_CITATIONS && window.PUBLICATION_CITATIONS[key];
    if (!bib) return;
    try {
      await navigator.clipboard.writeText(bib);
      const msg = language === 'zh' ? '已复制 BibTeX 引用' : 'BibTeX citation copied';
      showToast(msg);
      if (triggerButton) {
        const original = triggerButton.textContent;
        triggerButton.textContent = language === 'zh' ? '已复制 ✓' : 'Copied ✓';
        setTimeout(() => {
          triggerButton.textContent = triggerButton.dataset[language] || original;
        }, 1600);
      }
    } catch {
      $('#citation-text').value = bib;
      $('#copy-status').textContent =
        language === 'zh' ? '请使用 Ctrl/Cmd+C 手动复制' : 'Press Ctrl/Cmd+C to copy manually';
      $('#citation-dialog').showModal();
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', cycleThemeMode);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && themeMode === 'auto') {
      applyTheme('auto', false);
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'qi-theme-mode') {
      const next = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : 'auto';
      applyTheme(next, false);
    }
  });

  $('#language').addEventListener('click', () => setLanguage(language === 'zh' ? 'en' : 'zh'));

  $('#menu').addEventListener('click', () => {
    const opened = $('#nav').classList.toggle('open');
    $('#menu').setAttribute('aria-expanded', String(opened));
  });

  $$('#nav a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (event) => {
    const nav = $('#nav');
    const menu = $('#menu');
    if (nav && nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
    if (event.key === '/' && document.activeElement !== search && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      search.focus();
    }
  });

  $$('.filter').forEach((button) =>
    button.addEventListener('click', () => {
      topic = button.dataset.filter;
      $$('.filter').forEach((el) => {
        el.classList.toggle('active', el === button);
        el.setAttribute('aria-pressed', String(el === button));
      });
      filterPapers();
    })
  );

  search.addEventListener('input', filterPapers);

  $$('.cite').forEach((button) =>
    button.addEventListener('click', () => {
      $('#citation-text').value = window.PUBLICATION_CITATIONS[button.dataset.cite];
      $('#copy-status').textContent = '';
      $('#citation-dialog').showModal();
    })
  );

  $$('[data-copy-cite]').forEach((button) =>
    button.addEventListener('click', () => {
      copyCitationText(button.dataset.copyCite, button);
    })
  );

  $('#copy-citation').addEventListener('click', async () => {
    const field = $('#citation-text');
    try {
      await navigator.clipboard.writeText(field.value);
      const msg = language === 'zh' ? '已复制到剪贴板 ✓' : 'Copied to clipboard ✓';
      $('#copy-status').textContent = msg;
      showToast(msg);
    } catch {
      field.focus();
      field.select();
      $('#copy-status').textContent =
        language === 'zh' ? '引用已选中，请手动复制。' : 'Citation selected. Copy it manually.';
    }
  });

  $$('[data-project]').forEach((button) =>
    button.addEventListener('click', () => {
      const proj = projects[button.dataset.project];
      if (!proj) return;
      const data = proj[language];
      $('#project-eyebrow').textContent = proj.eyebrow;
      $('#project-title').textContent = data.title;
      const nodes = [];
      data.paragraphs.forEach((text) => {
        const p = document.createElement('p');
        p.textContent = text;
        nodes.push(p);
      });
      if (data.bullets && data.bullets.length) {
        const ul = document.createElement('ul');
        data.bullets.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        nodes.push(ul);
      }
      if (data.note) {
        const note = document.createElement('div');
        note.className = 'detail-note';
        note.textContent = data.note;
        nodes.push(note);
      }
      $('#project-detail').replaceChildren(...nodes);
      $('#project-dialog').showModal();
    })
  );

  $$('.close-dialog').forEach((button) =>
    button.addEventListener('click', () => button.closest('dialog').close())
  );

  $$('dialog').forEach((dialog) =>
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      ) {
        dialog.close();
      }
    })
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            $$('#nav a').forEach((link) =>
              link.classList.toggle('active', link.hash === `#${entry.target.id}`)
            );
          }
        }),
      { rootMargin: '-15% 0px -65% 0px' }
    );
    $$('main section[id]').forEach((section) => observer.observe(section));
  }

  setLanguage(language);
})();
