/* ═══════════════════════════════════════════════════════════
   site.js — behaviour for the whole page.
   No dependencies, no build step, no trackers.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ─────────────────────────────────────────────────────────
     1 · CONFIG  ← the only block you normally edit
     Leave a value as "" and whatever depends on it disappears
     from the site, so nothing ever renders broken.
     ───────────────────────────────────────────────────────── */
  var CONTACT = {
    // Split so naive address-harvesting bots don't get a clean match.
    emailUser: "mikhail.carcausto",
    emailHost: "gmail.com",
    // Digits only, country code first. Peru = 51.
    whatsapp: "51924298403",
    linkedin: "https://www.linkedin.com/in/mikhail-carcausto",
    // Display + dial format. "" drops the click-to-call row.
    phone: "+51 924 298 403"
  };


  var EMAIL = CONTACT.emailUser + "@" + CONTACT.emailHost;

  /* ─────────────────────────────────────────────────────────
     2 · TESTIMONIALS
     REAL ones only. While empty the section stays hidden.
     DEMO exists solely to preview the layout: publishing invented
     testimonials is deceptive advertising, so PREVIEW_DEMO must
     stay false in anything that ships.
     ───────────────────────────────────────────────────────── */
  var PREVIEW_DEMO = false;
  var TESTIMONIALS = [
    // { quote: "…", name: "…", role: "Especialista de Contratos", org: "Minera …" }
  ];
  var DEMO = [
    { quote: "En dos sesiones ordené la evaluación que el comité me había devuelto. La segunda vez pasó sin observaciones.",
      name: "Nombre Apellido", role: "Especialista de Contratos", org: "Compañía minera (ejemplo)" },
    { quote: "El acompañamiento me dio el criterio que ningún curso me había dado. Lideré mi primera licitación sola.",
      name: "Nombre Apellido", role: "Analista de Abastecimiento", org: "Operación de cobre (ejemplo)" },
    { quote: "El programa me preparó para el cambio de rol. A los cinco meses ya estaba en la posición que buscaba.",
      name: "Nombre Apellido", role: "Coordinador de Supply Chain", org: "Proyecto minero (ejemplo)" }
  ];

  /* ─────────────────────────────────────────────────────────
     3 · LANGUAGE
     ───────────────────────────────────────────────────────── */
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var ES = new Map();
  nodes.forEach(function (n) { ES.set(n, n.textContent); });
  var altNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-alt]"));
  var ALT_ES = new Map();
  altNodes.forEach(function (n) { ALT_ES.set(n, n.alt); });
  var lang = "es";

  function setLang(next) {
    lang = next === "en" ? "en" : "es";
    document.documentElement.lang = lang;
    document.title = window.UI[lang].title;
    nodes.forEach(function (n) {
      var key = n.getAttribute("data-i18n");
      if (lang === "en" && window.EN[key]) n.textContent = window.EN[key];
      else n.textContent = ES.get(n);
    });
    altNodes.forEach(function (img) {
      var key = img.getAttribute("data-i18n-alt");
      img.alt = (lang === "en" && window.EN[key]) ? window.EN[key] : ALT_ES.get(img);
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });
    renderChannels();
    wireWhatsApp();
    var btn = document.getElementById("reqsend");
    if (btn && !btn.disabled) btn.textContent = window.UI[lang].send;
    try { localStorage.setItem("mc_lang", lang); } catch (e) {}
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });
  var stored = null;
  try { stored = localStorage.getItem("mc_lang"); } catch (e) {}
  var guess = stored || ((navigator.language || "es").toLowerCase().indexOf("es") === 0 ? "es" : "en");

  /* ─────────────────────────────────────────────────────────
     4 · WHATSAPP
     Every .js-wa opens a chat with a pre-filled line in the
     active language. Without a number they keep pointing at the
     contact form, which is where their href already goes.
     ───────────────────────────────────────────────────────── */
  function waUrl(extra) {
    return "https://wa.me/" + CONTACT.whatsapp + "?text=" +
      encodeURIComponent(window.UI[lang].waMsg + (extra ? " " + extra : ""));
  }
  function wireWhatsApp() {
    if (!CONTACT.whatsapp) return;
    document.querySelectorAll(".js-wa").forEach(function (a) {
      a.href = waUrl();
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ─────────────────────────────────────────────────────────
     5 · PLAN BUTTONS
     Choosing a format pre-selects it in the form, so the visitor
     never has to say twice what they already clicked.
     ───────────────────────────────────────────────────────── */
  var planSelect = document.getElementById("f-plan");
  document.querySelectorAll(".js-pick").forEach(function (a) {
    a.addEventListener("click", function () {
      if (planSelect && a.dataset.plan) planSelect.value = a.dataset.plan;
      var msgBox = document.getElementById("f-msg");
      if (msgBox) setTimeout(function () { msgBox.focus({ preventScroll: true }); }, 450);
    });
  });

  /* ─────────────────────────────────────────────────────────
     6 · DIRECT CHANNELS
     ───────────────────────────────────────────────────────── */
  var ICON = {
    wa:   '<path d="M3 17.5 4.2 14A7.2 7.2 0 1 1 7 16.8L3 17.5Z"/><path d="M7.4 7.8c.2 1.6 2.9 4.3 4.5 4.5.5.1 1.2-.6 1.4-1l-1.6-.9-.7.7c-.8-.4-1.6-1.2-2-2l.7-.7-.9-1.6c-.4.2-1.1.9-1 1.4"/>',
    in:   '<path d="M4.2 7.5v8.3M4.2 4.4v.1M8.6 15.8V7.5M8.6 11c0-2 1.3-3 2.8-3s2.8.9 2.8 3.2v4.6"/>',
    mail: '<path d="M2 5h16v11H2z"/><path d="m2 6 8 6 8-6"/>',
    tel:  '<path d="M6.6 3.5 8.4 7 6.8 8.6c.9 1.9 2.7 3.7 4.6 4.6L13 11.6l3.5 1.8v2.8c0 .7-.6 1.3-1.3 1.2C8.3 16.9 3.1 11.7 2.4 4.8c-.1-.7.5-1.3 1.2-1.3h3Z"/>'
  };
  function svg(d) {
    return '<svg viewBox="0 0 20 20" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
  }
  function renderChannels() {
    var list = document.getElementById("channels");
    if (!list) return;
    var t = window.UI[lang];
    var html = "";
    if (CONTACT.whatsapp) {
      html += "<li><a href='" + waUrl() + "' target='_blank' rel='noopener'>" + svg(ICON.wa) +
        "<span>" + t.chWa + "<small>" + t.chWaSub + "</small></span></a></li>";
    }
    if (CONTACT.linkedin) {
      html += "<li><a href='" + CONTACT.linkedin + "' target='_blank' rel='noopener'>" + svg(ICON.in) +
        "<span>" + t.chIn + "<small>" + t.chInSub + "</small></span></a></li>";
    }
    html += "<li><button type='button' id='copymail'>" + svg(ICON.mail) +
      "<span>" + t.copy + "<small>" + EMAIL + "</small></span></button></li>";
    if (CONTACT.phone) {
      html += "<li><a href='tel:" + CONTACT.phone.replace(/[^\d+]/g, "") + "'>" + svg(ICON.tel) +
        "<span>" + t.chTel + "<small>" + CONTACT.phone + "</small></span></a></li>";
    }
    list.innerHTML = html;

    var copy = document.getElementById("copymail");
    if (copy) {
      copy.addEventListener("click", function () {
        var done = function () {
          var span = copy.querySelector("span");
          var was = span.firstChild.nodeValue;
          span.firstChild.nodeValue = window.UI[lang].copied;
          setTimeout(function () { span.firstChild.nodeValue = was; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(EMAIL).then(done, done);
        } else {
          var ta = document.createElement("textarea");
          ta.value = EMAIL; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta); done();
        }
      });
    }
  }

  /* ─────────────────────────────────────────────────────────
     8 · TESTIMONIALS
     ───────────────────────────────────────────────────────── */
  function renderQuotes() {
    var sec = document.getElementById("testimonios");
    var box = document.getElementById("quotes");
    if (!sec || !box) return;
    var demo = PREVIEW_DEMO && !TESTIMONIALS.length;
    var list = TESTIMONIALS.length ? TESTIMONIALS : (demo ? DEMO : []);
    if (!list.length) { sec.hidden = true; return; }
    box.textContent = "";
    list.forEach(function (t) {
      var art = document.createElement("article");
      art.className = "plan";
      if (demo) art.style.borderStyle = "dashed";
      var p = document.createElement("p");
      p.textContent = "“" + t.quote + "”";
      var who = document.createElement("p");
      who.className = "plan__fit";
      var b = document.createElement("b");
      b.textContent = t.name + (demo ? " · EJEMPLO" : "");
      who.appendChild(b);
      who.appendChild(document.createTextNode(" — " + t.role + (t.org ? ", " + t.org : "")));
      art.appendChild(p); art.appendChild(who);
      box.appendChild(art);
    });
    sec.hidden = false;
  }

  /* ─────────────────────────────────────────────────────────
     8b · AUDIENCE TABS
     One services section, two audiences. ARIA tabs with arrow-
     key support; any [data-tab] link (nav, hero) opens its panel,
     and #empresas / #profesionales deep-link straight in.
     ───────────────────────────────────────────────────────── */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var TAB = { pro: "tab-pro", emp: "tab-emp" };

  function selectTab(btn, focus) {
    tabBtns.forEach(function (b) {
      var on = b === btn;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) btn.focus();
  }
  tabBtns.forEach(function (b, i) {
    b.addEventListener("click", function () { selectTab(b); });
    b.addEventListener("keydown", function (e) {
      var k = e.key, n = tabBtns.length, to = null;
      if (k === "ArrowRight") to = tabBtns[(i + 1) % n];
      else if (k === "ArrowLeft") to = tabBtns[(i - 1 + n) % n];
      else if (k === "Home") to = tabBtns[0];
      else if (k === "End") to = tabBtns[n - 1];
      if (to) { e.preventDefault(); selectTab(to, true); }
    });
  });
  document.querySelectorAll("[data-tab]").forEach(function (a) {
    a.addEventListener("click", function () {
      var btn = document.getElementById(TAB[a.dataset.tab]);
      if (btn) selectTab(btn);
    });
  });
  var hash = (location.hash || "").toLowerCase();
  if (hash === "#empresas" || hash === "#profesionales") {
    selectTab(document.getElementById(hash === "#empresas" ? "tab-emp" : "tab-pro"));
    var svc = document.getElementById("servicios");
    if (svc) setTimeout(function () { svc.scrollIntoView(); }, 0);
  }

  /* ─────────────────────────────────────────────────────────
     9 · LEAD CLASSIFICATION
     The subject line that lands in the inbox. Longer commitments
     and company work sort first.
     ───────────────────────────────────────────────────────── */
  function classifyLead(plan) {
    var map = {
      programa: ["A", "PROGRAMA"],
      empresa:  ["A", "EMPRESA"],
      proceso:  ["A", "PROCESO"],
      sesion:   ["B", "SESION"],
      nose:     ["B", "EXPLORANDO"]
    };
    var m = map[plan] || ["C", "OTRO"];
    return { priority: m[0], tag: "[" + m[0] + "·" + m[1] + "]" };
  }

  /* ─────────────────────────────────────────────────────────
     10 · CONTACT FORM
     Posts to FormSubmit (no backend to host). If that is
     unreachable or not yet activated it falls back to a
     pre-filled email, so the form always works.
     ───────────────────────────────────────────────────────── */
  var form = document.getElementById("reqform");
  var msg = document.getElementById("reqmsg");
  var sendBtn = document.getElementById("reqsend");

  function say(text, bad) {
    msg.textContent = text;
    msg.classList.add("is-on");
    msg.classList.toggle("is-bad", !!bad);
  }
  function mailtoFallback(d, tag) {
    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(tag + " " + d.name) +
      "&body=" + encodeURIComponent(d.name + "\n" + d.email + "\n\n" + d.message);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = window.UI[lang];
      if (form._honey.value) { say(t.ok); form.reset(); return; }

      var d = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        plan: form.plan.value,
        message: form.message.value.trim()
      };
      [form.name, form.email, form.message].forEach(function (f) { f.classList.remove("err"); });
      if (!d.name || !d.email || !d.message) {
        if (!d.name) form.name.classList.add("err");
        if (!d.email) form.email.classList.add("err");
        if (!d.message) form.message.classList.add("err");
        say(t.errFields, true);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) {
        form.email.classList.add("err");
        say(t.errMail, true);
        return;
      }

      var lead = classifyLead(d.plan);
      sendBtn.disabled = true;
      sendBtn.textContent = t.sending;
      say(t.sending);

      fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: lead.tag + " " + d.name,
          _template: "table",
          Prioridad: lead.priority,
          Nombre: d.name,
          Correo: d.email,
          Formato: d.plan,
          Mensaje: d.message
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (r && String(r.success) === "true") { say(window.UI[lang].ok); form.reset(); }
          else throw new Error("not activated");
        })
        .catch(function () {
          mailtoFallback(d, lead.tag);
          say(window.UI[lang].okMail + EMAIL);
        })
        .then(function () {
          sendBtn.disabled = false;
          sendBtn.textContent = window.UI[lang].send;
        });
    });
  }

  /* ─────────────────────────────────────────────────────────
     11 · COUNTERS
     ───────────────────────────────────────────────────────── */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var pre = el.dataset.pre || "", suf = el.dataset.suf || "";
    if (reduce || !isFinite(target)) return;
    var final = pre + target + suf, dur = 1100, t0 = null, done = false;
    function land() { if (done) return; done = true; el.textContent = final; }
    function step(t) {
      if (done) return;
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      el.textContent = pre + Math.round(target * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(step); else land();
    }
    /* A throttled tab can stop delivering frames mid-count and strand the
       figure at 0; the timer guarantees the real number always lands. */
    setTimeout(land, dur + 150);
    requestAnimationFrame(step);
  }

  /* ─────────────────────────────────────────────────────────
     12 · REVEALS + YEAR
     ───────────────────────────────────────────────────────── */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  if ("IntersectionObserver" in window) {
    var revealed = document.querySelectorAll(".sec__head, .isnot__col, .steps li, .about__photo, .about__txt, .req, .direct");
    revealed.forEach(function (el, i) {
      el.classList.add("rv");
      el.style.transitionDelay = (i % 3) * 70 + "ms";
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    revealed.forEach(function (el) { obs.observe(el); });

    var numObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); numObs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { numObs.observe(el); });
  }

  /* ─── go ─── */
  renderQuotes();
  setLang(guess);
})();
