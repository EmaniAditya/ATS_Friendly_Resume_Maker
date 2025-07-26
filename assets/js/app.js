// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded, initializing application");
  
  // Ensure required global variables and functions exist
  if (typeof CURRENT_DATA_KEY === 'undefined') {
    console.error("CURRENT_DATA_KEY is not defined");
    return;
  }
  
  // Auto-serve sample data as version "sample" on domain hit
  if (typeof autoServeSampleData === 'function') {
    try {
      autoServeSampleData();
    } catch (e) {
      console.error("Error auto-serving sample data:", e);
    }
  }
  
  // Initialize mobile sections
  if (window.innerWidth <= 768) {
    const sections = document.querySelectorAll('.mobile-collapsible');
    sections.forEach((section, index) => {
      // Keep first section expanded, collapse others
      if (index > 0) {
        section.classList.add('collapsed');
      }
    });
  }
  
  // Setup auto-save if function exists
  if (typeof setupAutoSave === 'function') {
    try {
      setupAutoSave();
    } catch (e) {
      console.error("Error setting up auto-save:", e);
    }
  } else {
    console.warn("setupAutoSave function not available");
  }
  
  // Check for required functions
  const canLoadData = typeof populateFormData === 'function';
  const canGenerateResume = typeof generateResume === 'function';
  const canLoadSample = typeof loadSampleData === 'function' && typeof SAMPLE_RESUME_DATA !== 'undefined';
  
  if (!canLoadData) {
    console.error("populateFormData function not available");
    return;
  }
  
  // Try to load saved data
  try {
    const savedData = localStorage.getItem(CURRENT_DATA_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        populateFormData(parsedData);
        
        if (canGenerateResume) {
          generateResume();
        } else {
          console.warn("generateResume function not available");
        }
        
        console.log("Loaded saved data");
      } catch (e) {
        console.error("Error loading saved data:", e);
        
        // Load sample data as fallback if available
        if (canLoadSample) {
          loadSampleData();
        } else {
          console.error("Cannot load sample data as fallback");
          if (typeof showToast === 'function') {
            showToast("Error loading saved data", "error");
          }
        }
      }
    } else {
      // No saved data, load sample data if available
      console.log("No saved data found, loading sample data");
      
      if (canLoadSample) {
        loadSampleData();
      } else {
        console.error("Sample data or loadSampleData function not available");
      }
    }
  } catch (storageError) {
    console.error("Error accessing localStorage:", storageError);
  }
  
  // Initialize sortable for section reordering if available
  try {
    const sectionOrder = document.getElementById('sectionOrder');
    if (sectionOrder && typeof Sortable !== 'undefined') {
      new Sortable(sectionOrder, {
        animation: 150,
        ghostClass: 'bg-light',
        onEnd: function() {
          if (typeof saveCurrentData === 'function') {
            saveCurrentData();
          }
          
          if (canGenerateResume) {
            generateResume();
          }
        }
      });
    }
  } catch (sortableError) {
    console.error("Error initializing sortable:", sortableError);
  }
  
  // Add event listeners for form controls if function exists
  if (typeof setupEventListeners === 'function') {
    try {
      setupEventListeners();
    } catch (e) {
      console.error("Error setting up event listeners:", e);
    }
  } else {
    console.warn("setupEventListeners function not available");
  }
});

// Setup event listeners for form controls
function setupEventListeners() {
  // Live preview update function - debounced to avoid too many updates
  const debouncedPreviewUpdate = debounce(function() {
    generateResume();
  }, 300); // 300ms delay
  
  // Add live preview listeners to all form inputs
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    // For text inputs and textareas, use input event
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
      input.addEventListener('input', debouncedPreviewUpdate);
    }
    // For select elements, use change event
    else if (input.tagName === 'SELECT') {
      input.addEventListener('change', debouncedPreviewUpdate);
    }
  });
  
  // Template change
  const templateSelect = document.getElementById('template');
  if (templateSelect) {
    templateSelect.addEventListener('change', function() {
      generateResume(); // Immediate update for template changes
      
      // Track template change
      if (typeof trackTemplateUsage === 'function' && typeof trackFeatureUsage === 'function') {
        trackTemplateUsage(this.value);
        trackFeatureUsage('templateChange');
      }
    });
  }
  
  // Compact mode toggle
  const compactMode = document.getElementById('compactMode');
  if (compactMode) {
    compactMode.addEventListener('change', function() {
      checkPageOverflow();
      saveCurrentData();
      generateResume(); // Update preview when compact mode changes
    });
  }
  
  // Density slider
  const densitySlider = document.getElementById('densitySlider');
  if (densitySlider) {
    densitySlider.addEventListener('input', function() {
      const value = parseInt(this.value);
      applyDensitySetting(value);
      generateResume(); // Update preview when density changes
    });
  }
  
  // Preview button (keep for manual refresh)
  const previewButton = document.querySelector('button[onclick="generateResume()"]');
  if (previewButton) {
    previewButton.addEventListener('click', generateResume);
  }
  
  // Plain text buttons
  const viewPlainTextButton = document.querySelector('button[onclick="viewPlainText()"]');
  if (viewPlainTextButton) {
    viewPlainTextButton.addEventListener('click', viewPlainText);
  }
  
  // Removed duplicate listener to prevent double download triggering; inline onclick already handles it.
  // const downloadPlainTextButton = document.querySelector('button[onclick="downloadPlainText()"]');
  // if (downloadPlainTextButton) {
  //   downloadPlainTextButton.addEventListener('click', downloadPlainText);
  // }
  
  // Versions button
  const versionsButton = document.querySelector('button[onclick="showVersionsModal()"]');
  if (versionsButton) {
    versionsButton.addEventListener('click', showVersionsModal);
  }
  
  // Save named version button
  const saveNamedVersionButton = document.querySelector('button[onclick="saveNamedVersion()"]');
  if (saveNamedVersionButton) {
    saveNamedVersionButton.addEventListener('click', saveNamedVersion);
  }
  
  // Export data button - using onclick attribute, no need for addEventListener to prevent double execution
  
  // Import data button
  const importDataButton = document.querySelector('button[onclick="importData()"]');
  if (importDataButton) {
    importDataButton.addEventListener('click', importData);
  }
  
  // Clear form button
  const clearFormButton = document.querySelector('button[onclick="clearForm()"]');
  if (clearFormButton) {
    clearFormButton.addEventListener('click', clearForm);
  }
  
  // Copy plain text button
  const copyPlainTextButton = document.querySelector('button[onclick="copyPlainText()"]');
  if (copyPlainTextButton) {
    copyPlainTextButton.addEventListener('click', copyPlainText);
  }
  
  // Mobile section toggles
  const mobileSectionTitles = document.querySelectorAll('.mobile-collapsible .section-title');
  mobileSectionTitles.forEach(title => {
    title.addEventListener('click', function() {
      toggleMobileSection(this);
    });
  });
  
  // Density setting buttons
  const densityButtons = document.querySelectorAll('.btn-group .btn');
  densityButtons.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      applyDensitySetting(index + 1);
      generateResume(); // Update preview when density changes
    });
  });

  // Analyze keywords button
  const analyzeKeywordsButton = document.querySelector('button[onclick="analyzeJobDescription()"]');
  if (analyzeKeywordsButton) {
    analyzeKeywordsButton.addEventListener('click', function() {
      analyzeJobDescription();
      
      // Track keyword analysis
      if (typeof trackFeatureUsage === 'function') {
        trackFeatureUsage('keywordAnalysis');
      }
    });
  }
  
  // Setup section order updates
  const sectionOrder = document.getElementById('sectionOrder');
  if (sectionOrder) {
    new Sortable(sectionOrder, {
      animation: 150,
      ghostClass: 'bg-light',
      onEnd: function() {
        saveCurrentData();
        generateResume(); // Update preview when sections are reordered
      }
    });
  }
  
  // Add section event listeners
  setupSectionEventListeners();
}

// Debounce helper function to limit how often the resume preview is updated
function debounce(func, delay) {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Setup event listeners for section add buttons
function setupSectionEventListeners() {
  // Experience
  const addExperienceButton = document.querySelector('button[onclick="addExperience()"]');
  if (addExperienceButton) {
    addExperienceButton.addEventListener('click', function() {
      if (typeof trackSectionUsage === 'function') {
        trackSectionUsage('experience');
      }
    });
  }
  
  // Education
  const addEducationButton = document.querySelector('button[onclick="addEducation()"]');
  if (addEducationButton) {
    addEducationButton.addEventListener('click', function() {
      if (typeof trackSectionUsage === 'function') {
        trackSectionUsage('education');
      }
    });
  }
  
  // Projects
  const addProjectButton = document.querySelector('button[onclick="addProject()"]');
  if (addProjectButton) {
    addProjectButton.addEventListener('click', function() {
      if (typeof trackSectionUsage === 'function') {
        trackSectionUsage('projects');
      }
    });
  }
  
  // Certifications
  const addCertificationButton = document.querySelector('button[onclick="addCertification()"]');
  if (addCertificationButton) {
    addCertificationButton.addEventListener('click', function() {
      if (typeof trackSectionUsage === 'function') {
        trackSectionUsage('certifications');
      }
    });
  }
  
  // Languages
  const addLanguageButton = document.querySelector('button[onclick="addLanguage()"]');
  if (addLanguageButton) {
    addLanguageButton.addEventListener('click', function() {
      if (typeof trackSectionUsage === 'function') {
        trackSectionUsage('languages');
      }
    });
  }
  
  // Achievements
  const addAchievementButton = document.querySelector('button[onclick="addAchievement()"]');
  if (addAchievementButton) {
    addAchievementButton.addEventListener('click', function() {
      if (typeof trackSectionUsage === 'function') {
        trackSectionUsage('achievements');
      }
    });
  }
  
  // Rated Skills
  const addRatedSkillButton = document.querySelector('button[onclick="addRatedSkill()"]');
  if (addRatedSkillButton) {
    addRatedSkillButton.addEventListener('click', function() {
      if (typeof trackSectionUsage === 'function') {
        trackSectionUsage('skills');
      }
    });
  }
}

// Toggle mobile section collapse
function toggleMobileSection(titleElement) {
  if (window.innerWidth <= 768) {
    const section = titleElement.closest('.mobile-collapsible');
    section.classList.toggle('collapsed');
  }
}

// Add experience entry
function addExperience() {
  const container = document.getElementById('experienceContainer');
  const template = container.querySelector('.experience-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, textarea').forEach(input => {
    input.value = '';
    
    // Add live preview event listeners to new inputs
    input.addEventListener('input', function() {
      saveCurrentData();
      generateResume(); // Update preview when field changes
    });
  });
  
  container.appendChild(newItem);
  saveCurrentData();
  generateResume(); // Update preview after adding section
}

// Remove experience entry
function removeExperience(button) {
  const item = button.closest('.experience-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.experience-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
    generateResume(); // Update preview after removing section
  }
}

// Add education entry
function addEducation() {
  const container = document.getElementById('educationContainer');
  const template = container.querySelector('.education-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, select').forEach(input => {
    input.value = '';
    
    // Add live preview event listeners to new inputs
    input.addEventListener('input', function() {
      saveCurrentData();
      generateResume();
    });
    
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', function() {
        saveCurrentData();
        generateResume();
      });
    }
  });
  
  container.appendChild(newItem);
  saveCurrentData();
  generateResume();
}

// Remove education entry
function removeEducation(button) {
  const item = button.closest('.education-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.education-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
    generateResume();
  }
}

// Add project entry
function addProject() {
  const container = document.getElementById('projectsContainer');
  const template = container.querySelector('.project-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, textarea').forEach(input => {
    input.value = '';
    
    // Add live preview event listeners
    input.addEventListener('input', function() {
      saveCurrentData();
      generateResume();
    });
  });
  
  container.appendChild(newItem);
  saveCurrentData();
  generateResume();
}

// Remove project entry
function removeProject(button) {
  const item = button.closest('.project-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.project-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
    generateResume();
  }
}

// Add certification entry
function addCertification() {
  const container = document.getElementById('certificationsContainer');
  if (!container) return;
  
  const template = container.querySelector('.certifications-item');
  if (!template) return;
  
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, textarea').forEach(input => {
    input.value = '';
    
    // Add live preview event listeners
    input.addEventListener('input', function() {
      saveCurrentData();
      generateResume();
    });
  });
  
  container.appendChild(newItem);
  setupSectionEventListeners();
  saveCurrentData();
  generateResume();
}

// Remove certification entry
function removeCertification(button) {
  const container = document.getElementById('certificationsContainer');
  if (!container) return;
  
  const items = container.querySelectorAll('.certifications-item');
  if (items.length <= 1) {
    // Don't remove the last item, just clear it
    const item = items[0];
    item.querySelectorAll('input, textarea').forEach(input => {
      input.value = '';
    });
  } else {
    // Remove the item containing the clicked button
    const item = button.closest('.certifications-item');
    if (item) {
      item.remove();
    }
  }
  
  saveCurrentData();
  generateResume();
}

// Add language entry
function addLanguage() {
  const container = document.getElementById('languagesContainer');
  if (!container) return;
  
  const template = container.querySelector('.languages-item');
  if (!template) return;
  
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, select').forEach(input => {
    input.value = '';
    
    // Add live preview event listeners
    input.addEventListener('input', function() {
      saveCurrentData();
      generateResume();
    });
    
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', function() {
        saveCurrentData();
        generateResume();
      });
    }
  });
  
  container.appendChild(newItem);
  setupSectionEventListeners();
  saveCurrentData();
  generateResume();
}

// Remove language entry
function removeLanguage(button) {
  const container = document.getElementById('languagesContainer');
  if (!container) return;
  
  const items = container.querySelectorAll('.languages-item');
  if (items.length <= 1) {
    // Don't remove the last item, just clear it
    const item = items[0];
    item.querySelectorAll('input, select').forEach(input => {
      input.value = '';
    });
  } else {
    // Remove the item containing the clicked button
    const item = button.closest('.languages-item');
    if (item) {
      item.remove();
    }
  }
  
  saveCurrentData();
  generateResume();
}

// Add achievement entry
function addAchievement() {
  const container = document.getElementById('achievementsContainer');
  if (!container) return;
  
  const template = container.querySelector('.achievements-item');
  if (!template) return;
  
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, textarea').forEach(input => {
    input.value = '';
    
    // Add live preview event listeners
    input.addEventListener('input', function() {
      saveCurrentData();
      generateResume();
    });
  });
  
  container.appendChild(newItem);
  setupSectionEventListeners();
  saveCurrentData();
  generateResume();
}

// Remove achievement entry
function removeAchievement(button) {
  const container = document.getElementById('achievementsContainer');
  if (!container) return;
  
  const items = container.querySelectorAll('.achievements-item');
  if (items.length <= 1) {
    // Don't remove the last item, just clear it
    const item = items[0];
    item.querySelectorAll('input, textarea').forEach(input => {
      input.value = '';
    });
  } else {
    // Remove the item containing the clicked button
    const item = button.closest('.achievements-item');
    if (item) {
      item.remove();
    }
  }
  
  saveCurrentData();
  generateResume();
}

// Add rated skill
function addRatedSkill() {
  const container = document.getElementById('ratedSkillsContainer');
  const template = container.querySelector('.rated-skill-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, select').forEach(input => {
    input.value = '';
    
    // Add live preview event listeners
    input.addEventListener('input', function() {
      saveCurrentData();
      generateResume();
    });
    
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', function() {
        saveCurrentData();
        generateResume();
      });
    }
  });
  
  container.appendChild(newItem);
  saveCurrentData();
  generateResume();
}

// Remove rated skill
function removeRatedSkill(button) {
  const item = button.closest('.rated-skill-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.rated-skill-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
    generateResume();
  }
} 