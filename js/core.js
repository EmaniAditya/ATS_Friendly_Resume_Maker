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
  const firstItem = container.querySelector(`.${sectionType}-item`);
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
        case 'ratedSkill':
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
    fullName: document.getElementById('fullName').value,
    jobTitle: document.getElementById('jobTitle').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    github: document.getElementById('github').value,
    website: document.getElementById('website').value,
    location: document.getElementById('location').value,
    dob: document.getElementById('dob').value,
    summary: document.getElementById('summary').value,
    skills: document.getElementById('skills').value,
    template: document.getElementById('template').value,
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    ratedSkills: [],
    sectionOrder: []
  };
  
  // Collect multi-item sections
  // Experience
  const experienceItems = document.querySelectorAll('.experience-item');
  experienceItems.forEach(item => {
    const expData = {
      company_name: item.querySelector('.companyName').value,
      job_title: item.querySelector('.jobTitle').value,
      start_date: item.querySelector('.startDate').value,
      end_date: item.querySelector('.endDate').value,
      location: item.querySelector('.location').value,
      description: item.querySelector('.description').value
    };
    
    // Only add if at least company name or job title is provided
    if (expData.company_name || expData.job_title) {
      data.experience.push(expData);
    }
  });
  
  // Education
  const educationItems = document.querySelectorAll('.education-item');
  educationItems.forEach(item => {
    const eduData = {
      school_name: item.querySelector('.schoolName').value,
      degree: item.querySelector('.degree').value,
      education_start_date: item.querySelector('.educationStartDate')?.value || '',
      education_end_date: item.querySelector('.educationEndDate')?.value || '',
      education_location: item.querySelector('.educationLocation')?.value || '',
      gpa: item.querySelector('.gpa')?.value || '',
      score_type: item.querySelector('.scoreType')?.value || 'none'
    };
    
    // Only add if at least school name or degree is provided
    if (eduData.school_name || eduData.degree) {
      data.education.push(eduData);
    }
  });
  
  // Projects
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    const projData = {
      project_name: item.querySelector('.projectName').value,
      project_description: item.querySelector('.projectDescription').value,
      project_technologies: item.querySelector('.projectTechnologies').value,
      project_link: item.querySelector('.projectLink').value,
      project_github: item.querySelector('.projectGithub').value
    };
    
    // Only add if at least project name is provided
    if (projData.project_name) {
      data.projects.push(projData);
    }
  });
  
  // Certifications
  const certificationItems = document.querySelectorAll('.certifications-item');
  certificationItems.forEach(item => {
    const certData = {
      certification_name: item.querySelector('.certificationName')?.value || '',
      certification_org: item.querySelector('.certificationOrg')?.value || '',
      certification_date: item.querySelector('.certificationDate')?.value || '',
      certification_expiration: item.querySelector('.certificationExpiration')?.value || '',
      credential_id: item.querySelector('.credentialID')?.value || ''
    };
    
    // Only add if at least certification name is provided
    if (certData.certification_name) {
      data.certifications.push(certData);
    }
  });
  
  // Languages
  const languageItems = document.querySelectorAll('.languages-item');
  languageItems.forEach(item => {
    const langData = {
      language: item.querySelector('.language')?.value || '',
      proficiency: item.querySelector('.proficiency')?.value || ''
    };
    
    // Only add if language is provided
    if (langData.language) {
      data.languages.push(langData);
    }
  });
  
  // Achievements
  const achievementItems = document.querySelectorAll('.achievements-item');
  achievementItems.forEach(item => {
    const achieveData = {
      achievement_title: item.querySelector('.achievementTitle')?.value || '',
      achievement_date: item.querySelector('.achievementDate')?.value || '',
      achievement_description: item.querySelector('.achievementDescription')?.value || ''
    };
    
    // Only add if title or description is provided
    if (achieveData.achievement_title || achieveData.achievement_description) {
      data.achievements.push(achieveData);
    }
  });
  
  // Rated Skills
  const ratedSkillItems = document.querySelectorAll('.rated-skill-item');
  ratedSkillItems.forEach(item => {
    const skillData = {
      skill_name: item.querySelector('.skillName')?.value || '',
      skill_rating: item.querySelector('.skillRating')?.value || ''
    };
    
    // Only add if skill name is provided
    if (skillData.skill_name) {
      data.ratedSkills.push(skillData);
    }
  });
  
  // Section Order
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

// Save a version with auto-generated name
function saveVersion(name) {
  const data = collectFormData();
  const versions = getVersions();
  
  const newVersion = {
    id: Date.now().toString(),
    name: name || `Resume - ${new Date().toLocaleString()}`,
    date: new Date().toISOString(),
    data: data
  };
  
  versions.push(newVersion);
  localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
  
  // Track version save
  if (typeof trackFeatureUsage === 'function') {
    trackFeatureUsage('versionSave');
  }
  
  return newVersion;
}

// Save a named version
function saveNamedVersion() {
  const nameInput = document.getElementById('versionName');
  const name = nameInput.value.trim();
  
  if (!name) {
    showToast('Please enter a version name', 'error');
    return;
  }
  
  const newVersion = saveVersion(name);
  showToast(`Version "${name}" saved successfully`);
  
  // Close modal
  const saveVersionModal = bootstrap.Modal.getInstance(document.getElementById('saveVersionModal'));
  if (saveVersionModal) {
    saveVersionModal.hide();
  }
  
  // Clear input
  nameInput.value = '';
  
  return newVersion;
}

// Load a specific version
function loadVersion(versionId) {
  const versions = getVersions();
  const version = versions.find(v => v.id === versionId);
  
  if (version) {
    populateFormData(version.data);
    
    // Close the modal
    const versionsModal = bootstrap.Modal.getInstance(document.getElementById('versionsModal'));
    if (versionsModal) {
      versionsModal.hide();
    }
    
    // Show success message
    showToast(`Loaded resume version: "${version.name}"`);
    
    // Track version load
    if (typeof trackFeatureUsage === 'function') {
      trackFeatureUsage('versionLoad');
    }
    
    return true;
  }
  
  return false;
}

// Delete a version
function deleteVersion(versionId) {
  if (confirm('Are you sure you want to delete this version?')) {
    const versions = getVersions();
    const updatedVersions = versions.filter(v => v.id !== versionId);
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updatedVersions));
    
    // Show success message
    showToast('Version deleted successfully');
    
    // Refresh versions list
    showVersionsModal();
  }
}

// Show versions modal with current versions
function showVersionsModal() {
  const versions = getVersions();
  const versionsBody = document.getElementById('versionsBody');
  
  if (versionsBody) {
    // Clear previous content
    versionsBody.innerHTML = '';
    
    if (versions.length === 0) {
      versionsBody.innerHTML = '<p class="text-center text-muted">No saved versions yet</p>';
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
      versionsBody.appendChild(table);
      
      // Add event listeners
      const loadButtons = versionsBody.querySelectorAll('.load-version');
      loadButtons.forEach(button => {
        button.addEventListener('click', () => {
          const versionId = button.dataset.versionId;
          loadVersion(versionId);
        });
      });
      
      const deleteButtons = versionsBody.querySelectorAll('.delete-version');
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          const versionId = button.dataset.versionId;
          deleteVersion(versionId);
        });
      });
    }
  }
  
  // Show modal
  const versionsModal = new bootstrap.Modal(document.getElementById('versionsModal'));
  versionsModal.show();
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
      
      // Validate imported data
      if (!importedData.versions && !importedData.currentData) {
        throw new Error('Invalid import file format');
      }
      
      // Confirm before overwriting
      if (confirm('Importing will overwrite your current data. Continue?')) {
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