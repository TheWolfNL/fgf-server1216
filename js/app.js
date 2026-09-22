(function () {
  "use strict";

  const state = {
    activeDayId: null,
  };

  function fmtPoints(n) {
    return "+" + n.toLocaleString("en-US");
  }

  function renderAlertBanner() {
    const el = document.getElementById("alert-banner");
    if (!el) return;
    const alert = EVENT_DATA.alertBanner;
    if (!alert) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.innerHTML =
      (alert.image ? '<img class="alert-banner-image" src="' + alert.image + '" alt="">' : "") +
      '<div class="alert-banner-body">' +
      '<p class="alert-banner-title">' + alert.title + '</p>' +
      '<p class="alert-banner-message">' + alert.message + '</p>' +
      '</div>';
  }

  function getVisitorTimeZone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "your local time";
    } catch (e) {
      return "your local time";
    }
  }

  function nextResetDate() {
    const now = new Date();
    const reset = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        EVENT_DATA.resetHourUTC,
        EVENT_DATA.resetMinuteUTC,
        0
      )
    );
    if (reset.getTime() <= now.getTime()) {
      reset.setUTCDate(reset.getUTCDate() + 1);
    }
    return reset;
  }

  function renderTimezoneBanner() {
    const tz = getVisitorTimeZone();
    const reset = nextResetDate();
    const localResetLabel = reset.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    const tzEl = document.getElementById("tz-info");
    tzEl.innerHTML =
      'Daily scoring resets at <strong>00:00 UTC</strong> — that’s <strong>' +
      localResetLabel +
      "</strong> in your detected timezone (<strong>" +
      tz +
      "</strong>).";

    function tick() {
      const now = new Date();
      const target = nextResetDate();
      let diff = Math.max(0, target.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      diff -= h * 3600000;
      const m = Math.floor(diff / 60000);
      diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      const pad = (v) => String(v).padStart(2, "0");
      const countdownEl = document.getElementById("reset-countdown");
      if (countdownEl) {
        countdownEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  function renderDayNav() {
    const nav = document.getElementById("day-nav");
    nav.innerHTML = "";
    EVENT_DATA.days.forEach((day) => {
      const btn = document.createElement("button");
      btn.className = "day-tab";
      btn.type = "button";
      btn.textContent = day.label;
      btn.disabled = !day.available;
      btn.setAttribute("aria-pressed", String(day.id === state.activeDayId));
      if (day.id === state.activeDayId) btn.classList.add("active");
      if (!day.available) {
        btn.title = "No scoring data yet for this day";
        btn.classList.add("upcoming");
      }
      btn.addEventListener("click", () => {
        if (!day.available) return;
        state.activeDayId = day.id;
        renderDayNav();
        renderActiveDay();
      });
      nav.appendChild(btn);
    });
  }

  function fragmentGalleryMarkup(gallery) {
    const rowsHtml = [];
    let cursor = 0;
    gallery.rows.forEach((count) => {
      const rowItems = gallery.items.slice(cursor, cursor + count);
      cursor += count;
      const tiles = rowItems
        .map(
          (it) =>
            '<div class="fragment-tile fragment-tile--' +
            gallery.rarity +
            '"><img src="' +
            it.image +
            '" alt="' +
            (it.alt || "") +
            '" loading="lazy"></div>'
        )
        .join("");
      rowsHtml.push('<div class="fragment-row">' + tiles + "</div>");
    });
    return (
      '<div class="fragment-gallery fragment-gallery--' +
      gallery.rarity +
      '">' +
      rowsHtml.join("") +
      "</div>"
    );
  }

  function itemImageMarkup(item) {
    let markup = "";
    if (item.fragmentGallery) {
      markup += fragmentGalleryMarkup(item.fragmentGallery);
    } else if (item.imageRow) {
      const tiles = item.imageRow
        .map(
          (it) =>
            '<div class="image-row-tile"><img src="' +
            it.image +
            '" alt="' +
            (it.alt || "") +
            '" loading="lazy"></div>'
        )
        .join("");
      markup += '<div class="image-row">' + tiles + "</div>";
      if (item.imageCaption) {
        markup += '<p class="item-image-caption">' + item.imageCaption + "</p>";
      }
    } else if (item.image) {
      markup += '<img class="item-image" src="' + item.image + '" alt="" loading="lazy">';
      if (item.imageCaption) {
        markup += '<p class="item-image-caption">' + item.imageCaption + "</p>";
      }
    } else {
      markup += '<div class="item-image item-image--placeholder" aria-hidden="true"></div>';
    }
    return '<div class="item-media">' + markup + "</div>";
  }

  function notesMarkup(item) {
    if (!item.notes) return "";
    const block = (label, list) => {
      if (!list || !list.length) return "";
      return (
        '<div class="item-notes-group">' +
        '<h4>' + label + '</h4>' +
        '<ul>' +
        list.map((line) => "<li>" + line + "</li>").join("") +
        '</ul>' +
        '</div>'
      );
    };
    const inner = block("Where to find", item.notes.findWhere) + block("Where to use", item.notes.useWhere);
    if (!inner) return "";
    return '<div class="item-notes">' + inner + '</div>';
  }

  function renderActiveDay() {
    const container = document.getElementById("day-content");
    const day = EVENT_DATA.days.find((d) => d.id === state.activeDayId);
    container.innerHTML = "";

    if (!day || !day.available) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Scoring details for this day haven't been added yet — check back after the next reset.";
      container.appendChild(empty);
      return;
    }

    const phaseTag = document.createElement("p");
    phaseTag.className = "phase-tag";
    phaseTag.textContent = day.phase;
    container.appendChild(phaseTag);

    day.sections.forEach((section) => {
      const sectionEl = document.createElement("section");
      sectionEl.className = "score-section";

      const h2 = document.createElement("h2");
      h2.textContent = section.title;
      sectionEl.appendChild(h2);

      const grid = document.createElement("div");
      grid.className = "item-grid";

      section.items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "item-card";
        card.innerHTML =
          itemImageMarkup(item) +
          '<div class="item-body">' +
          '<div class="item-header">' +
          '<h3>' + item.title + '</h3>' +
          '<span class="item-points">' + fmtPoints(item.points) + '</span>' +
          '</div>' +
          '<p class="item-description">' + item.description + '</p>' +
          notesMarkup(item) +
          '</div>';
        grid.appendChild(card);
      });

      sectionEl.appendChild(grid);
      container.appendChild(sectionEl);
    });
  }

  function init() {
    renderAlertBanner();
    renderTimezoneBanner();
    const current = EVENT_DATA.days.find((d) => d.id === EVENT_DATA.currentDayId && d.available);
    const firstAvailable = EVENT_DATA.days.find((d) => d.available);
    const fallback = firstAvailable || EVENT_DATA.days[0];
    state.activeDayId = (current || fallback).id;
    renderDayNav();
    renderActiveDay();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
