/*
Usage:
  Sound.setBasePath("./");
  Sound.initOnFirstGesture();
  Sound.setMuted(false);
  Sound.play("abc/a");
*/

(function() {
  "use strict";

  var DEFAULT_BASE_PATH = "./";

  var basePath = DEFAULT_BASE_PATH;
  var muted = false;

  var audioContext = null;
  var usingWebAudio = false;

  // WebAudio caches
  var bufferCache = new Map(); // url -> AudioBuffer
  var bufferPromiseCache = new Map(); // url -> Promise<AudioBuffer>

  // HTMLAudio fallback cache (best-effort)
  var htmlAudioCache = new Map(); // url -> HTMLAudioElement

  function ensureTrailingSlash(path) {
    if (path == null) return "./";
    var s = String(path);
    if (!s) return "./";
    return s.endsWith("/") ? s : (s + "/");
  }

  function getUrlForRelPath(relPath) {
    // relPath like "abc/a" -> "{basePath}audio/abc/a.mp3"
    var rp = String(relPath || "").replace(/^\//, "");
    return basePath + "audio/" + rp + ".mp3";
  }

  function canUseWebAudio() {
    return typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
  }

  function getOrCreateAudioContext() {
    if (audioContext) return audioContext;
    if (!canUseWebAudio()) return null;

    try {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      audioContext = new Ctor();
      usingWebAudio = true;
      return audioContext;
    } catch (e) {
      audioContext = null;
      usingWebAudio = false;
      return null;
    }
  }

  function resumeContextIfNeeded() {
    if (!audioContext || typeof audioContext.resume !== "function") return Promise.resolve();
    if (audioContext.state === "running") return Promise.resolve();
    return audioContext.resume().catch(function() {
      // Some browsers require a user gesture; ignore here.
    });
  }

  function fetchAndDecodeAudio(url) {
    var ctx = getOrCreateAudioContext();
    if (!ctx) {
      return Promise.reject(new Error("AudioContext unavailable"));
    }

    if (bufferCache.has(url)) {
      return Promise.resolve(bufferCache.get(url));
    }

    if (bufferPromiseCache.has(url)) {
      return bufferPromiseCache.get(url);
    }

    var p = fetch(url)
      .then(function(resp) {
        if (!resp || !resp.ok) {
          throw new Error("Failed to fetch audio: " + url);
        }
        return resp.arrayBuffer();
      })
      .then(function(arr) {
        return new Promise(function(resolve, reject) {
          // decodeAudioData has both callback and promise forms across browsers
          try {
            var maybePromise = ctx.decodeAudioData(arr, resolve, reject);
            if (maybePromise && typeof maybePromise.then === "function") {
              maybePromise.then(resolve).catch(reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      })
      .then(function(buffer) {
        bufferCache.set(url, buffer);
        bufferPromiseCache.delete(url);
        return buffer;
      })
      .catch(function(err) {
        bufferPromiseCache.delete(url);
        throw err;
      });

    bufferPromiseCache.set(url, p);
    return p;
  }

  function playWithWebAudio(url, volume) {
    var ctx = getOrCreateAudioContext();
    if (!ctx) {
      return Promise.reject(new Error("AudioContext unavailable"));
    }

    return resumeContextIfNeeded().then(function() {
      return fetchAndDecodeAudio(url);
    }).then(function(buffer) {
      if (muted) return;

      var source = ctx.createBufferSource();
      source.buffer = buffer;

      var gainNode = ctx.createGain();
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
    });
  }

  function playWithHtmlAudio(url, volume) {
    try {
      if (muted) return Promise.resolve();

      var audio = htmlAudioCache.get(url);
      if (!audio) {
        audio = new Audio(url);
        audio.preload = "auto";
        htmlAudioCache.set(url, audio);
      }

      // If the same element is already playing, clone to allow overlap.
      var toPlay = audio;
      if (!audio.paused && !audio.ended) {
        toPlay = new Audio(url);
        toPlay.preload = "auto";
      }

      // Ensure replay starts from the beginning for the reused element.
      // (Clones already start at t=0, but keep it explicit.)
      try {
        toPlay.currentTime = 0;
      } catch (e0) {}

      toPlay.volume = volume;
      var p = toPlay.play();
      if (p && typeof p.catch === "function") {
        p.catch(function() {
          // Browser may block until user gesture; ignore.
        });
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.resolve();
    }
  }

  function initOnFirstGesture() {
    // Attach once, remove after first gesture.
    var done = false;

    function cleanup() {
      if (done) return;
      done = true;
      window.removeEventListener("pointerdown", onGesture, true);
      window.removeEventListener("keydown", onGesture, true);
    }

    function onGesture() {
      // Only unlock/resume; do NOT autoplay sounds.
      var ctx = getOrCreateAudioContext();
      if (ctx) {
        var p = resumeContextIfNeeded();
        if (p && typeof p.then === "function") p.then(cleanup, cleanup);
        else cleanup();
      } else {
        cleanup();
      }
    }

    window.addEventListener("pointerdown", onGesture, true);
    window.addEventListener("keydown", onGesture, true);
  }

  function play(relPath, opts) {
    opts = opts || {};
    var volume = (opts.volume == null) ? 1.0 : Number(opts.volume);
    if (!isFinite(volume)) volume = 1.0;
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;

    var url = getUrlForRelPath(relPath);

    if (muted) return Promise.resolve();

    // Prefer WebAudio when available, but fall back gracefully.
    if (canUseWebAudio()) {
      return playWithWebAudio(url, volume).catch(function() {
        return playWithHtmlAudio(url, volume);
      });
    }

    return playWithHtmlAudio(url, volume);
  }

  function setMuted(isMuted) {
    muted = !!isMuted;
  }

  function setBasePath(path) {
    basePath = ensureTrailingSlash(path);
  }

  window.Sound = {
    play: play,
    setMuted: setMuted,
    initOnFirstGesture: initOnFirstGesture,
    setBasePath: setBasePath
  };
})();
