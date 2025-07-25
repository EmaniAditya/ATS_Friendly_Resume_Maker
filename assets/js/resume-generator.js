// Generate resume preview based on form data
function generateResume() {
  const preview = document.getElementById("resumePreview");
  const data = collectFormData();
  
  // Save current data
  saveCurrentData();
  
  // Set template class
  preview.className = '';
  preview.classList.add(`template-${data.template}`);
  
  // Start building HTML
  let html = '';
  
  // Header with name and contact info
  html += `<h2>${data.fullName || 'Your Name'}</h2>`;
  
  // Job title and contact info
  html += '<div class="contact-info">';
  if (data.jobTitle) {
    html += `<p class="text-center">${data.jobTitle}</p>`;
  }
  
  // Contact details in a single line
  const contactDetails = [];
  if (data.phone) contactDetails.push(data.phone);
  if (data.email) contactDetails.push(data.email);
  if (data.github) contactDetails.push(data.github);
  if (data.linkedin) contactDetails.push(data.linkedin);
  if (data.website) contactDetails.push(data.website);
  if (data.location) contactDetails.push(data.location);
  if (data.dob) contactDetails.push(`(DOB: ${data.dob})`);
  
  if (contactDetails.length > 0) {
    html += `<p class="text-center">${contactDetails.join(' | ')}</p>`;
  }
  
  html += '</div>';
  
  // Get section order
  const sectionOrder = data.sectionOrder.length > 0 ? data.sectionOrder : [
    'summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages', 'achievements'
  ];
  
  // Generate each section based on the order
  sectionOrder.forEach(section => {
    switch (section) {
      case 'summary':
        if (data.summary) {
          html += '<h4>SUMMARY</h4>';
          html += `<p>${data.summary}</p>`;
        }
        break;
        
      case 'skills':
        if (data.skills) {
          html += '<h4>SKILLS</h4>';
          
          // Check if there are rated skills
          if (data.ratedSkills && data.ratedSkills.length > 0) {
            html += '<div class="rated-skills">';
            data.ratedSkills.forEach(skill => {
              if (skill.skill_name) {
                let stars = '';
                const rating = parseInt(skill.skill_rating) || 0;
                for (let i = 0; i < 5; i++) {
                  stars += i < rating ? '★' : '☆';
                }
                html += `<div class="rated-skill"><span class="skill-name">${skill.skill_name}</span> ${stars}</div>`;
              }
            });
            html += '</div>';
          }
          
          // Regular skills
          html += `<p>${data.skills.replace(/\n/g, '<br>')}</p>`;
        }
        break;
        
      case 'experience':
        if (data.experience && data.experience.length > 0) {
          html += '<h4>EXPERIENCE</h4>';
          data.experience.forEach(exp => {
            html += '<div class="experience-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${exp.job_title || 'Position'}</strong>`;
            if (exp.start_date || exp.end_date) {
              html += `<span>${exp.start_date || ''} - ${exp.end_date || ''}</span>`;
            }
            html += '</div>';
            html += '<div class="d-flex justify-content-between">';
            html += `<em>${exp.company_name || 'Company'}</em>`;
            if (exp.location) {
              html += `<span>${exp.location}</span>`;
            }
            html += '</div>';
            if (exp.description) {
              html += `<p>${exp.description.replace(/\n/g, '<br>')}</p>`;
            }
            html += '</div>';
          });
        }
        break;
        
      case 'education':
        if (data.education && data.education.length > 0) {
          html += '<h4>EDUCATION</h4>';
          data.education.forEach(edu => {
            html += '<div class="education-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${edu.degree || 'Degree'}</strong>`;
            if (edu.education_start_date || edu.education_end_date) {
              html += `<span>${edu.education_start_date || ''} - ${edu.education_end_date || ''}</span>`;
            }
            html += '</div>';
            html += '<div class="d-flex justify-content-between">';
            html += `<em>${edu.school_name || 'School'}</em>`;
            if (edu.education_location) {
              html += `<span>${edu.education_location}</span>`;
            }
            html += '</div>';
            if (edu.gpa && edu.score_type !== 'none') {
              html += `<p>${edu.score_type === 'percentage' ? 'Percentage' : 'GPA'}: ${edu.gpa}</p>`;
            }
            html += '</div>';
          });
        }
        break;
        
      case 'projects':
        if (data.projects && data.projects.length > 0) {
          html += '<h4>PROJECTS</h4>';
          data.projects.forEach(proj => {
            html += '<div class="project-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${proj.project_name || 'Project'}</strong>`;
            if (proj.project_technologies) {
              html += `<span>${proj.project_technologies}</span>`;
            }
            html += '</div>';
            
            // Project links
            if (proj.project_link || proj.project_github) {
              let links = [];
              if (proj.project_link) links.push(`<a href="#">${proj.project_link}</a>`);
              if (proj.project_github) links.push(`<a href="#">${proj.project_github}</a>`);
              html += `<p>${links.join(' | ')}</p>`;
            }
            
            if (proj.project_description) {
              html += `<p>${proj.project_description.replace(/\n/g, '<br>')}</p>`;
            }
            html += '</div>';
          });
        }
        break;
        
      case 'certifications':
        if (data.certifications && data.certifications.length > 0) {
          html += '<h4>CERTIFICATIONS</h4>';
          data.certifications.forEach(cert => {
            html += '<div class="certification-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${cert.certification_name || 'Certification'}</strong>`;
            if (cert.certification_date) {
              if (cert.certification_expiration) {
                html += `<span>${cert.certification_date} - ${cert.certification_expiration}</span>`;
              } else {
                html += `<span>${cert.certification_date}</span>`;
              }
            }
            html += '</div>';
            html += `<p><em>${cert.certification_org || ''}</em>`;
            if (cert.credential_id) {
              html += ` (ID: ${cert.credential_id})`;
            }
            html += '</p>';
            html += '</div>';
          });
        }
        break;
        
      case 'languages':
        if (data.languages && data.languages.length > 0) {
          html += '<h4>LANGUAGES</h4>';
          html += '<div class="languages-entry">';
          const languageList = data.languages.map(lang => {
            if (lang.proficiency) {
              return `${lang.language} (${lang.proficiency})`;
            } else {
              return lang.language;
            }
          }).filter(Boolean);
          
          html += `<p>${languageList.join(' • ')}</p>`;
          html += '</div>';
        }
        break;
        
      case 'achievements':
        if (data.achievements && data.achievements.length > 0) {
          html += '<h4>ACHIEVEMENTS & HONORS</h4>';
          data.achievements.forEach(achieve => {
            html += '<div class="achievement-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${achieve.achievement_title || 'Achievement'}</strong>`;
            if (achieve.achievement_date) {
              html += `<span>${achieve.achievement_date}</span>`;
            }
            html += '</div>';
            if (achieve.achievement_description) {
              html += `<p>${achieve.achievement_description}</p>`;
            }
            html += '</div>';
          });
        }
        break;
    }
  });
  
  // Set the HTML
  preview.innerHTML = html;
  
  // Check if content fits on one page
  checkPageOverflow();
}

// Check if content overflows the page and apply compact mode if needed
function checkPageOverflow() {
  const preview = document.getElementById('resumePreview');
  const pageWarning = document.getElementById('pageWarning');
  
  if (!preview) return;
  
  // Get the content height
  const contentHeight = preview.scrollHeight;
  // A4 height in pixels (assuming 96dpi)
  const a4Height = 1123; // 297mm at 96dpi
  
  // Remove existing compact modes
  document.body.classList.remove('compact-mode');
  document.body.classList.remove('extreme-compact-mode');
  
  // Check if compactMode checkbox is checked
  const compactMode = document.getElementById('compactMode');
  if (compactMode && compactMode.checked) {
    if (contentHeight > a4Height * 1.2) { // If content is significantly larger
      document.body.classList.add('extreme-compact-mode');
    } else if (contentHeight > a4Height) { // If content is slightly larger
      document.body.classList.add('compact-mode');
    }
  }
  
  // Show warning if content still overflows
  if (pageWarning) {
    if (preview.scrollHeight > preview.clientHeight) {
      pageWarning.style.display = 'block';
      pageWarning.textContent = 'Warning: Content exceeds one page. Enable compact mode or reduce content.';
    } else {
      pageWarning.style.display = 'none';
    }
  }
}

// Apply density setting with visual feedback
function applyDensitySetting(densityValue) {
  // Remove existing classes
  document.body.classList.remove('compact-mode');
  document.body.classList.remove('extreme-compact-mode');
  
  // Update active button state
  const densityButtons = document.querySelectorAll('.btn-group .btn');
  densityButtons.forEach((btn, index) => {
    btn.classList.remove('active');
    if (index === densityValue - 1) {
      btn.classList.add('active');
    }
  });
  
  // Apply appropriate class based on density setting
  if (densityValue === 2) {
    document.body.classList.add('compact-mode');
  } else if (densityValue === 3) {
    document.body.classList.add('extreme-compact-mode');
  }
  
  // Save current data with the new density setting
  saveCurrentData();
  
  // Check if content fits on one page
  setTimeout(checkPageOverflow, 100);
}

// Download resume as PDF
function downloadPDF() {
  showLoading();
  
  // Ensure the resume is generated first
  generateResume();
  
  try {
    // Get the resume preview element
    const element = document.getElementById('resumePreview');
    if (!element) {
      throw new Error('Resume preview element not found');
    }
    
    // Check if preview is empty
    if (element.innerHTML.trim() === '') {
      showToast('Please preview your resume before downloading', 'warning');
      hideLoading();
      return;
    }
    
    // Instead of creating a container, use the element directly with proper styling
    // This approach works better based on the previous version
    
    // Get filename
    const fullName = document.getElementById('fullName')?.value || 'Resume';
    const fileName = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    
    // PDF options - simplified based on the previous working implementation
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };
    
    // Use the simpler, direct method from the previous version
    html2pdf().set(opt).from(element).save().then(() => {
      hideLoading();
      showToast('PDF downloaded successfully!');
    }).catch(error => {
      console.error('Error generating PDF:', error);
      hideLoading();
      showToast('Error generating PDF. Please try again.', 'error');
    });
  } catch (error) {
    console.error('Error in PDF generation:', error);
    hideLoading();
    showToast('Error generating PDF. Please try again.', 'error');
  }
}

// Generate plain text version of the resume
function generatePlainText() {
  const data = collectFormData();
  let plainText = '';
  
  // Header with name and contact info
  plainText += `${data.fullName || 'Your Name'}\n`;
  if (data.jobTitle) {
    plainText += `${data.jobTitle}\n`;
  }
  
  // Contact details
  const contactDetails = [];
  if (data.phone) contactDetails.push(data.phone);
  if (data.email) contactDetails.push(data.email);
  if (data.github) contactDetails.push(data.github);
  if (data.linkedin) contactDetails.push(data.linkedin);
  if (data.website) contactDetails.push(data.website);
  if (data.location) contactDetails.push(data.location);
  if (data.dob) contactDetails.push(`DOB: ${data.dob}`);
  
  if (contactDetails.length > 0) {
    plainText += `${contactDetails.join(' | ')}\n\n`;
  }
  
  // Get section order
  const sectionOrder = data.sectionOrder.length > 0 ? data.sectionOrder : [
    'summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages', 'achievements'
  ];
  
  // Generate each section based on the order
  sectionOrder.forEach(section => {
    switch (section) {
      case 'summary':
        if (data.summary) {
          plainText += 'SUMMARY\n';
          plainText += '=======\n';
          plainText += `${data.summary}\n\n`;
        }
        break;
        
      case 'skills':
        if (data.skills) {
          plainText += 'SKILLS\n';
          plainText += '======\n';
          
          // Check if there are rated skills
          if (data.ratedSkills && data.ratedSkills.length > 0) {
            data.ratedSkills.forEach(skill => {
              if (skill.skill_name) {
                let stars = '';
                const rating = parseInt(skill.skill_rating) || 0;
                for (let i = 0; i < 5; i++) {
                  stars += i < rating ? '★' : '☆';
                }
                plainText += `${skill.skill_name} ${stars}\n`;
              }
            });
            plainText += '\n';
          }
          
          // Regular skills
          plainText += `${data.skills}\n\n`;
        }
        break;
        
      case 'experience':
        if (data.experience && data.experience.length > 0) {
          plainText += 'EXPERIENCE\n';
          plainText += '==========\n';
          data.experience.forEach(exp => {
            plainText += `${exp.job_title || 'Position'}\n`;
            plainText += `${exp.company_name || 'Company'}`;
            if (exp.start_date || exp.end_date) {
              plainText += ` | ${exp.start_date || ''} - ${exp.end_date || ''}`;
            }
            if (exp.location) {
              plainText += ` | ${exp.location}`;
            }
            plainText += '\n';
            if (exp.description) {
              plainText += `${exp.description}\n`;
            }
            plainText += '\n';
          });
        }
        break;
        
      case 'education':
        if (data.education && data.education.length > 0) {
          plainText += 'EDUCATION\n';
          plainText += '=========\n';
          data.education.forEach(edu => {
            plainText += `${edu.degree || 'Degree'}\n`;
            plainText += `${edu.school_name || 'School'}`;
            if (edu.education_start_date || edu.education_end_date) {
              plainText += ` | ${edu.education_start_date || ''} - ${edu.education_end_date || ''}`;
            }
            if (edu.education_location) {
              plainText += ` | ${edu.education_location}`;
            }
            plainText += '\n';
            if (edu.gpa && edu.score_type !== 'none') {
              plainText += `${edu.score_type === 'percentage' ? 'Percentage' : 'GPA'}: ${edu.gpa}\n`;
            }
            plainText += '\n';
          });
        }
        break;
        
      case 'projects':
        if (data.projects && data.projects.length > 0) {
          plainText += 'PROJECTS\n';
          plainText += '========\n';
          data.projects.forEach(proj => {
            plainText += `${proj.project_name || 'Project'}`;
            if (proj.project_technologies) {
              plainText += ` | ${proj.project_technologies}`;
            }
            plainText += '\n';
            
            // Project links
            if (proj.project_link || proj.project_github) {
              let links = [];
              if (proj.project_link) links.push(proj.project_link);
              if (proj.project_github) links.push(proj.project_github);
              plainText += `${links.join(' | ')}\n`;
            }
            
            if (proj.project_description) {
              plainText += `${proj.project_description}\n`;
            }
            plainText += '\n';
          });
        }
        break;
        
      case 'certifications':
        if (data.certifications && data.certifications.length > 0) {
          plainText += 'CERTIFICATIONS\n';
          plainText += '==============\n';
          data.certifications.forEach(cert => {
            plainText += `${cert.certification_name || 'Certification'}`;
            if (cert.certification_date) {
              if (cert.certification_expiration) {
                plainText += ` | ${cert.certification_date} - ${cert.certification_expiration}`;
              } else {
                plainText += ` | ${cert.certification_date}`;
              }
            }
            plainText += '\n';
            plainText += `${cert.certification_org || ''}`;
            if (cert.credential_id) {
              plainText += ` (ID: ${cert.credential_id})`;
            }
            plainText += '\n\n';
          });
        }
        break;
        
      case 'languages':
        if (data.languages && data.languages.length > 0) {
          plainText += 'LANGUAGES\n';
          plainText += '=========\n';
          const languageList = data.languages.map(lang => {
            if (lang.proficiency) {
              return `${lang.language} (${lang.proficiency})`;
            } else {
              return lang.language;
            }
          }).filter(Boolean);
          
          plainText += `${languageList.join(' • ')}\n\n`;
        }
        break;
        
      case 'achievements':
        if (data.achievements && data.achievements.length > 0) {
          plainText += 'ACHIEVEMENTS & HONORS\n';
          plainText += '=====================\n';
          data.achievements.forEach(achieve => {
            plainText += `${achieve.achievement_title || 'Achievement'}`;
            if (achieve.achievement_date) {
              plainText += ` | ${achieve.achievement_date}`;
            }
            plainText += '\n';
            if (achieve.achievement_description) {
              plainText += `${achieve.achievement_description}\n`;
            }
            plainText += '\n';
          });
        }
        break;
    }
  });
  
  return plainText;
}

// View plain text version
function viewPlainText() {
  const plainText = generatePlainText();
  const plainTextContent = document.getElementById('plainTextContent');
  if (plainTextContent) {
    plainTextContent.textContent = plainText;
  }
  const plainTextModal = new bootstrap.Modal(document.getElementById('plainTextModal'));
  plainTextModal.show();
}

// Download plain text version
function downloadPlainText() {
  const plainText = generatePlainText();
  const blob = new Blob([plainText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ATS_Friendly_Resume.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Track plain text download
  if (typeof trackFeatureUsage === 'function') {
    trackFeatureUsage('plainTextDownload');
  }
  
  showToast('Plain text resume downloaded successfully');
}

// Copy plain text to clipboard
function copyPlainText() {
  const plainTextContent = document.getElementById('plainTextContent');
  if (!plainTextContent) {
    showToast('Error copying text. Please try again.', 'error');
    return;
  }
  
  const text = plainTextContent.textContent;
  
  // Use modern Clipboard API if available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Plain text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback to older method
        fallbackCopyTextToClipboard(plainTextContent);
      });
  } else {
    // Fallback for browsers that don't support Clipboard API
    fallbackCopyTextToClipboard(plainTextContent);
  }
}

// Fallback method for copying text
function fallbackCopyTextToClipboard(element) {
  try {
    // Create a range and selection
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    // Execute copy command
    const successful = document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
    if (successful) {
      showToast('Plain text copied to clipboard');
    } else {
      showToast('Failed to copy text. Please try manually.', 'warning');
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showToast('Failed to copy text. Please try manually.', 'warning');
  }
} 