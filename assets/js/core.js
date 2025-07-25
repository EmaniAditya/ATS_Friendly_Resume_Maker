// Constants for localStorage
const VERSIONS_KEY = 'ats_resume_versions';
const CURRENT_DATA_KEY = 'ats_resume_current_data';

// Show loading spinner
function showLoading() {
  document.getElementById('loadingSpinner').style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
  document.getElementById('loadingSpinner').style.display = 'none';
}

// Show toast notification with type
function showToast(message, type = 'success') {
  const toastElement = document.getElementById('toastNotification');
  const toastBody = toastElement.querySelector('.toast-body');
  toastBody.textContent = message;
  
  // Set toast color based on type
  const toastHeader = toastElement.querySelector('.toast-header');
  toastHeader.className = 'toast-header';
  
  if (type === 'error') {
    toastHeader.classList.add('bg-danger', 'text-white');
  } else if (type === 'warning') {
    toastHeader.classList.add('bg-warning');
  } else {
    toastHeader.classList.add('bg-success', 'text-white');
  }
  
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Load sample data into the form
function loadSampleData() {
  // Only load sample if there's no existing data in localStorage
  if (!localStorage.getItem(CURRENT_DATA_KEY)) {
    populateFormData(SAMPLE_RESUME_DATA);
    generateResume();
    showToast("Sample resume loaded! Edit to customize your own resume.");
  }
}

// Helper function to populate multi-item sections
function populateMultiItemSection(sectionType, items) {
  if (!items || !items.length) return;
  
  // Get container
  const container = document.getElementById(`${sectionType}Container`);
  if (!container) return;
  
  // Get the first item template
  let itemClass = `${sectionType}-item`;
  // Handle plural forms for consistency
  if (sectionType === 'certifications') itemClass = 'certifications-item';
  if (sectionType === 'languages') itemClass = 'languages-item';
  if (sectionType === 'achievements') itemClass = 'achievements-item';
  
  const firstItem = container.querySelector(`.${itemClass}`);
  if (!firstItem) return;
  
  // Clear the container
  container.innerHTML = '';
  
  // Add and populate items
  items.forEach((itemData, index) => {
    // For the first item, clone the template
    if (index === 0) {
      const clonedItem = firstItem.cloneNode(true);
      container.appendChild(clonedItem);
      populateItemFields(clonedItem, itemData);
    } else {
      // For additional items, use the appropriate add function
      switch(sectionType) {
        case 'experience':
          addExperience();
          break;
        case 'education':
          addEducation();
          break;
        case 'certifications':
          addCertification();
          break;
        case 'projects':
          addProject();
          break;
        case 'languages':
          addLanguage();
          break;
        case 'achievements':
          addAchievement();
          break;
        case 'ratedSkills':
          addRatedSkill();
          break;
      }
      
      // Populate the newly added item
      const newItem = container.lastElementChild;
      populateItemFields(newItem, itemData);
    }
  });
}

// Helper function to populate fields in an item
function populateItemFields(item, data) {
  if (!item || !data) return;
  
  // Get all input, select, and textarea elements
  const inputs = item.querySelectorAll('input, select, textarea');
  
  // For each input, find the corresponding data
  inputs.forEach(input => {
    const classList = input.className.split(' ');
    
    // Find the relevant class name (not form-control, form-select, etc.)
    const className = classList.find(cls => 
      !cls.includes('form-') && 
      cls !== 'input-group' && 
      cls !== 'form-check-input'
    );
    
    if (className) {
      // Convert camelCase to snake_case for data lookup
      const dataKey = className.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
      
      if (data[dataKey] !== undefined) {
        if (input.tagName === 'SELECT') {
          // For select elements, set the value and trigger change event
          input.value = data[dataKey] || '';
          
          // Create and dispatch change event
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
        } else {
          // For regular inputs and textareas
          input.value = data[dataKey] || '';
        }
      }
    }
  });
}

// Populate form data from object
function populateFormData(data) {
  if (!data) return;
  
  // Populate simple fields
  document.getElementById('fullName').value = data.fullName || '';
  document.getElementById('jobTitle').value = data.jobTitle || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('github').value = data.github || '';
  document.getElementById('website').value = data.website || '';
  document.getElementById('location').value = data.location || '';
  document.getElementById('dob').value = data.dob || '';
  document.getElementById('summary').value = data.summary || '';
  document.getElementById('skills').value = data.skills || '';
  
  // Set template
  const templateSelect = document.getElementById('template');
  if (templateSelect) {
    templateSelect.value = data.template || 'classic';
  }
  
  // Populate multi-item sections
  if (data.experience && data.experience.length > 0) {
    populateMultiItemSection('experience', data.experience);
  }
  
  if (data.education && data.education.length > 0) {
    populateMultiItemSection('education', data.education);
  }
  
  if (data.projects && data.projects.length > 0) {
    populateMultiItemSection('projects', data.projects);
  }
  
  if (data.certifications && data.certifications.length > 0) {
    populateMultiItemSection('certifications', data.certifications);
  }
  
  if (data.languages && data.languages.length > 0) {
    populateMultiItemSection('languages', data.languages);
  }
  
  if (data.achievements && data.achievements.length > 0) {
    populateMultiItemSection('achievements', data.achievements);
  }
  
  if (data.ratedSkills && data.ratedSkills.length > 0) {
    populateMultiItemSection('ratedSkill', data.ratedSkills);
  }
  
  // Populate section order
  if (data.sectionOrder && data.sectionOrder.length > 0) {
    const sectionOrderList = document.getElementById('sectionOrder');
    if (sectionOrderList) {
      sectionOrderList.innerHTML = '';
      data.sectionOrder.forEach(section => {
        let sectionName = section;
        switch (section) {
          case 'summary': sectionName = 'Summary'; break;
          case 'skills': sectionName = 'Skills'; break;
          case 'experience': sectionName = 'Experience'; break;
          case 'education': sectionName = 'Education'; break;
          case 'projects': sectionName = 'Projects'; break;
          case 'certifications': sectionName = 'Certifications'; break;
          case 'languages': sectionName = 'Languages'; break;
          case 'achievements': sectionName = 'Achievements & Honors'; break;
        }
        
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.section = section;
        li.textContent = sectionName;
        sectionOrderList.appendChild(li);
      });
      
      // Reinitialize sortable
      new Sortable(sectionOrderList, {
        animation: 150,
        ghostClass: 'bg-light',
        onEnd: function() {
          saveCurrentData();
          generateResume();
        }
      });
    }
  }
  
  // Generate resume preview
  generateResume();
}

// Collect form data into object
function collectFormData() {
  const data = {
    fullName: document.getElementById('fullName')?.value || '',
    jobTitle: document.getElementById('jobTitle')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    email: document.getElementById('email')?.value || '',
    github: document.getElementById('github')?.value || '',
    website: document.getElementById('website')?.value || '',
    location: document.getElementById('location')?.value || '',
    dob: document.getElementById('dob')?.value || '',
    summary: document.getElementById('summary')?.value || '',
    skills: '',
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    ratedSkills: [],
    template: document.getElementById('template')?.value || 'classic',
    sectionOrder: []
  };
  
  // Collect skills
  const technicalSkills = document.getElementById('technicalSkills')?.value || '';
  const softSkills = document.getElementById('softSkills')?.value || '';
  
  if (technicalSkills && softSkills) {
    data.skills = `Technical Skills:\n${technicalSkills}\n\nSoft Skills:\n${softSkills}`;
  } else if (technicalSkills) {
    data.skills = `Technical Skills:\n${technicalSkills}`;
  } else if (softSkills) {
    data.skills = `Soft Skills:\n${softSkills}`;
  }
  
  // Collect rated skills
  const ratedSkillItems = document.querySelectorAll('#ratedSkillsContainer .rated-skill-item');
  ratedSkillItems.forEach(item => {
    const skillName = item.querySelector('.skillName')?.value || '';
    const skillRating = item.querySelector('.skillRating')?.value || '';
    
    if (skillName) {
      data.ratedSkills.push({
        skill_name: skillName,
        skill_rating: skillRating
      });
    }
  });
  
  // Collect experience items
  const experienceItems = document.querySelectorAll('#experienceContainer .experience-item');
  experienceItems.forEach(item => {
    const company = item.querySelector('.company')?.value || '';
    const title = item.querySelector('.title')?.value || '';
    const startDate = item.querySelector('.startDate')?.value || '';
    const endDate = item.querySelector('.endDate')?.value || '';
    const description = item.querySelector('.description')?.value || '';
    const location = item.querySelector('.experienceLocation')?.value || '';
    
    if (company || title || startDate || endDate || description) {
      data.experience.push({
        company_name: company,
        job_title: title,
        start_date: startDate,
        end_date: endDate,
        description: description,
        location: location
      });
    }
  });
  
  // Collect education items
  const educationItems = document.querySelectorAll('#educationContainer .education-item');
  educationItems.forEach(item => {
    const institution = item.querySelector('.institution')?.value || '';
    const degree = item.querySelector('.degree')?.value || '';
    const startDate = item.querySelector('.educationStartDate')?.value || '';
    const endDate = item.querySelector('.educationEndDate')?.value || '';
    const gpa = item.querySelector('.gpa')?.value || '';
    const scoreType = item.querySelector('.scoreType')?.value || '';
    const location = item.querySelector('.educationLocation')?.value || '';
    
    if (institution || degree || startDate || endDate) {
      data.education.push({
        school_name: institution,
        degree: degree,
        education_start_date: startDate,
        education_end_date: endDate,
        gpa: gpa,
        score_type: scoreType,
        education_location: location
      });
    }
  });
  
  // Collect project items
  const projectItems = document.querySelectorAll('#projectsContainer .project-item');
  projectItems.forEach(item => {
    const name = item.querySelector('.projectName')?.value || '';
    const description = item.querySelector('.projectDescription')?.value || '';
    const technologies = item.querySelector('.projectTechnologies')?.value || '';
    const link = item.querySelector('.projectLink')?.value || '';
    const github = item.querySelector('.projectGithub')?.value || '';
    
    if (name || description || technologies) {
      data.projects.push({
        project_name: name,
        project_description: description,
        project_technologies: technologies,
        project_link: link,
        project_github: github
      });
    }
  });
  
  // Collect certification items
  const certificationItems = document.querySelectorAll('#certificationsContainer .certifications-item');
  certificationItems.forEach(item => {
    const name = item.querySelector('.certificationName')?.value || '';
    const org = item.querySelector('.certificationOrg')?.value || '';
    const date = item.querySelector('.certificationDate')?.value || '';
    const expiration = item.querySelector('.certificationExpiration')?.value || '';
    const credentialId = item.querySelector('.credentialID')?.value || '';
    
    if (name || org || date) {
      data.certifications.push({
        certification_name: name,
        certification_org: org,
        certification_date: date,
        certification_expiration: expiration,
        credential_id: credentialId
      });
    }
  });
  
  // Collect language items
  const languageItems = document.querySelectorAll('#languagesContainer .languages-item');
  languageItems.forEach(item => {
    const language = item.querySelector('.language')?.value || '';
    const proficiency = item.querySelector('.proficiency')?.value || '';
    
    if (language) {
      data.languages.push({
        language: language,
        proficiency: proficiency
      });
    }
  });
  
  // Collect achievement items
  const achievementItems = document.querySelectorAll('#achievementsContainer .achievements-item');
  achievementItems.forEach(item => {
    const title = item.querySelector('.achievementTitle')?.value || '';
    const date = item.querySelector('.achievementDate')?.value || '';
    const description = item.querySelector('.achievementDescription')?.value || '';
    
    if (title || description) {
      data.achievements.push({
        achievement_title: title,
        achievement_date: date,
        achievement_description: description
      });
    }
  });
  
  // Collect section order
  const sectionOrderItems = document.querySelectorAll('#sectionOrder li');
  sectionOrderItems.forEach(item => {
    data.sectionOrder.push(item.dataset.section);
  });
  
  return data;
}

// Save current form data to localStorage
function saveCurrentData() {
  const data = collectFormData();
  localStorage.setItem(CURRENT_DATA_KEY, JSON.stringify(data));
}

// Get saved versions from localStorage
function getVersions() {
  const versionsJson = localStorage.getItem(VERSIONS_KEY);
  return versionsJson ? JSON.parse(versionsJson) : [];
}

// Save a version of the current resume data
function saveVersion(name, showNotification = true) {
  try {
    // Get current data
    const currentData = collectFormData();
    
    // Get existing versions
    const versions = getVersions();
    
    // Create new version
    const newVersion = {
      id: Date.now().toString(),
      name: name || `Version ${versions.length + 1}`,
      date: new Date().toISOString(),
      data: currentData
    };
    
    // Add to versions array
    versions.push(newVersion);
    
    // Save to localStorage
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
    
    // Show success message if requested
    if (showNotification) {
      showToast(`Version "${newVersion.name}" saved successfully!`);
    }
    
    return newVersion.id;
  } catch (error) {
    console.error('Error saving version:', error);
    showToast('Error saving version. Please try again.', 'error');
    return null;
  }
}

// Save a named version
function saveNamedVersion() {
  const nameInput = document.getElementById('versionName');
  if (!nameInput) {
    console.error('Version name input not found');
    showToast('Error saving version. Please try again.', 'error');
    return;
  }
  
  const name = nameInput.value.trim();
  
  if (!name) {
    showToast('Please enter a version name', 'warning');
    return;
  }
  
  try {
    // Save the version without showing notification (we'll show our own)
    const versionId = saveVersion(name, false);
    
    if (versionId) {
      // Show success message
      showToast(`Version "${name}" saved successfully!`);
      
      // Clear input
      nameInput.value = '';
      
      // Close modal
      const saveVersionModal = document.getElementById('saveVersionModal');
      if (saveVersionModal) {
        const bsModal = bootstrap.Modal.getInstance(saveVersionModal);
        if (bsModal) {
          bsModal.hide();
        }
      }
    }
  } catch (error) {
    console.error('Error in saveNamedVersion:', error);
    showToast('Error saving version. Please try again.', 'error');
  }
}

// Load a specific version
function loadVersion(versionId) {
  const versions = getVersions();
  const version = versions.find(v => v.id === versionId);
  
  if (version) {
    try {
      // Populate form with version data
      populateFormData(version.data);
      
      // Generate the resume preview
      if (typeof generateResume === 'function') {
        generateResume();
      }
      
      // Close the modal
      const versionsModal = document.getElementById('versionsModal');
      if (versionsModal) {
        const modal = bootstrap.Modal.getInstance(versionsModal);
        if (modal) {
          modal.hide();
        } else {
          // If we can't get the instance, try to use the data API
          const bsModal = new bootstrap.Modal(versionsModal);
          bsModal.hide();
        }
      }
      
      // Show success message
      showToast(`Loaded resume version: "${version.name}"`);
      
      return true;
    } catch (error) {
      console.error('Error loading version:', error);
      // Don't show error toast here as the data was already populated successfully
      // If we get here, the version loaded but there was a minor error elsewhere
      return true;
    }
  } else {
    showToast('Version not found', 'error');
    return false;
  }
}

// Delete a version
function deleteVersion(versionId) {
  try {
    const versions = getVersions();
    const versionToDelete = versions.find(v => v.id === versionId);
    
    if (!versionToDelete) {
      showToast('Version not found', 'error');
      return;
    }
    
    const versionName = versionToDelete.name;
    const updatedVersions = versions.filter(v => v.id !== versionId);
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updatedVersions));
    
    // Show success message
    showToast(`Version "${versionName}" deleted successfully`);
    
    // Refresh versions list
    if (updatedVersions.length === 0) {
      // If no versions left, close the modal
      const versionsModal = document.getElementById('versionsModal');
      if (versionsModal) {
        const modal = bootstrap.Modal.getInstance(versionsModal);
        if (modal) {
          modal.hide();
        }
      }
    } else {
      // Otherwise refresh the list
      showVersionsModal();
    }
  } catch (error) {
    console.error('Error deleting version:', error);
    showToast('Error deleting version. Please try again.', 'error');
  }
}

// Show versions modal with current versions
function showVersionsModal() {
  try {
    // Get the modal element
    const versionsModalElement = document.getElementById('versionsModal');
    if (!versionsModalElement) {
      console.error('Versions modal element not found');
      return;
    }
    
    // Get the content container
    const versionsModalContent = document.getElementById('versionsModalContent');
    if (!versionsModalContent) {
      console.error('Versions modal content element not found');
      return;
    }
    
    // Get versions from localStorage
    const versions = getVersions();
    
    // Clear previous content
    versionsModalContent.innerHTML = '';
    
    if (versions.length === 0) {
      versionsModalContent.innerHTML = '<p class="text-center text-muted">No saved versions yet</p>';
    } else {
      // Create table
      const table = document.createElement('table');
      table.className = 'table table-hover';
      
      // Create table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      `;
      table.appendChild(thead);
      
      // Create table body
      const tbody = document.createElement('tbody');
      versions.forEach(version => {
        const tr = document.createElement('tr');
        const date = new Date(version.date);
        tr.innerHTML = `
          <td>${version.name}</td>
          <td>${date.toLocaleString()}</td>
          <td>
            <button type="button" class="btn btn-sm btn-primary load-version" data-version-id="${version.id}">Load</button>
            <button type="button" class="btn btn-sm btn-danger delete-version" data-version-id="${version.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      versionsModalContent.appendChild(table);
      
      // Add event listeners
      const loadButtons = versionsModalContent.querySelectorAll('.load-version');
      loadButtons.forEach(button => {
        button.addEventListener('click', () => {
          const versionId = button.dataset.versionId;
          loadVersion(versionId);
        });
      });
      
      const deleteButtons = versionsModalContent.querySelectorAll('.delete-version');
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          const versionId = button.dataset.versionId;
          deleteVersion(versionId);
        });
      });
    }
    
    // Close any existing modal first
    const existingModal = bootstrap.Modal.getInstance(versionsModalElement);
    if (existingModal) {
      existingModal.dispose();
    }
    
    // Create and show new modal
    const versionsModal = new bootstrap.Modal(versionsModalElement);
    versionsModal.show();
  } catch (error) {
    console.error('Error showing versions modal:', error);
    showToast('Error showing versions. Please try again.', 'error');
  }
}

// Open the save version modal, closing any other modals first
function openSaveVersionModal() {
  try {
    // First, close the versions modal if it's open
    const versionsModalElement = document.getElementById('versionsModal');
    if (versionsModalElement) {
      const versionsModal = bootstrap.Modal.getInstance(versionsModalElement);
      if (versionsModal) {
        versionsModal.hide();
      }
    }
    
    // Wait a bit for the modal to close
    setTimeout(() => {
      // Then open the save version modal
      const saveVersionModalElement = document.getElementById('saveVersionModal');
      if (saveVersionModalElement) {
        const saveVersionModal = new bootstrap.Modal(saveVersionModalElement);
        saveVersionModal.show();
      } else {
        console.error('Save version modal element not found');
      }
    }, 300); // Short delay to allow the first modal to close
  } catch (error) {
    console.error('Error opening save version modal:', error);
    showToast('Error opening save version modal. Please try again.', 'error');
  }
}

// Setup auto-save functionality
function setupAutoSave() {
  // Debounce function to limit how often the save function is called
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
  
  // Debounced save function
  const debouncedSave = debounce(() => {
    saveCurrentData();
  }, 500); // 500ms delay
  
  // Add event listeners to all form inputs
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('input', debouncedSave);
    input.addEventListener('change', debouncedSave);
  });
}

// Clear all form data
function clearForm() {
  if (confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
    // Get all input, select, and textarea elements
    const inputs = document.querySelectorAll('input:not([type="checkbox"]), textarea, select');
    
    // Clear each input
    inputs.forEach(input => {
      input.value = '';
    });
    
    // Reset checkboxes to default
    document.getElementById('compactMode').checked = true;
    
    // Clear multi-item sections except for the first item in each
    const containers = [
      'experienceContainer',
      'educationContainer',
      'certificationsContainer',
      'projectsContainer',
      'languagesContainer',
      'achievementsContainer'
    ];
    
    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        const items = container.querySelectorAll(`.${containerId.replace('Container', '')}-item`);
        
        // Keep only the first item and clear its fields
        if (items.length > 0) {
          const firstItem = items[0];
          
          // Clear fields in the first item
          const firstItemInputs = firstItem.querySelectorAll('input, textarea, select');
          firstItemInputs.forEach(input => {
            input.value = '';
          });
          
          // Remove additional items
          for (let i = 1; i < items.length; i++) {
            container.removeChild(items[i]);
          }
        }
      }
    });
    
    // Clear rated skills container
    const ratedSkillsContainer = document.getElementById('ratedSkillsContainer');
    if (ratedSkillsContainer) {
      const firstSkill = ratedSkillsContainer.querySelector('.rated-skill-item');
      if (firstSkill) {
        // Clear the first skill's fields
        const inputs = firstSkill.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.value = '';
        });
        
        // Remove additional skills
        while (ratedSkillsContainer.children.length > 1) {
          ratedSkillsContainer.removeChild(ratedSkillsContainer.lastChild);
        }
      }
    }
    
    // Reset section order to default
    const sectionOrderList = document.getElementById('sectionOrder');
    if (sectionOrderList) {
      sectionOrderList.innerHTML = `
        <li class="list-group-item" data-section="summary">Summary</li>
        <li class="list-group-item" data-section="skills">Skills</li>
        <li class="list-group-item" data-section="experience">Experience</li>
        <li class="list-group-item" data-section="education">Education</li>
        <li class="list-group-item" data-section="projects">Projects</li>
        <li class="list-group-item" data-section="certifications">Certifications</li>
        <li class="list-group-item" data-section="languages">Languages</li>
        <li class="list-group-item" data-section="achievements">Achievements & Honors</li>
      `;
      
      // Reinitialize sortable
      new Sortable(sectionOrderList, {
        animation: 150,
        ghostClass: 'bg-light',
        onEnd: function() {
          saveCurrentData();
        }
      });
    }
    
    // Generate empty preview
    generateResume();
    
    // Clear localStorage current data
    localStorage.removeItem(CURRENT_DATA_KEY);
    
    showToast('Form has been cleared successfully');
  }
}

// Export all data to JSON file
function exportData() {
  // Get all versions and current data
  const versions = getVersions();
  const currentData = localStorage.getItem(CURRENT_DATA_KEY);
  
  const exportData = {
    versions: versions,
    currentData: currentData ? JSON.parse(currentData) : null,
    exportDate: new Date().toISOString()
  };
  
  // Convert to JSON string
  const jsonString = JSON.stringify(exportData, null, 2);
  
  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `ATS_Resume_Data_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Resume data exported successfully');
}

// Import data from JSON file
function importData() {
  const fileInput = document.getElementById('importFileInput');
  
  if (fileInput.files.length === 0) {
    showToast('Please select a file to import', 'error');
    return;
  }
  
  showLoading();
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      let isValidFormat = false;
      
      // Validate imported data
      // Check if the file has either versions or currentData
      if (importedData.versions || importedData.currentData) {
        isValidFormat = true;
      } else {
        // Check if the file is just a resume data object itself
        // Look for common properties that would be in resume data
        if (importedData.fullName !== undefined || 
            importedData.experience !== undefined || 
            importedData.education !== undefined) {
          // Treat the entire JSON as currentData
          isValidFormat = true;
          importedData.currentData = importedData;
        }
      }
      
      if (!isValidFormat) {
        throw new Error('Invalid import file format');
      }
      
      // Confirm before overwriting
      if (confirm('Importing will overwrite your current data. Continue?')) {
        try {
          // Import versions
          if (importedData.versions && Array.isArray(importedData.versions)) {
            localStorage.setItem(VERSIONS_KEY, JSON.stringify(importedData.versions));
          }
          
          // Import current data
          if (importedData.currentData) {
            localStorage.setItem(CURRENT_DATA_KEY, JSON.stringify(importedData.currentData));
            populateFormData(importedData.currentData);
          }
          
          // Generate resume preview
          generateResume();
          
          showToast('Data imported successfully');
          
          // Close the modal
          const importModal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
          if (importModal) {
            importModal.hide();
          }
          
          return; // Successfully imported, exit the function
        } catch (innerError) {
          console.error('Error during import process:', innerError);
          // Don't show error here, will be handled in outer catch
          throw innerError;
        }
      }
    } catch (error) {
      console.error('Import error:', error);
      showToast('Error importing data: Invalid file format', 'error');
    }
    
    // Clear file input
    fileInput.value = '';
    hideLoading();
  };
  
  reader.onerror = function() {
    showToast('Error reading file', 'error');
    fileInput.value = '';
    hideLoading();
  };
  
  reader.readAsText(file);
} 