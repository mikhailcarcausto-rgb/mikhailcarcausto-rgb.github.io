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
     2 · LANGUAGE
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

  /* Remembered choice wins; otherwise follow the browser, defaulting to ES. */
  var stored = null;
  try { stored = localStorage.getItem("mc_lang"); } catch (e) {}
  var guess = stored || ((navigator.language || "es").toLowerCase().indexOf("es") === 0 ? "es" : "en");

  /* ─────────────────────────────────────────────────────────
     3 · DIRECT CONTACT CHANNELS
     Each entry renders only when its config value is present.
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
    var html = "";

    html +=
      "<li><a href='mailto:" + EMAIL + "'>" + svg(ICON.mail) +
      "<span>" + t.chEmail + "<small>" + EMAIL + "</small></span></a></li>" +
      "<li><button type='button' id='copymail'>" + svg(ICON.mail) +
      "<span>" + t.copy + "<small>" + EMAIL + "</small></span></button></li>";

    if (CONTACT.whatsapp) {
      html +=
        "<li><a href='https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(t.waMsg) +
        "' target='_blank' rel='noopener'>" + svg(ICON.wa) +
        "<span>" + t.chWa + "<small>" + t.chWaSub + "</small></span></a></li>";
    }
    if (CONTACT.linkedin) {
      html +=
        "<li><a href='" + CONTACT.linkedin + "' target='_blank' rel='noopener'>" + svg(ICON.in) +
        "<span>" + t.chIn + "<small>" + t.chInSub + "</small></span></a></li>";
    }
    if (CONTACT.phone) {
      html +=
        "<li><a href='tel:" + CONTACT.phone.replace(/[^\d+]/g, "") + "'>" + svg(ICON.tel) +
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
     4 · LEAD CLASSIFICATION
     Decides how an incoming enquiry is labelled in the email
     that reaches the inbox. See the note in the README —
     this is the piece that encodes Mikhail's own triage rules.
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
     5 · CONTACT FORM
     Primary path posts to FormSubmit (no backend to host).
     If that is unreachable or not yet activated, it falls back
     to opening a pre-filled email — so the form always works.
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
    var body =
      d.name + " — " + (d.company || "—") + "\n" +
      d.email + "\n\n" + d.message + "\n\n—\n" + d.ref;
    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(tag + " " + d.name + (d.company ? " · " + d.company : "")) +
      "&body=" + encodeURIComponent(body);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = window.UI[lang];

      /* Honeypot: a real visitor never sees this field. */
      if (form._honey.value) { say(t.ok); form.reset(); return; }

      var d = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        party: form.party.value,
        urgency: form.urgency.value,
        message: form.message.value.trim(),
        ref: document.getElementById("reqref").textContent
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
          Mensaje: d.message,
          Ref: d.ref
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (r && String(r.success) === "true") {
            say(window.UI[lang].ok);
            form.reset();
          } else {
            throw new Error("not activated");
          }
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
     6 · DOCUMENT REFERENCE + YEAR
     ───────────────────────────────────────────────────────── */
  var now = new Date();
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var ref =
    "REF " + String(now.getFullYear()).slice(2) + pad(now.getMonth() + 1) + pad(now.getDate()) +
    "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
  var refEl = document.getElementById("reqref");
  if (refEl) refEl.textContent = ref;
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = now.getFullYear();

  /* ─────────────────────────────────────────────────────────
     7 · SCROLL: depth rail + reveals
     ───────────────────────────────────────────────────────── */
  var sections = ["audiencias", "servicios", "casos", "metodo", "sobre", "contacto"];
  var marks = {};
  document.querySelectorAll(".rail__marks li").forEach(function (li) {
    marks[li.dataset.target] = li;
  });

  if ("IntersectionObserver" in window) {
    var railObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        sections.forEach(function (id) {
          if (marks[id]) marks[id].classList.toggle("is-on", id === en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) railObs.observe(el);
    });

    var revealed = document.querySelectorAll(
      ".sec__head, .side, .stratum, .case, .steps li, .about__txt, .about__stack, .req, .direct"
    );
    revealed.forEach(function (el, i) {
      el.classList.add("rv");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
    });

    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); revObs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealed.forEach(function (el) { revObs.observe(el); });
  }

  /* ─────────────────────────────────────────────────────────
     8 · NAV OVERFLOW
     On narrow phones the nav row can outgrow the screen. Mark
     it so the edge fades — a clipped word reads as a bug, a
     faded edge reads as "there's more, swipe".
     ───────────────────────────────────────────────────────── */
  var nav = document.querySelector(".hdr__nav");
  function checkNav() {
    if (nav) nav.classList.toggle("is-scrollable", nav.scrollWidth > nav.clientWidth + 1);
  }
  window.addEventListener("resize", checkNav);

  /* ─── go ─── */
  setLang(guess);
  checkNav();
})();
