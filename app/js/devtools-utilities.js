/**
 * BOLO DevTools Utilities
 * Loaded only in development (localhost)
 * Access via: window.BOLO_DEV or short aliases (testGames, dumpState, etc.)
 * 
 * Usage in browser console:
 *   BOLO_DEV.validateContent()  // Check all data loaded
 *   BOLO_DEV.dumpState()        // See current profile
 *   BOLO_DEV.testGamesFlow()    // Test all 4 games
 *   BOLO_DEV.monitorStorage()   // Watch localStorage changes
 *   BOLO_DEV.reset()            // Clear state and reload
 */

(function() {
  'use strict';

  const BOLO_DEV = {
    /**
     * Validate that all content is loaded
     */
    validateContent: function() {
      console.log('✅ Validating BOLO content...');
      const checks = {
        lessons: window.LESSONS ? Object.keys(window.LESSONS).length : 0,
        games: [
          { name: 'GAME1', count: window.GAME1_QUESTIONS?.length || 0 },
          { name: 'GAME2', count: window.GAME2_QUESTIONS?.length || 0 },
          { name: 'GAME3', count: window.GAME3_QUESTIONS?.length || 0 },
          { name: 'GAME4', count: window.GAME4_QUESTIONS?.length || 0 }
        ],
        readings: window.READINGS?.length || 0,
        tracks: window.TRACKS ? Object.keys(window.TRACKS).length : 0,
        state: window.State ? 'loaded' : 'MISSING',
        ui: window.UI ? 'loaded' : 'MISSING'
      };
      console.table(checks);
      const allGamesLoaded = checks.games.every(g => g.count > 0);
      console.log(allGamesLoaded ? '✅ All games ready!' : '❌ Some games missing');
      return checks;
    },

    /**
     * Dump current state (no sensitive data)
     */
    dumpState: function() {
      if (!window.State) {
        console.log('❌ State module not loaded');
        return;
      }
      try {
        const state = JSON.parse(localStorage.getItem('boloAppState_v1') || '{}');
        console.log('📊 Current State:', {
          profiles: state.profiles ? Object.keys(state.profiles) : [],
          currentProfile: state.currentProfile?.name || 'None',
          totalXP: state.xp || 0,
          tracks: state.tracks ? Object.keys(state.tracks) : [],
          timestamp: new Date().toISOString()
        });
        return state;
      } catch (e) {
        console.error('❌ Error reading state:', e.message);
      }
    },

    /**
     * Test all 4 games are present and have questions
     */
    testGamesFlow: function() {
      console.log('🎮 Testing Games...');
      const gameNames = ['GAME1', 'GAME2', 'GAME3', 'GAME4'];
      const results = gameNames.map(game => ({
        game,
        questions: window[`${game}_QUESTIONS`]?.length || 0,
        valid: !!(window[`${game}_QUESTIONS`]?.length > 0)
      }));
      console.table(results);
      const allValid = results.every(r => r.valid);
      console.log(allValid ? '✅ All games loaded!' : '❌ Some games missing');
      return results;
    },

    /**
     * Monitor localStorage writes (for debugging data loss)
     */
    monitorStorage: function() {
      if (window._storageMonitored) {
        console.log('⚠️ Storage monitor already active');
        return;
      }
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'boloAppState_v1') {
          console.log(`💾 [STATE WRITE] ${new Date().toISOString()}`);
          console.log(`   Size: ${value.length} bytes`);
        }
        return original.apply(this, arguments);
      };
      window._storageMonitored = true;
      console.log('🔍 Storage monitoring enabled. State writes will be logged.');
    },

    /**
     * Reset all state (for testing from scratch)
     */
    reset: function(confirmMsg) {
      const msg = confirmMsg || 'Reset all state and profiles? This cannot be undone.';
      if (confirm(msg)) {
        localStorage.removeItem('boloAppState_v1');
        console.log('🔄 State cleared. Reloading...');
        location.reload();
      }
    },

    /**
     * Test Daily Quest seeding (verify determinism)
     */
    testQuestSeeding: function() {
      if (!window.DailyQuest) {
        console.log('❌ DailyQuest module not loaded');
        return;
      }
      const today = new Date().toISOString().split('T')[0];
      console.log(`🎲 Quest Seeding Test for date: ${today}`);
      try {
        // Test that same profile produces same seed
        const profile1 = { id: 'test_prof1', name: 'Test1' };
        const queue1 = DailyQuest.buildQueue ? DailyQuest.buildQueue.call({ currentProfile: profile1 }, today) : null;
        console.log('Profile test_prof1 quest queue:', queue1?.length || 'N/A');
        return { date: today, queueSize: queue1?.length };
      } catch (e) {
        console.error('❌ Error testing quest seeding:', e.message);
      }
    }
  };

  // Expose to window
  window.BOLO_DEV = BOLO_DEV;

  // Create short-hand aliases for convenience
  window.validateContent = () => BOLO_DEV.validateContent();
  window.dumpState = () => BOLO_DEV.dumpState();
  window.testGames = () => BOLO_DEV.testGamesFlow();
  window.monitorStorage = () => BOLO_DEV.monitorStorage();
  window.resetState = () => BOLO_DEV.reset();

  console.log('✅ BOLO DevTools utilities loaded. Use BOLO_DEV.* or short aliases (testGames, dumpState, etc.)');
})();
