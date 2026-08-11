/* ═══════════════════════════════════════════════════════════
   site.js — behaviour for the whole page.
   No dependencies, no build step, no trackers.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ─────────────────────────────────────────────────────────
     1 · CONTACT CONFIG  ← the only block you normally edit
     Leave a value as "" and its button disappears from the
     site automatically, so nothing ever renders broken.
     ───────────────────────────────────────────────────────── */
  var CONTACT = {
    // Split so naive address-harvesting bots don't get a clean match.
    emailUser: "mikhail.carcausto",
    emailHost: "gmail.com",

    // Digits only, country code first. Peru = 51.
    whatsapp: "51924298403",

    // Full profile URL.
    linkedin: "https://www.linkedin.com/in/mikhail-carcausto",

    // Display + dial format. Same line as WhatsApp — set to "" to drop the
    // click-to-call row and leave only WhatsApp.
    phone: "+51 924 298 403"
  };

  var EMAIL = CONTACT.emailUser + "@" + CONTACT.emailHost;

  /* ─────────────────────────────────────────────────────────
     2 · TESTIMONIALS
     REAL ones go in TESTIMONIALS. While it's empty the whole
     section stays hidden — an empty "what they say" heading is
     worse than none at all.

     DEMO exists only to preview the layout. Publishing invented
     testimonials on a commercial site is deceptive advertising,
     so PREVIEW_DEMO must stay false in anything that ships.
     Flip it locally, look, flip it back.
     ───────────────────────────────────────────────────────── */
  var PREVIEW_DEMO = false;

  var TESTIMONIALS = [
    // { quote: "…", name: "…", role: "Gerente de Contratos", org: "Minera …" }
  ];

  var DEMO = [
    { quote: "Redujo a minutos un trámite que nos tomaba media jornada. Lo que más valoro es que el equipo quedó operándolo solo.",
      name: "Nombre Apellido", role: "Gerente de Contratos", org: "Compañía minera (ejemplo)" },
    { quote: "Entendió nuestro proceso en dos semanas y nos dijo qué no valía la pena automatizar. Eso nos ahorró más que el propio proyecto.",
      name: "Nombre Apellido", role: "Superintendente de Abastecimiento", org: "Operación de cobre (ejemplo)" },
    { quote: "Nos ordenó la propuesta técnica y ganamos la licitación siguiente. Sabe exactamente cómo la lee el comité.",
      name: "Nombre Apellido", role: "Gerente Comercial", org: "Contratista de servicios (ejemplo)" }
  ];

  /* ─────────────────────────────────────────────────────────
     3 · LANGUAGE
     ───────────────────────────────────────────────────────── */
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var ES = new Map();
  nodes.forEach(function (n) { ES.set(n, n.textContent); });

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

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });

    renderChannels();
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
     4 · DIRECT CONTACT CHANNELS
     ───────────────────────────────────────────────────────── */
  var ICON = {
    mail: '<path d="M2 5h16v11H2z"/><path d="m2 6 8 6 8-6"/>',
    wa:   '<path d="M3 17.5 4.2 14A7.2 7.2 0 1 1 7 16.8L3 17.5Z"/><path d="M7.4 7.8c.2 1.6 2.9 4.3 4.5 4.5.5.1 1.2-.6 1.4-1l-1.6-.9-.7.7c-.8-.4-1.6-1.2-2-2l.7-.7-.9-1.6c-.4.2-1.1.9-1 1.4"/>',
    in:   '<path d="M4.2 7.5v8.3M4.2 4.4v.1M8.6 15.8V7.5M8.6 11c0-2 1.3-3 2.8-3s2.8.9 2.8 3.2v4.6"/>',
    tel:  '<path d="M6.6 3.5 8.4 7 6.8 8.6c.9 1.9 2.7 3.7 4.6 4.6L13 11.6l3.5 1.8v2.8c0 .7-.6 1.3-1.3 1.2C8.3 16.9 3.1 11.7 2.4 4.8c-.1-.7.5-1.3 1.2-1.3h3Z"/>'
  };
  function svg(d) {
    return '<svg viewBox="0 0 20 20" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
  }

  function renderChannels() {
    var list = document.getElementById("channels");
    if (!list) return;
    var t = window.UI[lang];
    var html =
      "<li><a href='mailto:" + EMAIL + "'>" + svg(ICON.mail) +
      "<span>" + t.chEmail + "<small>" + EMAIL + "</small></span></a></li>" +
      "<li><button type='button' id='copymail'>" + svg(ICON.mail) +
      "<span>" + t.copy + "<small>" + EMAIL + "</small></span></button></li>";

    if (CONTACT.whatsapp) {
      html += "<li><a href='https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(t.waMsg) +
        "' target='_blank' rel='noopener'>" + svg(ICON.wa) +
        "<span>" + t.chWa + "<small>" + t.chWaSub + "</small></span></a></li>";
    }
    if (CONTACT.linkedin) {
      html += "<li><a href='" + CONTACT.linkedin + "' target='_blank' rel='noopener'>" + svg(ICON.in) +
        "<span>" + t.chIn + "<small>" + t.chInSub + "</small></span></a></li>";
    }
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
     5 · RENDER TESTIMONIALS (only when there are any)
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
      var fig = document.createElement("figure");
      fig.className = "quote" + (demo ? " quote--demo" : "");
      var p = document.createElement("p");
      p.textContent = t.quote;
      var ft = document.createElement("footer");
      var b = document.createElement("b");
      b.textContent = t.name;
      var s = document.createElement("span");
      s.textContent = t.role + (t.org ? " · " + t.org : "");
      ft.appendChild(b); ft.appendChild(s);
      fig.appendChild(p); fig.appendChild(ft);
      box.appendChild(fig);
    });
    sec.hidden = false;
  }

  /* ─────────────────────────────────────────────────────────
     6 · SECTION NUMBERING
     Numbered in the DOM order that is actually visible, so a
     hidden section never leaves a gap like 03 → 05.
     ───────────────────────────────────────────────────────── */
  function renumber() {
    var i = 0;
    document.querySelectorAll("section[id] .sec__n").forEach(function (el) {
      var sec = el.closest("section");
      if (sec && sec.hidden) return;
      i += 1;
      el.textContent = (i < 10 ? "0" : "") + i;
    });
  }

  /* ─────────────────────────────────────────────────────────
     7 · LEAD CLASSIFICATION
     Decides how an incoming enquiry is labelled in the email
     that reaches the inbox.
     ───────────────────────────────────────────────────────── */
  function classifyLead(data) {
    var party = data.party;      // "mining" | "supplier" | "other"
    var urgency = data.urgency;  // "exploring" | "quarter" | "urgent"

    var priority = "C";
    if (urgency === "urgent") priority = "A";
    else if (urgency === "quarter") priority = party === "mining" ? "A" : "B";
    else if (party === "mining") priority = "B";

    var side = party === "mining" ? "MINERA" : party === "supplier" ? "PROVEEDOR" : "OTRO";
    return { priority: priority, tag: "[" + priority + "·" + side + "]" };
  }

  /* ─────────────────────────────────────────────────────────
     8 · CONTACT FORM
     Posts to FormSubmit (no backend to host). If that is
     unreachable or not yet activated it falls back to opening a
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
    var body = d.name + " — " + (d.company || "—") + "\n" + d.email + "\n\n" + d.message;
    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(tag + " " + d.name + (d.company ? " · " + d.company : "")) +
      "&body=" + encodeURIComponent(body);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = window.UI[lang];

      if (form._honey.value) { say(t.ok); form.reset(); return; }

      var d = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        party: form.party.value,
        urgency: form.urgency.value,
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

      var lead = classifyLead(d);
      sendBtn.disabled = true;
      sendBtn.textContent = t.sending;
      say(t.sending);

      fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: lead.tag + " " + d.name + (d.company ? " · " + d.company : ""),
          _template: "table",
          Prioridad: lead.priority,
          Nombre: d.name,
          Empresa: d.company || "—",
          Correo: d.email,
          Lado: d.party,
          Urgencia: d.urgency,
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
     9 · SERVICE FILTER
     Two audiences share one grid, so let each visitor narrow it
     to their own side. Items tagged "both" always stay visible.
     ───────────────────────────────────────────────────────── */
  var filterBtns = document.querySelectorAll(".filters button");
  var cards = document.querySelectorAll(".card");

  function applyFilter(want) {
    filterBtns.forEach(function (b) { b.classList.toggle("is-on", b.dataset.filter === want); });
    cards.forEach(function (c) {
      var f = c.dataset.for;
      c.hidden = !(want === "all" || f === want || f === "both");
    });
  }
  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () { applyFilter(b.dataset.filter); });
  });

  /* The two audience cards deep-link into their own slice of the list. */
  document.querySelectorAll("[data-filter-go]").forEach(function (a) {
    a.addEventListener("click", function () { applyFilter(a.dataset.filterGo); });
  });

  /* ─────────────────────────────────────────────────────────
     10 · NAV OVERFLOW
     A clipped word reads as a bug; a faded edge reads as "swipe".
     ───────────────────────────────────────────────────────── */
  var nav = document.querySelector(".hdr__nav");
  function checkNav() {
    if (nav) nav.classList.toggle("is-scrollable", nav.scrollWidth > nav.clientWidth + 1);
  }
  window.addEventListener("resize", checkNav);

  /* ─────────────────────────────────────────────────────────
     11 · SCROLL REVEALS + YEAR
     ───────────────────────────────────────────────────────── */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  if ("IntersectionObserver" in window) {
    var revealed = document.querySelectorAll(
      ".sec__head, .side, .card, .case, .quote, .flow li, .bio__card, .bio__txt, .req, .direct, .wall"
    );
    revealed.forEach(function (el, i) {
      el.classList.add("rv");
      el.style.transitionDelay = (i % 4) * 60 + "ms";
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealed.forEach(function (el) { obs.observe(el); });
  }

  /* ─── go ─── */
  renderQuotes();
  renumber();
  setLang(guess);
  checkNav();
})();
