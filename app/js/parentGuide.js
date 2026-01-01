// =====================================
// Parent Guide Module
// =====================================

var ParentGuide = {
  // Initialize parent guide module
  init: function() {
    if (ParentGuide._initialized) return;
    ParentGuide._initialized = true;
    console.log("ParentGuide module initialized");
    ParentGuide.wireEventListeners();
  },

  mountScreen: function() {
    ParentGuide.wireEventListeners();
    ParentGuide.renderFullScreen();
  },

  // Wire up event listeners for parent guide features
  wireEventListeners: function() {
    console.log("ParentGuide.wireEventListeners() called");
    
    // Wire up navigation to parent screen
    var btnHomeParent = document.getElementById("btn-home-parent");
    if (btnHomeParent && !btnHomeParent.dataset.parentNavBound) {
      console.log("Binding btn-home-parent");
      btnHomeParent.dataset.parentNavBound = "true";
      btnHomeParent.addEventListener("click", function(e) {
        e.preventDefault();
        UI.goTo("screen-parent");
      });
    }

    // Wire up back button from parent screen
    var btnParentBack = document.getElementById("btn-parent-back");
    if (btnParentBack && !btnParentBack.dataset.parentBackBound) {
      console.log("Binding btn-parent-back");
      btnParentBack.dataset.parentBackBound = "true";
      btnParentBack.addEventListener("click", function(e) {
        e.preventDefault();
        UI.goTo("screen-home");
      });
    }
  },

  // Render full parent/teacher screen
  renderFullScreen: function() {
    console.log("Rendering full parent guide screen");
    
    var bodyContainer = document.getElementById("parent-screen-body");
    if (!bodyContainer) {
      console.error("parent-screen-body element not found");
      return;
    }
    
    // Check if PARENT_GUIDE_DATA exists
    if (typeof PARENT_GUIDE_DATA === "undefined") {
      console.error("PARENT_GUIDE_DATA not loaded");
      return;
    }
    
    var sections = PARENT_GUIDE_DATA.sections || [];
    console.log("Rendering", sections.length, "sections");
    
    if (sections.length === 0) {
      console.error("No sections found in PARENT_GUIDE_DATA");
      return;
    }
    
    // Clear only the dynamic body container (keep static header and buttons intact)
    bodyContainer.innerHTML = "";
    
    // Create new content container
    var contentContainer = document.createElement("div");
    contentContainer.className = "parent-guide-content";
    contentContainer.style.cssText = "padding: 16px; overflow-y: auto; max-height: calc(100vh - 120px);";
    
    // Render each section (English only)
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var sectionDiv = document.createElement("div");
      sectionDiv.style.cssText = "margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e0e0e0;";
      
      // Section title (English)
      var title = section.titleEn;
      var titleEl = document.createElement("h3");
      titleEl.textContent = title;
      titleEl.style.cssText = "margin: 0 0 12px 0; color: #003f7f; font-size: 18px; font-weight: 600;";
      sectionDiv.appendChild(titleEl);
      
      // Section content points (English only)
      var contentArray = section.content.en;
      
      if (Array.isArray(contentArray)) {
        for (var j = 0; j < contentArray.length; j++) {
          var point = contentArray[j];
          var pointEl = document.createElement("p");
          pointEl.textContent = point;
          pointEl.style.cssText = "margin: 8px 0; color: #1f2933; font-size: 14px; line-height: 1.6; text-align: left;";
          sectionDiv.appendChild(pointEl);
        }
      }
      
      contentContainer.appendChild(sectionDiv);
    }
    
    // Append container to screen body
    bodyContainer.appendChild(contentContainer);
    console.log("Full parent guide screen rendered successfully with", sections.length, "sections");
  },

  // Save a parent note for a specific lesson
  saveNote: function(lessonId, noteText) {
    if (!State.state.parentData) {
      State.state.parentData = { notes: {}, goals: [], preferences: {} };
    }
    
    if (!State.state.parentData.notes) {
      State.state.parentData.notes = {};
    }

    // Sanitize and limit note length
    var sanitized = noteText.trim().substring(0, 500);
    
    if (sanitized.length > 0) {
      State.state.parentData.notes[lessonId] = sanitized;
      State.save();
      console.log("Note saved for lesson:", lessonId);
      return true;
    }
    return false;
  },

  // Get note for a lesson
  getNote: function(lessonId) {
    if (!State.state.parentData || !State.state.parentData.notes) {
      return null;
    }
    return State.state.parentData.notes[lessonId] || null;
  },

  // Add a custom learning goal
  addGoal: function(goalText) {
    if (!State.state.parentData) {
      State.state.parentData = { notes: {}, goals: [], preferences: {} };
    }
    
    if (!State.state.parentData.goals) {
      State.state.parentData.goals = [];
    }

    // Limit total goals
    if (State.state.parentData.goals.length >= 20) {
      console.warn("Maximum goals (20) reached");
      return false;
    }

    // Sanitize and validate
    var sanitized = goalText.trim().substring(0, 200);
    
    if (sanitized.length > 0) {
      var goal = {
        id: Date.now(),
        text: sanitized,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      State.state.parentData.goals.push(goal);
      State.save();
      console.log("Goal added:", goal);
      return goal;
    }
    return false;
  },

  // Toggle goal completion
  toggleGoal: function(goalId) {
    if (!State.state.parentData || !State.state.parentData.goals) {
      return false;
    }

    var goal = State.state.parentData.goals.find(function(g) {
      return g.id === goalId;
    });

    if (goal) {
      goal.completed = !goal.completed;
      goal.completedAt = goal.completed ? new Date().toISOString() : null;
      State.save();
      console.log("Goal toggled:", goalId, goal.completed);
      return true;
    }
    return false;
  },

  // Remove a goal
  removeGoal: function(goalId) {
    if (!State.state.parentData || !State.state.parentData.goals) {
      return false;
    }

    var index = State.state.parentData.goals.findIndex(function(g) {
      return g.id === goalId;
    });

    if (index !== -1) {
      State.state.parentData.goals.splice(index, 1);
      State.save();
      console.log("Goal removed:", goalId);
      return true;
    }
    return false;
  },

  // Get all goals
  getGoals: function() {
    if (!State.state.parentData || !State.state.parentData.goals) {
      return [];
    }
    return State.state.parentData.goals;
  },

  // Export progress summary
  exportProgress: function() {
    var profile = State.getActiveProfile();
    if (!profile) {
      console.warn("No active profile to export");
      return null;
    }

    var summary = {
      profileName: profile.name,
      level: profile.level,
      totalXP: profile.xp,
      exportDate: new Date().toISOString(),
      skillStrengths: profile.skillStrengths || {},
      completedLessons: profile.lessonsComplete || [],
      completedReadings: profile.readingsComplete || [],
      goals: ParentGuide.getGoals()
    };

    console.log("Progress summary exported:", summary);
    return summary;
  },

  // Generate a text summary for sharing
  generateTextSummary: function() {
    var summary = ParentGuide.exportProgress();
    if (!summary) return "";

    var text = "BOLO Progress Report\n";
    text += "====================\n\n";
    text += "Student: " + summary.profileName + "\n";
    text += "Level: " + summary.level + "\n";
    text += "Total XP: " + summary.totalXP + "\n";
    text += "Date: " + new Date(summary.exportDate).toLocaleDateString() + "\n\n";
    
    text += "Skill Strengths:\n";
    for (var trackId in summary.skillStrengths) {
      text += "- " + trackId + ": " + summary.skillStrengths[trackId] + "%\n";
    }
    
    text += "\nLessons Completed: " + summary.completedLessons.length + "\n";
    text += "Readings Completed: " + summary.completedReadings.length + "\n";

    if (summary.goals && summary.goals.length > 0) {
      text += "\nLearning Goals:\n";
      summary.goals.forEach(function(goal) {
        var status = goal.completed ? "[✓]" : "[ ]";
        text += status + " " + goal.text + "\n";
      });
    }

    return text;
  }
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  // Wait for State to be available
  if (typeof State !== "undefined") {
    ParentGuide.init();
  }
});
