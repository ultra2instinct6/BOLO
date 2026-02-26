  (function logBoloAppVersionOnce() {
    try {
      if (window.__BOLO_APP_VERSION_LOGGED) return;
      window.__BOLO_APP_VERSION_LOGGED = true;
      console.info("[BOLO] APP_VERSION:", window.APP_VERSION || "(missing)");
    } catch (e0) {}
  })();

// =====================================
// Global Error Handler (Production Safety)
// =====================================

window._APP_ERRORS = [];

// Catch uncaught JavaScript errors
window.onerror = function(message, source, lineno, colno, error) {
  var errorMsg = message + " (" + source + ":" + lineno + ":" + colno + ")";
  window._APP_ERRORS.push(errorMsg);
  
  // Dev mode: log to console
  if (localStorage.getItem("BOLO_DEV")) {
    console.error("🔴 Uncaught Error:", errorMsg);
    if (error && error.stack) console.error("Stack:", error.stack);
  }
  
  // Don't suppress; let browser default handler run too
  return false;
};

// Catch unhandled promise rejections
window.onunhandledrejection = function(event) {
  var errorMsg = event.reason || "Unknown promise rejection";
  window._APP_ERRORS.push("Promise rejection: " + errorMsg);
  
  // Dev mode: log to console
  if (localStorage.getItem("BOLO_DEV")) {
    console.error("🔴 Unhandled Promise Rejection:", errorMsg);
  }
};

// =====================================
// App Initialization
// =====================================

function mergeReadingVocabIntoReadings() {
  if (typeof READINGS === "undefined" || !Array.isArray(READINGS)) return;

  var hasVocab = (typeof READING_VOCAB !== "undefined") && READING_VOCAB && (typeof READING_VOCAB === "object");

  for (var i = 0; i < READINGS.length; i++) {
    var rd = READINGS[i];
    if (!rd || typeof rd !== "object") continue;

    var v = hasVocab ? READING_VOCAB[rd.id] : null;
    if (!v || typeof v !== "object") v = {};

    rd.vocabWords = Array.isArray(v.vocabWords) ? v.vocabWords : [];
    rd.vocabPhrases = Array.isArray(v.vocabPhrases) ? v.vocabPhrases : [];

    if (v.vocabForms && typeof v.vocabForms === "object") {
      rd.vocabForms = v.vocabForms;
    } else {
      rd.vocabForms = {};
    }
  }
}

function _startupChecks() {
  var checks = {
    "State": typeof State !== "undefined",
    "UI": typeof UI !== "undefined",
    "Lessons": typeof Lessons !== "undefined",
    "Games": typeof Games !== "undefined",
    "Reading": typeof Reading !== "undefined",
    "TRACKS": typeof TRACKS !== "undefined",
    "LESSONS": typeof LESSONS !== "undefined",
    "READINGS": typeof READINGS !== "undefined",
    "GAMES_DATA": typeof GAMES_DATA !== "undefined"
  };
  
  var missing = [];
  for (var key in checks) {
    if (checks.hasOwnProperty(key) && !checks[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    var msg = "BOLO startup failed: Missing modules [" + missing.join(", ") + "]";
    console.error("❌ " + msg);
    if (typeof UI !== "undefined" && UI && typeof UI.showAlertDialog === "function") {
      UI.showAlertDialog(msg + "\n\nPlease reload the page. If this persists, check console for details.", {
        title: "Startup failed",
        confirmText: "OK"
      });
    } else {
      alert(msg + "\n\nPlease reload the page. If this persists, check console for details.");
    }
    return false;
  }
  
  return true;
}

function validateReadingVocabDetail() {
  try {
    if (typeof READINGS === "undefined" || !Array.isArray(READINGS)) return;
    if (typeof READING_VOCAB_DETAIL === "undefined" || !READING_VOCAB_DETAIL || typeof READING_VOCAB_DETAIL !== "object") {
      return;
    }

    var readingIds = {};
    for (var i = 0; i < READINGS.length; i++) {
      if (READINGS[i] && READINGS[i].id) readingIds[READINGS[i].id] = true;
    }

    var detailIds = Object.keys(READING_VOCAB_DETAIL);
    var covered = [];
    var missing = [];
    for (var id in readingIds) {
      if (!readingIds.hasOwnProperty(id)) continue;
      if (READING_VOCAB_DETAIL[id]) covered.push(id);
      else missing.push(id);
    }

    var extras = [];
    for (var j = 0; j < detailIds.length; j++) {
      var did = detailIds[j];
      if (!readingIds[did]) extras.push(did);
    }

    // Coverage report
    if (missing.length) console.warn("⚠️ Missing READING_VOCAB_DETAIL entries for:", missing.join(", "));
    if (extras.length) console.warn("⚠️ READING_VOCAB_DETAIL has ids not in READINGS:", extras.join(", "));

    // Schema warnings
    function warn(readingId, msg) {
      console.warn("⚠️ Vocab detail [" + readingId + "]: " + msg);
    }

    for (var k = 0; k < detailIds.length; k++) {
      var rid = detailIds[k];
      var entry = READING_VOCAB_DETAIL[rid];
      if (!entry || typeof entry !== "object") {
        warn(rid, "entry is not an object");
        continue;
      }
      if (entry.phrases && !Array.isArray(entry.phrases)) warn(rid, "phrases should be an array");
      if (entry.words && !Array.isArray(entry.words)) warn(rid, "words should be an array");

      if (Array.isArray(entry.phrases)) {
        for (var p = 0; p < entry.phrases.length; p++) {
          var ph = entry.phrases[p];
          if (!ph || typeof ph.term !== "string" || !ph.term.trim()) {
            warn(rid, "phrases[" + p + "] missing term");
          }
        }
      }

      if (Array.isArray(entry.words)) {
        for (var w = 0; w < entry.words.length; w++) {
          var wd = entry.words[w];
          if (!wd || typeof wd.term !== "string" || !wd.term.trim()) {
            warn(rid, "words[" + w + "] missing term");
            continue;
          }
          if (wd.forms != null && !Array.isArray(wd.forms)) {
            warn(rid, "words[" + w + "].forms should be an array (or omitted)");
          }
        }
      }
    }
  } catch (e) {
    console.warn("⚠️ Reading vocab validation encountered an error:", e);
  }
}

function initHomeSwipeDeck() {
  var homeRoot = document.querySelector("#screen-home .home");
  if (!homeRoot) return;

  var deck = document.getElementById("homeSwipeDeck");
  if (!deck) {
    var injected = document.createElement("div");
    injected.id = "homeSwipeDeck";
    injected.setAttribute("aria-label", "Quick actions");
    injected.innerHTML = [
      '<div id="deckViewport">',
      '  <div id="deckTrack">',
      '    <article class="deck-card module-card deck-card--learn is-active" data-screen="screen-learn" data-action-en="Start Learn" data-action-pa="ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ">',
      '      <div class="deck-card-kicker">MODULE</div>',
      '      <div class="deck-card-title">Learn | ਸਿੱਖੋ</div>',
      '      <div class="deck-card-subtitle" lang="pa">ਸਿੱਖੋ</div>',
      '    </article>',
      '    <article class="deck-card module-card deck-card--reading" data-screen="screen-reading" data-action-en="Start Read" data-action-pa="ਪੜ੍ਹਨਾ ਸ਼ੁਰੂ ਕਰੋ">',
      '      <div class="deck-card-kicker">MODULE</div>',
      '      <div class="deck-card-title">Read | ਪੜ੍ਹਨਾ</div>',
      '      <div class="deck-card-subtitle" lang="pa">ਪੜ੍ਹਨਾ</div>',
      '    </article>',
      '    <article class="deck-card module-card deck-card--type is-coming-soon" data-screen="screen-typing-center" data-action-en="In the making" data-action-pa="ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ" data-status="comingSoon" aria-disabled="true">',
      '      <div class="deck-card-kicker">COMING SOON</div>',
      '      <div class="deck-card-title">Type | ਲਿਖੋ</div>',
      '      <div class="deck-card-status" lang="pa">ਬਣ ਰਹੀ ਹੈ</div>',
      '      <div class="deck-card-subtitle">This module is in the making</div>',
      '      <div class="deck-card-subtitle" lang="pa">ਇਹ ਮਾਡਿਊਲ ਬਣ ਰਿਹਾ ਹੈ</div>',
      '      <div class="deck-card-helper" lang="pa">ਹੁਣ ਲਈ ਸਿੱਖੋ + ਪੜ੍ਹੋ ਵਰਤੋ</div>',
      '    </article>',
      '    <article class="deck-card module-card deck-card--play is-coming-soon" data-screen="screen-play-home" data-action-en="In the making" data-action-pa="ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ" data-status="comingSoon" aria-disabled="true">',
      '      <div class="deck-card-kicker">COMING SOON</div>',
      '      <div class="deck-card-title">Play | ਖੇਡੋ</div>',
      '      <div class="deck-card-status" lang="pa">ਬਣ ਰਹੀ ਹੈ</div>',
      '      <div class="deck-card-subtitle">This module is in the making</div>',
      '      <div class="deck-card-subtitle" lang="pa">ਇਹ ਮਾਡਿਊਲ ਬਣ ਰਿਹਾ ਹੈ</div>',
      '      <div class="deck-card-helper" lang="pa">ਹੁਣ ਲਈ ਸਿੱਖੋ + ਪੜ੍ਹੋ ਵਰਤੋ</div>',
      '    </article>',
      '  </div>',
      '</div>',
      '<div class="deck-nav-row" aria-label="Module navigation">',
      '  <button class="btn deck-prev-handle" id="btn-home-prev-deck" type="button" aria-label="Previous module">←</button>',
      '  <div class="deck-nav-center">',
      '    <div id="deckDots" aria-label="Deck position"></div>',
      '    <div id="deckProgressText" class="deck-progress-text" aria-live="polite">1/4</div>',
      '  </div>',
      '  <button class="btn deck-next-handle" id="btn-home-next-deck" type="button" aria-label="Next module" data-autofocus>→</button>',
      '</div>',
      '<button class="btn cta-primary" id="btn-home-deck-start" type="button" aria-label="Start selected module">',
      '  <span class="btn-label-en">Start Learn</span>',
      '  <span class="btn-label-pa" lang="pa">ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ</span>',
      '</button>',
      '<div id="swipeHint" aria-live="polite">Swipe to switch module cards, then tap Start.</div>'
    ].join("\n");

    homeRoot.insertBefore(injected, homeRoot.firstChild || null);

    deck = injected;
  }

  var viewport = document.getElementById("deckViewport");
  var track = document.getElementById("deckTrack");
  var cards = track ? Array.prototype.slice.call(track.querySelectorAll(".deck-card")) : [];
  var dots = document.getElementById("deckDots");
  var prevBtn = document.getElementById("btn-home-prev-deck");
  var nextBtn = document.getElementById("btn-home-next-deck");
  var startBtn = document.getElementById("btn-home-deck-start");
  var progressText = document.getElementById("deckProgressText");
  var progressHost = document.querySelector("#screen-home .home-hero-progress");
  var hint = document.getElementById("swipeHint");
  if (!viewport || !track || !cards.length || !startBtn) return;

  if (document.body && document.body.classList) {
    document.body.classList.add("home-tiles-hidden");
  }

  var activeIndex = 0;
  var peekDirection = 1;
  var suppressCardClickUntil = 0;
  var reduceMotion = false;
  try {
    reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (e) {
    reduceMotion = false;
  }

  if (reduceMotion) {
    try { track.style.transition = "none"; } catch (e2) {}
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wrappedDelta(index, current, total) {
    var delta = index - current;
    if (total <= 2) return delta;
    var half = total / 2;
    if (delta > half) delta -= total;
    else if (delta < -half) delta += total;
    return delta;
  }

  function setPeekDirectionFromDelta(deltaX) {
    if (!(typeof deltaX === "number" && isFinite(deltaX)) || deltaX === 0) return;
    peekDirection = deltaX < 0 ? 1 : -1;
  }

  var wheelLookRaf = 0;
  var wheelLookPending = 0;
  var wheelLookLastApplied = null;

  function resetWheelLookCard(card) {
    if (!card) return;
    card.style.transform = "";
    card.style.opacity = "";
    card.style.filter = "";
    card.style.zIndex = "";
  }

  function isDisabledDeckCard(card) {
    if (!card) return false;
    return card.getAttribute("aria-disabled") === "true"
      || card.getAttribute("data-status") === "comingSoon"
      || card.classList.contains("is-coming-soon");
  }

  function applyWheelLookNow(progress) {
    if (reduceMotion) {
      deck.classList.toggle("is-swipe-moving", false);
      for (var r = 0; r < cards.length; r++) {
        resetWheelLookCard(cards[r]);
      }
      return;
    }

    var p = (typeof progress === "number" && isFinite(progress)) ? clamp(progress, -1.0, 1.0) : 0;
    wheelLookLastApplied = p;
    deck.classList.toggle("is-swipe-moving", Math.abs(p) > 0.015);

    for (var i = 0; i < cards.length; i++) {
      var baseDelta = wrappedDelta(i, activeIndex, cards.length);
      var rel = baseDelta + p;
      var absRel = Math.abs(rel);
      var depthFactor = clamp(absRel, 0, 2.2);
      var isActiveCard = i === activeIndex;
      var isPeekCard = !isActiveCard && baseDelta === peekDirection;
      var isNearbyCard = isActiveCard || Math.abs(baseDelta) <= 1 || isPeekCard;
      if (!isNearbyCard) {
        resetWheelLookCard(cards[i]);
        continue;
      }
      var slideX = 0;
      var scale = 1;
      var liftY = 0;
      var rotateY = 0;
      var opacity = 1;
      var saturate = 1;
      var brightness = 1;
      var z = 620;

      if (isActiveCard) {
        slideX = clamp(rel, -1.0, 1.0) * -18;
        scale = 1 - (Math.min(depthFactor, 1.0) * 0.014);
        liftY = Math.round(Math.min(depthFactor, 1.0) * 1);
        rotateY = clamp(rel * -2.8, -4, 4);
        opacity = 1;
        saturate = 1;
        brightness = 1;
        z = 700;
      } else if (isPeekCard) {
        slideX = clamp(rel, -1.5, 1.5) * -34;
        scale = 0.97 - (Math.min(depthFactor, 1.6) * 0.018);
        liftY = 4 + Math.round(Math.min(depthFactor, 1.5) * 2);
        rotateY = clamp(rel * -3.2, -5, 5);
        opacity = 0.74 - (Math.min(depthFactor, 1.7) * 0.08);
        saturate = 0.9 - (Math.min(depthFactor, 1.6) * 0.05);
        brightness = 0.98;
        z = 420 - Math.round(depthFactor * 22);
      } else {
        slideX = clamp(rel, -2.0, 2.0) * -12;
        scale = 0.92 - (Math.min(depthFactor, 2.0) * 0.02);
        liftY = 7 + Math.round(Math.min(depthFactor, 1.8) * 3);
        rotateY = clamp(rel * -2.2, -4, 4);
        opacity = 0.32;
        saturate = 0.72;
        brightness = 0.94;
        z = 170;
      }

      if (isDisabledDeckCard(cards[i])) {
        opacity = Math.min(opacity, 0.52);
        saturate = Math.min(saturate, 0.68);
      }

      if (z < 90) z = 90;

      cards[i].style.transform = "translateX(" + slideX.toFixed(2) + "%) translateY(" + liftY + "px) scale(" + scale.toFixed(3) + ") rotateY(" + rotateY.toFixed(2) + "deg)";
      cards[i].style.opacity = opacity.toFixed(3);
      cards[i].style.filter = "saturate(" + saturate.toFixed(3) + ") brightness(" + brightness.toFixed(3) + ")";
      cards[i].style.zIndex = String(z);
    }
  }

  function applyWheelLook(progress, useRaf) {
    var nextProgress = (typeof progress === "number" && isFinite(progress)) ? clamp(progress, -1.0, 1.0) : 0;

    if (!useRaf || reduceMotion) {
      if (wheelLookRaf && typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(wheelLookRaf);
        wheelLookRaf = 0;
      }
      applyWheelLookNow(nextProgress);
      return;
    }

    if (wheelLookLastApplied !== null && Math.abs(nextProgress - wheelLookLastApplied) < 0.01) {
      return;
    }

    wheelLookPending = nextProgress;
    if (wheelLookRaf) return;

    if (typeof window.requestAnimationFrame !== "function") {
      applyWheelLookNow(nextProgress);
      return;
    }

    wheelLookRaf = window.requestAnimationFrame(function() {
      wheelLookRaf = 0;
      applyWheelLookNow(wheelLookPending);
    });
  }

  function render() {
    track.style.transform = "translateX(-" + (activeIndex * 100) + "%)";
    var isAtStart = activeIndex === 0;
    var isAtEnd = activeIndex === (cards.length - 1);
    try {
      deck.classList.toggle("is-at-start", isAtStart);
      deck.classList.toggle("is-at-end", isAtEnd);
      if (progressHost) {
        progressHost.classList.toggle("is-at-start", isAtStart);
        progressHost.classList.toggle("is-at-end", isAtEnd);
      }
    } catch (eDeckState) {}
    if (prevBtn) prevBtn.classList.toggle("is-endpoint-fade", isAtStart);
    if (nextBtn) nextBtn.classList.toggle("is-endpoint-fade", isAtEnd);

    for (var i = 0; i < cards.length; i++) {
      var isActive = i === activeIndex;
      var delta = wrappedDelta(i, activeIndex, cards.length);
      cards[i].classList.toggle("is-active", isActive);
      cards[i].classList.toggle("is-stack-prev", delta === -1);
      cards[i].classList.toggle("is-stack-next", delta === 1);
      cards[i].classList.toggle("is-stack-far", Math.abs(delta) >= 2);
      cards[i].classList.toggle("is-stack-peek", !isActive && delta === peekDirection);
      cards[i].classList.toggle("is-stack-peek-next", !isActive && delta === peekDirection && delta === 1);
      cards[i].classList.toggle("is-stack-peek-prev", !isActive && delta === peekDirection && delta === -1);
      cards[i].classList.toggle("is-stack-muted", !isActive && delta !== peekDirection);
      cards[i].setAttribute("aria-hidden", isActive ? "false" : "true");
      cards[i].setAttribute("tabindex", isActive ? "0" : "-1");
      cards[i].setAttribute("role", "button");
      cards[i].setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    if (dots) {
      var dotNodes = dots.querySelectorAll(".deck-dot");
      for (var d = 0; d < dotNodes.length; d++) {
        var isDotActive = d === activeIndex;
        dotNodes[d].classList.toggle("is-active", isDotActive);
        dotNodes[d].setAttribute("aria-pressed", isDotActive ? "true" : "false");
        if (isDotActive) dotNodes[d].setAttribute("aria-current", "true");
        else dotNodes[d].removeAttribute("aria-current");
      }
    }

    var activeCard = cards[activeIndex];
    var labelEn = activeCard.getAttribute("data-action-en") || "Start";
    var labelPa = activeCard.getAttribute("data-action-pa") || "ਸ਼ੁਰੂ ਕਰੋ";
    var isDisabledCard = activeCard.getAttribute("aria-disabled") === "true"
      || activeCard.getAttribute("data-status") === "comingSoon"
      || activeCard.classList.contains("is-coming-soon");
    var enEl = startBtn.querySelector(".btn-label-en");
    var paEl = startBtn.querySelector(".btn-label-pa");
    var titleEl = activeCard.querySelector(".deck-card-title");
    var subtitleEl = activeCard.querySelector(".deck-card-subtitle");
    var moduleEn = titleEl ? String(titleEl.textContent || "").trim() : "";
    var modulePa = subtitleEl ? String(subtitleEl.textContent || "").trim() : "";
    var activeAccent = "";
    try {
      activeAccent = window.getComputedStyle(activeCard).getPropertyValue("--module-accent-rgb");
    } catch (e3) {
      activeAccent = "";
    }
    activeAccent = activeAccent ? String(activeAccent).trim() : "";
    if (!activeAccent) {
      if (activeCard.classList.contains("deck-card--learn")) activeAccent = "33, 125, 255";
      else if (activeCard.classList.contains("deck-card--reading")) activeAccent = "255, 91, 106";
      else if (activeCard.classList.contains("deck-card--play")) activeAccent = "255, 152, 52";
      else if (activeCard.classList.contains("deck-card--type")) activeAccent = "44, 188, 96";
      else activeAccent = "0, 80, 168";
    }
    try {
      deck.style.setProperty("--active-module-accent-rgb", activeAccent);
    } catch (e4) {
      // no-op
    }
    startBtn.disabled = !!isDisabledCard;
    startBtn.setAttribute("aria-disabled", isDisabledCard ? "true" : "false");
    if (enEl) enEl.textContent = labelEn;
    if (paEl) paEl.textContent = labelPa;
    if (progressText) {
      var now = activeIndex + 1;
      var total = cards.length;
      progressText.textContent = now + "/" + total;
    }

    applyWheelLook(0, false);
  }

  function markHintSeen() {
    if (!hint) return;
    hint.style.display = "none";
    try { localStorage.setItem("homeDeckHintSeen_v1", "1"); } catch (e) {}
  }

  function nudgeHomeIndicator(dir) {
    if (!dir) return;
    var host = progressHost || deck;
    if (!host) return;
    if (typeof nudgeCounterIndicator === "function") {
      nudgeCounterIndicator(host, dir);
      return;
    }
    var cls = dir > 0 ? "indicator-shift-next" : "indicator-shift-prev";
    try {
      host.classList.remove("indicator-shift-next", "indicator-shift-prev");
      void host.offsetWidth;
      host.classList.add(cls);
      window.setTimeout(function() {
        try { host.classList.remove(cls); } catch (eRemove) {}
      }, 220);
    } catch (eNudge) {}
  }

  function goTo(index, interacted, directionHint) {
    if (!cards.length) return;
    var next = index;
    while (next < 0) next += cards.length;
    next = next % cards.length;

    var direction = 0;
    if (typeof directionHint === "number" && directionHint !== 0) {
      direction = directionHint > 0 ? 1 : -1;
      peekDirection = direction;
    } else {
      var toward = wrappedDelta(next, activeIndex, cards.length);
      if (toward !== 0) {
        direction = toward > 0 ? 1 : -1;
        peekDirection = direction;
      }
    }

    activeIndex = next;
    nudgeHomeIndicator(direction);
    render();
    if (interacted) markHintSeen();
  }

  function goNext(interacted) {
    goTo(activeIndex + 1, interacted, 1);
  }

  function isDeckControlTarget(evt) {
    var target = evt && evt.target;
    if (!target || !target.closest) return false;
    return !!target.closest("#btn-home-prev-deck, #btn-home-next-deck, #btn-home-deck-start, .deck-dot");
  }

  if (dots) {
    dots.innerHTML = "";
    for (var i = 0; i < cards.length; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "deck-dot";
      dot.textContent = "";
      dot.setAttribute("aria-label", "Go to card " + (i + 1));
      (function(index) {
        UI.bindOnce(dot, "deckDotBound" + index, "click", function() {
          goTo(index, true);
        });
      })(i);
      dots.appendChild(dot);
    }
  }

  for (var c = 0; c < cards.length; c++) {
    (function(index) {
      var cardEl = cards[index];
      UI.bindOnce(cardEl, "deckCardBound" + index, "click", function() {
        if (Date.now() < suppressCardClickUntil) return;
        goTo(index, true);
      });
      UI.bindOnce(cardEl, "deckCardKeyBound" + index, "keydown", function(evt) {
        var key = evt && evt.key;
        if (key !== "Enter" && key !== " " && key !== "Spacebar") return;
        try { if (evt && evt.preventDefault) evt.preventDefault(); } catch (eDeckKey0) {}
        if (Date.now() < suppressCardClickUntil) return;

        var isCardActive = index === activeIndex;
        if (isCardActive && startBtn && typeof startBtn.click === "function") {
          startBtn.click();
          return;
        }

        goTo(index, true);
      });
    })(c);
  }

  if (nextBtn) {
    UI.bindOnce(nextBtn, "homeNextDeckBound", "click", function() {
      goNext(true);
    });
  }

  if (prevBtn) {
    UI.bindOnce(prevBtn, "homePrevDeckBound", "click", function() {
      goTo(activeIndex - 1, true, -1);
    });
  }

  UI.bindOnce(startBtn, "homeDeckStartBound", "click", function() {
    var activeCard = cards[activeIndex];
    if (!activeCard) return;
    var isDisabledCard = activeCard.getAttribute("aria-disabled") === "true"
      || activeCard.getAttribute("data-status") === "comingSoon"
      || activeCard.classList.contains("is-coming-soon");
    if (isDisabledCard) {
      var soonMsg = "This section is in the making. Try Learn or Read for now.";
      try {
        if (typeof uiText === "function") {
          soonMsg = uiText({
            en: "This section is in the making. Try Learn or Read for now.",
            pa: "ਇਹ ਭਾਗ ਬਣ ਰਿਹਾ ਹੈ। ਹੁਣ ਲਈ ਸਿੱਖੋ ਜਾਂ ਪੜ੍ਹੋ ਵਰਤੋ।"
          }, { autoPunjabi: true });
        }
      } catch (e0) {}
      try {
        if (window.UI && typeof UI.showToast === "function") UI.showToast(soonMsg, 2100);
      } catch (e1) {}
      return;
    }
    var screenId = activeCard.getAttribute("data-screen");
    if (screenId) UI.goTo(screenId);
  });

  UI.bindOnce(deck, "homeDeckKeyBound", "keydown", function(evt) {
    var key = evt && evt.key;
    if (key === "ArrowRight") {
      evt.preventDefault();
      goNext(true);
    } else if (key === "ArrowLeft") {
      evt.preventDefault();
      goTo(activeIndex - 1, true, -1);
    }
  });

  var startX = null;
  var startY = null;
  var touchCurrentX = null;
  var touchDragging = false;
  var touchMoved = false;

  function stopTouchDrag(commit, fallbackDeltaX) {
    if (startX == null) return;

    var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
    var deltaX = (typeof fallbackDeltaX === "number" && isFinite(fallbackDeltaX))
      ? fallbackDeltaX
      : ((touchCurrentX == null || startX == null) ? 0 : (touchCurrentX - startX));
    var threshold = (typeof getDeckSwipeThresholdPx === "function")
      ? getDeckSwipeThresholdPx(viewport)
      : Math.max(36, Math.round(width * 0.18));

    startX = null;
    startY = null;
    touchCurrentX = null;

    if (!touchDragging) return;

    touchDragging = false;

    if (!reduceMotion) {
      try { track.style.transition = (typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.swipeSnapTransition) ? BOLO_DECK_UX.swipeSnapTransition : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)"; } catch (eTouchTrackTransition) {}
    }

    if (!commit) {
      render();
      return;
    }

    if (Math.abs(deltaX) >= threshold) {
      suppressCardClickUntil = Date.now() + 260;
      if (deltaX < 0) goNext(true);
      else goTo(activeIndex - 1, true, -1);
      return;
    }

    render();
  }

  UI.bindOnce(viewport, "homeDeckTouchStartBound", "touchstart", function(evt) {
    if (isDeckControlTarget(evt)) {
      startX = null;
      startY = null;
      touchCurrentX = null;
      touchDragging = false;
      touchMoved = false;
      return;
    }
    if (!evt.touches || !evt.touches.length) return;
    startX = evt.touches[0].clientX;
    startY = evt.touches[0].clientY;
    touchCurrentX = startX;
    touchDragging = true;
    touchMoved = false;
  });

  UI.bindOnce(viewport, "homeDeckTouchMoveBound", "touchmove", function(evt) {
    if (!touchDragging || startX == null || !evt.touches || !evt.touches.length) return;

    var touch = evt.touches[0];
    touchCurrentX = touch.clientX;
    var currentY = touch.clientY;
    var deltaX = touchCurrentX - startX;
    var deltaY = (startY == null) ? 0 : (currentY - startY);

    if (!touchMoved) {
      var horizontalIntent = (typeof hasDeckHorizontalIntent === "function")
        ? hasDeckHorizontalIntent(deltaX, deltaY)
        : (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1);
      if (!horizontalIntent) return;
      touchMoved = true;
      if (!reduceMotion) {
        try { track.style.transition = "none"; } catch (eTouchMoveTransition) {}
      }
    }

    var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
    var basePx = activeIndex * width;
    var targetPx = -basePx + deltaX;
    track.style.transform = "translateX(" + targetPx + "px)";
    if (width > 0) {
      setPeekDirectionFromDelta(deltaX);
      applyWheelLook(deltaX / width, true);
    }
    try { evt.preventDefault(); } catch (eTouchMovePrevent) {}
  }, { passive: false });

  UI.bindOnce(viewport, "homeDeckTouchEndBound", "touchend", function(evt) {
    if (startX == null) return;
    var touch = (evt.changedTouches && evt.changedTouches[0]) ? evt.changedTouches[0] : null;
    if (!touch) {
      stopTouchDrag(false, 0);
      return;
    }
    var deltaX = touch.clientX - startX;
    if (touchMoved) {
      stopTouchDrag(true, deltaX);
      return;
    }

    touchDragging = false;
    startX = null;
    startY = null;
    touchCurrentX = null;
    var endThreshold = (typeof getDeckSwipeThresholdPx === "function")
      ? getDeckSwipeThresholdPx(viewport)
      : 36;
    if (Math.abs(deltaX) < endThreshold) return;
    if (deltaX < 0) goNext(true);
    else goTo(activeIndex - 1, true, -1);
  });

  UI.bindOnce(viewport, "homeDeckTouchCancelBound", "touchcancel", function() {
    stopTouchDrag(false, 0);
  });

  var pointerStartX = null;
  var pointerCurrentX = null;
  var pointerDragging = false;
  var pointerId = null;
  var pointerMoved = false;
  var wheelAccumX = 0;
  var wheelLastTs = 0;

  function stopPointerDrag(commit) {
    if (!pointerDragging) return;

    var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
    var deltaX = (pointerCurrentX == null || pointerStartX == null) ? 0 : (pointerCurrentX - pointerStartX);
    var threshold = (typeof getDeckSwipeThresholdPx === "function")
      ? getDeckSwipeThresholdPx(viewport)
      : Math.max(36, Math.round(width * 0.18));

    pointerDragging = false;
    pointerStartX = null;
    pointerCurrentX = null;
    pointerId = null;

    if (!reduceMotion) {
      try { track.style.transition = (typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.pointerSnapTransition) ? BOLO_DECK_UX.pointerSnapTransition : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)"; } catch (eTrackTransition) {}
    }

    if (!commit) {
      render();
      return;
    }

    if (Math.abs(deltaX) >= threshold) {
      suppressCardClickUntil = Date.now() + 260;
      if (deltaX < 0) goNext(true);
      else goTo(activeIndex - 1, true, -1);
      return;
    }

    render();
  }

  UI.bindOnce(viewport, "homeDeckPointerDownBound", "pointerdown", function(evt) {
    if (!evt || evt.pointerType === "touch") return;
    if (evt.button != null && evt.button !== 0) return;
    if (isDeckControlTarget(evt)) return;

    pointerId = evt.pointerId;
    pointerStartX = evt.clientX;
    pointerCurrentX = evt.clientX;
    pointerDragging = true;
    pointerMoved = false;

    try { viewport.setPointerCapture(pointerId); } catch (eCapture) {}
    if (!reduceMotion) {
      try { track.style.transition = "none"; } catch (eTrackTransition) {}
    }
  });

  UI.bindOnce(viewport, "homeDeckPointerMoveBound", "pointermove", function(evt) {
    if (!pointerDragging) return;
    if (pointerId != null && evt.pointerId !== pointerId) return;

    pointerCurrentX = evt.clientX;
    var deltaX = pointerCurrentX - pointerStartX;
    if (Math.abs(deltaX) > 3) pointerMoved = true;

    if (pointerMoved) {
      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var basePx = activeIndex * width;
      var targetPx = -basePx + deltaX;
      track.style.transform = "translateX(" + targetPx + "px)";
      if (width > 0) {
        setPeekDirectionFromDelta(deltaX);
        applyWheelLook(deltaX / width);
      }
      try { evt.preventDefault(); } catch (ePrevent) {}
    }
  });

  UI.bindOnce(viewport, "homeDeckPointerUpBound", "pointerup", function(evt) {
    if (!pointerDragging) return;
    if (pointerId != null && evt.pointerId !== pointerId) return;
    stopPointerDrag(true);
  });

  UI.bindOnce(viewport, "homeDeckPointerCancelBound", "pointercancel", function(evt) {
    if (!pointerDragging) return;
    if (pointerId != null && evt.pointerId !== pointerId) return;
    stopPointerDrag(false);
  });

  UI.bindOnce(viewport, "homeDeckPointerLeaveBound", "pointerleave", function() {
    if (!pointerDragging) return;
    stopPointerDrag(true);
  });

  UI.bindOnce(viewport, "homeDeckWheelBound", "wheel", function(evt) {
    if (!evt || isDeckControlTarget(evt)) return;

    var dx = (typeof evt.deltaX === "number" && isFinite(evt.deltaX)) ? evt.deltaX : 0;
    var dy = (typeof evt.deltaY === "number" && isFinite(evt.deltaY)) ? evt.deltaY : 0;

    if (Math.abs(dx) < 1 && evt.shiftKey) {
      dx = dy;
    }

    var absX = Math.abs(dx);
    var absY = Math.abs(dy);
    var horizontalIntent = absX > 6 && absX >= (absY * 0.85);
    if (!horizontalIntent) return;

    var now = Date.now();
    if (now - wheelLastTs > 280) {
      wheelAccumX = 0;
    }
    wheelLastTs = now;
    wheelAccumX += dx;

    try { evt.preventDefault(); } catch (eWheelPrevent) {}

    if (Math.abs(wheelAccumX) < 54) return;

    suppressCardClickUntil = Date.now() + 180;
    if (wheelAccumX > 0) goNext(true);
    else goTo(activeIndex - 1, true, -1);
    wheelAccumX = 0;
  });

  if (hint) {
    var seenHint = false;
    try { seenHint = localStorage.getItem("homeDeckHintSeen_v1") === "1"; } catch (e3) { seenHint = false; }
    if (seenHint || reduceMotion) hint.style.display = "none";
  }

  render();
}

// Initialize the app when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  try {
    // Startup validation with error handling
    if (!_startupChecks()) {
      console.error("❌ Startup checks failed. Module missing.");
      return;
    }

    // Localhost-only build stamp (helps verify cache-busted updates are live)
    try {
      var isLocalhost = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
      if (isLocalhost) {
        var buildStamp = '20251231';
        window.BOLO_BUILD = buildStamp;
        document.documentElement.setAttribute('data-bolo-build', buildStamp);
        console.info('[BOLO] build', buildStamp);
      }
    } catch (e) {
      // Non-fatal
    }
    
    // Attach optional Reading vocab (safe if READING_VOCAB is missing)
    mergeReadingVocabIntoReadings();
    validateReadingVocabDetail();
    
    // Initialize feature modules
    Lessons.init();
    Games.init();
    Reading.init();
    UI.init();
    UI.goToInitial("screen-home");
    initHomeSwipeDeck();

  } catch (e) {
    console.error("❌ Failed to initialize BOLO:", e.message, e.stack);
    if (typeof UI !== "undefined" && UI && typeof UI.showAlertDialog === "function") {
      UI.showAlertDialog("BOLO failed to initialize: " + e.message + "\n\nCheck console for details.", {
        title: "Initialization failed",
        confirmText: "OK"
      });
    } else {
      alert("BOLO failed to initialize: " + e.message + "\n\nCheck console for details.");
    }
  }
});
