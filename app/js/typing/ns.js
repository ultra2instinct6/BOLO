// Typing feature namespace (no imports; globals-only)
// This file must load before other typing submodules.
(function() {
  if (!window.TypingPremium || typeof window.TypingPremium !== "object") {
    window.TypingPremium = {};
  }

  var TP = window.TypingPremium;

  // Shared sub-namespaces (safe to call multiple times)
  if (!TP.platform || typeof TP.platform !== "object") TP.platform = {};
  if (!TP.storage || typeof TP.storage !== "object") TP.storage = {};
  if (!TP.prompts || typeof TP.prompts !== "object") TP.prompts = {};
  if (!TP.modes || typeof TP.modes !== "object") TP.modes = {};
})();
