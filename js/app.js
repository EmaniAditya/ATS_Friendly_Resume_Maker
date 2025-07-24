// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
  
  // Setup auto-save
  setupAutoSave();
  
  // Try to load saved data
  const savedData = localStorage.getItem(CURRENT_DATA_KEY);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      populateFormData(parsedData);
      generateResume();
      console.log("Loaded saved data");
    } catch (e) {
      console.error("Error loading saved data:", e);
      loadSampleData(); // Load sample data as fallback
    }
  } else {
    // No saved data, load sample data
    loadSampleData();
  }
  
  // Initialize sortable for section reordering
  if (document.getElementById('sectionOrder')) {
    new Sortable(document.getElementById('sectionOrder'), {
      animation: 150,
      ghostClass: 'bg-light',
      onEnd: function() {
        saveCurrentData();
        generateResume();
      }
    });
  }
  
  // Add event listeners for form controls
  setupEventListeners();
});

// Setup event listeners for form controls
function setupEventListeners() {
  // Template change
  const templateSelect = document.getElementById('template');
  if (templateSelect) {
    templateSelect.addEventListener('change', generateResume);
  }
  
  // Compact mode toggle
  const compactMode = document.getElementById('compactMode');
  if (compactMode) {
    compactMode.addEventListener('change', function() {
      checkPageOverflow();
      saveCurrentData();
    });
  }
  
  // Density slider
  const densitySlider = document.getElementById('densitySlider');
  if (densitySlider) {
    densitySlider.addEventListener('input', function() {
      const value = parseInt(this.value);
      applyDensitySetting(value);
    });
  }
  
  // Preview button
  const previewButton = document.querySelector('button[onclick="generateResume()"]');
  if (previewButton) {
    previewButton.addEventListener('click', generateResume);
  }
  
  // PDF download button
  const pdfButton = document.querySelector('button[onclick="downloadPDF()"]');
  if (pdfButton) {
    pdfButton.addEventListener('click', downloadPDF);
  }
  
  // Plain text buttons
  const viewPlainTextButton = document.querySelector('button[onclick="viewPlainText()"]');
  if (viewPlainTextButton) {
    viewPlainTextButton.addEventListener('click', viewPlainText);
  }
  
  const downloadPlainTextButton = document.querySelector('button[onclick="downloadPlainText()"]');
  if (downloadPlainTextButton) {
    downloadPlainTextButton.addEventListener('click', downloadPlainText);
  }
  
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
  
  // Export data button
  const exportDataButton = document.querySelector('button[onclick="exportData()"]');
  if (exportDataButton) {
    exportDataButton.addEventListener('click', exportData);
  }
  
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
    });
  });
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
  });
  
  container.appendChild(newItem);
  saveCurrentData();
}

// Remove experience entry
function removeExperience(button) {
  const item = button.closest('.experience-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.experience-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
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
  });
  
  container.appendChild(newItem);
  saveCurrentData();
}

// Remove education entry
function removeEducation(button) {
  const item = button.closest('.education-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.education-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
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
  });
  
  container.appendChild(newItem);
  saveCurrentData();
}

// Remove project entry
function removeProject(button) {
  const item = button.closest('.project-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.project-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
  }
}

// Add certification entry
function addCertification() {
  const container = document.getElementById('certificationsContainer');
  const template = container.querySelector('.certifications-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input').forEach(input => {
    input.value = '';
  });
  
  container.appendChild(newItem);
  saveCurrentData();
}

// Remove certification entry
function removeCertification(button) {
  const item = button.closest('.certifications-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.certifications-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
  }
}

// Add language entry
function addLanguage() {
  const container = document.getElementById('languagesContainer');
  const template = container.querySelector('.languages-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, select').forEach(input => {
    input.value = '';
  });
  
  container.appendChild(newItem);
  saveCurrentData();
}

// Remove language entry
function removeLanguage(button) {
  const item = button.closest('.languages-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.languages-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
  }
}

// Add achievement entry
function addAchievement() {
  const container = document.getElementById('achievementsContainer');
  const template = container.querySelector('.achievements-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, textarea').forEach(input => {
    input.value = '';
  });
  
  container.appendChild(newItem);
  saveCurrentData();
}

// Remove achievement entry
function removeAchievement(button) {
  const item = button.closest('.achievements-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.achievements-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
  }
}

// Add rated skill
function addRatedSkill() {
  const container = document.getElementById('ratedSkillsContainer');
  const template = container.querySelector('.rated-skill-item');
  const newItem = template.cloneNode(true);
  
  // Clear input values
  newItem.querySelectorAll('input, select').forEach(input => {
    input.value = '';
  });
  
  container.appendChild(newItem);
  saveCurrentData();
}

// Remove rated skill
function removeRatedSkill(button) {
  const item = button.closest('.rated-skill-item');
  const container = item.parentElement;
  
  // Don't remove if it's the only item
  if (container.querySelectorAll('.rated-skill-item').length > 1) {
    container.removeChild(item);
    saveCurrentData();
  }
} 