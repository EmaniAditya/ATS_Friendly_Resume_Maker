// Generate resume preview based on form data
function generateResume() {
  console.log('🔄 generateResume() called');
  const preview = document.getElementById("resumePreview");
  const data = collectFormData();
  
  // Debug: Log the collected data structure
  console.log('📊 Collected form data:', {
    fullName: data.fullName,
    jobTitle: data.jobTitle,
    hasProjects: !!(data.projects && data.projects.length > 0),
    projectsCount: data.projects ? data.projects.length : 0,
    hasRatedSkills: !!(data.ratedSkills && data.ratedSkills.length > 0),
    ratedSkillsCount: data.ratedSkills ? data.ratedSkills.length : 0,
    experienceCount: data.experience ? data.experience.length : 0,
    educationCount: data.education ? data.education.length : 0,
    sectionOrder: data.sectionOrder,
    projects: data.projects,
    ratedSkills: data.ratedSkills,
    experience: data.experience
  });
  
  // Debug: Check if we're getting user's sample data
  console.log('🔍 Data source check:', {
    isUserSampleData: data.fullName === 'E S AADITYA REDDY',
    actualFullName: data.fullName,
    expectedFullName: 'E S AADITYA REDDY'
  });
  
  // Save current data
  saveCurrentData();
  
  // Set template class
  preview.className = '';
  preview.classList.add(`template-${data.template}`);
  
  // Start building HTML
  let html = '';
  
  // Header with name and contact info
  html += `<h2 class="text-center">${data.fullName || 'Your Name'}</h2>`;
  
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
        html += '<h4>SUMMARY</h4>';
        html += `<p>${data.summary || 'Professional summary goes here...'}</p>`;
        break;
        
      case 'skills':
        html += '<h4>SKILLS</h4>';
        
        // Check if there are rated skills
        if (data.ratedSkills && data.ratedSkills.length > 0) {
          html += '<div class="rated-skills">';
          data.ratedSkills.forEach(skill => {
            if (skill.name) {
              let stars = '';
              const rating = parseInt(skill.rating) || 0;
              for (let i = 0; i < 5; i++) {
                stars += i < rating ? '★' : '☆';
              }
              html += `<div class="rated-skill"><span class="skill-name">${skill.name}</span> ${stars}</div>`;
            }
          });
          html += '</div>';
        }
        
        // Regular skills
        html += `<p>${data.skills ? data.skills.replace(/\n/g, '<br>') : 'Technical and soft skills go here...'}</p>`;
        break;
        
      case 'experience':
        html += '<h4>EXPERIENCE</h4>';
        if (data.experience && data.experience.length > 0) {
          data.experience.forEach(exp => {
            html += '<div class="experience-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${exp.title || 'Position'}</strong>`;
            if (exp.startDate || exp.endDate) {
              html += `<span>${exp.startDate || ''} - ${exp.endDate || ''}</span>`;
            }
            html += '</div>';
            html += '<div class="d-flex justify-content-between">';
            html += `<em>${exp.company || 'Company'}</em>`;
            if (exp.location) {
              html += `<span>${exp.location}</span>`;
            }
            html += '</div>';
            if (exp.description) {
              html += `<p>${exp.description.replace(/\n/g, '<br>')}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No work experience added yet.</p>';
        }
        break;
        
      case 'education':
        html += '<h4>EDUCATION</h4>';
        if (data.education && data.education.length > 0) {
          data.education.forEach(edu => {
            html += '<div class="education-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${edu.degree || 'Degree'}</strong>`;
            if (edu.educationStartDate || edu.educationEndDate) {
              html += `<span>${edu.educationStartDate || ''} - ${edu.educationEndDate || ''}</span>`;
            }
            html += '</div>';
            html += '<div class="d-flex justify-content-between">';
            html += `<em>${edu.institution || 'School'}</em>`;
            if (edu.educationLocation) {
              html += `<span>${edu.educationLocation}</span>`;
            }
            html += '</div>';
            if (edu.gpa && edu.scoreType !== 'none') {
              html += `<p>${edu.scoreType === 'percentage' ? 'Percentage' : 'GPA'}: ${edu.gpa}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No education information added yet.</p>';
        }
        break;
        
      case 'projects':
        html += '<h4>PROJECTS</h4>';
        if (data.projects && data.projects.length > 0) {
          data.projects.forEach(proj => {
            html += '<div class="project-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${proj.name || 'Project'}</strong>`;
            if (proj.technologies) {
              html += `<span>${proj.technologies}</span>`;
            }
            html += '</div>';
            
            // Project links
            if (proj.link || proj.github) {
              let links = [];
              if (proj.link) links.push(`<a href="#">${proj.link}</a>`);
              if (proj.github) links.push(`<a href="#">${proj.github}</a>`);
              html += `<p>${links.join(' | ')}</p>`;
            }
            
            if (proj.description) {
              html += `<p>${proj.description.replace(/\n/g, '<br>')}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No projects added yet.</p>';
        }
        break;
        
      case 'certifications':
        html += '<h4>CERTIFICATIONS</h4>';
        if (data.certifications && data.certifications.length > 0) {
          data.certifications.forEach(cert => {
            html += '<div class="certification-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${cert.name || 'Certification'}</strong>`;
            if (cert.date) {
              if (cert.expiration) {
                html += `<span>${cert.date} - ${cert.expiration}</span>`;
              } else {
                html += `<span>${cert.date}</span>`;
              }
            }
            html += '</div>';
            html += `<p><em>${cert.organization || ''}</em>`;
            if (cert.credentialId) {
              html += ` (ID: ${cert.credentialId})`;
            }
            html += '</p>';
            html += '</div>';
          });
        } else {
          html += '<p>No certifications added yet.</p>';
        }
        break;
        
      case 'languages':
        html += '<h4>LANGUAGES</h4>';
        if (data.languages && data.languages.length > 0) {
          html += '<div class="languages-entry">';
          const languageList = data.languages.map(lang => {
            return `${lang.language} (${lang.proficiency})`;
          }).join(', ');
          html += `<p>${languageList}</p>`;
          html += '</div>';
        } else {
          html += '<p>No languages added yet.</p>';
        }
        break;
        
      case 'achievements':
        html += '<h4>ACHIEVEMENTS & HONORS</h4>';
        if (data.achievements && data.achievements.length > 0) {
          data.achievements.forEach(achieve => {
            html += '<div class="achievement-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${achieve.title || 'Achievement'}</strong>`;
            if (achieve.date) {
              html += `<span>${achieve.date}</span>`;
            }
            html += '</div>';
            if (achieve.description) {
              html += `<p>${achieve.description}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No achievements added yet.</p>';
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
  const compactMode = document.getElementById('compactMode');

  if (!preview) return;

  // Remove any previous restriction
  preview.style.maxHeight = '';
  preview.style.overflowY = '';

  if (compactMode && compactMode.checked) {
    // Single-page mode: restrict to A4 height
    preview.style.maxHeight = '1123px'; // 297mm at 96dpi
    preview.style.overflowY = 'auto';
    if (preview.scrollHeight > 1123) {
      if (pageWarning) {
        pageWarning.style.display = 'block';
        pageWarning.textContent = 'Warning: Content exceeds one page. Enable compact mode or reduce content.';
      }
    } else {
      if (pageWarning) pageWarning.style.display = 'none';
    }
  } else {
    // Multi-page mode: no restriction
    preview.style.maxHeight = '';
    preview.style.overflowY = '';
    if (pageWarning) pageWarning.style.display = 'none';
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
    // Get current data for text-based PDF generation
    const data = collectFormData();
    
    if (!data.fullName && !data.summary && (!data.experience || data.experience.length === 0)) {
      showToast('Please add some content to your resume before downloading', 'warning');
      hideLoading();
      return;
    }
    
    // Generate text-based PDF using jsPDF
    generateTextPDF(data);
    
  } catch (error) {
    console.error('Error in PDF generation:', error);
    hideLoading();
    showToast('Error generating PDF. Please try again.', 'error');
  }
}

// Text-based PDF generation function
function generateTextPDF(data) {
  try {
    // Import jsPDF if not already available
    if (typeof window.jsPDF === 'undefined') {
      throw new Error('jsPDF library not loaded');
    }
    
    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();
    
    // PDF settings
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const maxWidth = pageWidth - (margin * 2);
    
    // Helper function to add text with wrapping
    function addText(text, fontSize = 12, isBold = false, isCenter = false) {
      if (!text) return yPosition;
      
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, maxWidth);
      
      lines.forEach(line => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        const xPosition = isCenter ? (pageWidth - doc.getTextWidth(line)) / 2 : margin;
        doc.text(line, xPosition, yPosition);
        yPosition += fontSize * 0.5;
      });
      
      return yPosition;
    }
    
    // Header Section
    if (data.fullName) {
      yPosition = addText(data.fullName, 18, true, true);
      yPosition += 5;
    }
    
    if (data.jobTitle) {
      yPosition = addText(data.jobTitle, 14, false, true);
      yPosition += 5;
    }
    
    // Contact Information
    let contactInfo = [];
    if (data.phone) contactInfo.push(data.phone);
    if (data.email) contactInfo.push(data.email);
    if (data.website) contactInfo.push(data.website);
    if (data.location) contactInfo.push(data.location);
    
    if (contactInfo.length > 0) {
      yPosition = addText(contactInfo.join(' | '), 10, false, true);
      yPosition += 10;
    }
    
    // Get section order
    const sectionOrder = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : [
      'summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'languages'
    ];
    
    // Generate sections
    sectionOrder.forEach(section => {
      switch (section) {
        case 'summary':
          if (data.summary) {
            yPosition += 5;
            yPosition = addText('SUMMARY', 14, true);
            yPosition += 2;
            yPosition = addText(data.summary, 11);
            yPosition += 5;
          }
          break;
          
        case 'experience':
          if (data.experience && data.experience.length > 0) {
            yPosition += 5;
            yPosition = addText('EXPERIENCE', 14, true);
            yPosition += 2;
            
            data.experience.forEach(exp => {
              yPosition = addText(exp.title || 'Position', 12, true);
              yPosition += 1;
              
              let companyLine = exp.company || 'Company';
              if (exp.startDate || exp.endDate) {
                companyLine += ` | ${exp.startDate || ''} - ${exp.endDate || ''}`;
              }
              if (exp.location) {
                companyLine += ` | ${exp.location}`;
              }
              yPosition = addText(companyLine, 10);
              yPosition += 1;
              
              if (exp.description) {
                yPosition = addText(exp.description, 10);
              }
              yPosition += 3;
            });
          }
          break;
          
        case 'projects':
          if (data.projects && data.projects.length > 0) {
            yPosition += 5;
            yPosition = addText('PROJECTS', 14, true);
            yPosition += 2;
            
            data.projects.forEach(proj => {
              yPosition = addText(proj.name || 'Project', 12, true);
              yPosition += 1;
              
              if (proj.technologies) {
                yPosition = addText(`Technologies: ${proj.technologies}`, 10);
                yPosition += 1;
              }
              
              if (proj.description) {
                yPosition = addText(proj.description, 10);
              }
              yPosition += 3;
            });
          }
          break;
          
        case 'skills':
          yPosition += 5;
          yPosition = addText('SKILLS', 14, true);
          yPosition += 2;
          
          if (data.ratedSkills && data.ratedSkills.length > 0) {
            data.ratedSkills.forEach(skill => {
              if (skill.name) {
                yPosition = addText(`${skill.name}: ${skill.rating || 'N/A'}`, 10);
                yPosition += 1;
              }
            });
          }
          
          if (data.skills) {
            yPosition = addText(data.skills, 10);
          }
          yPosition += 5;
          break;
          
        case 'education':
          if (data.education && data.education.length > 0) {
            yPosition += 5;
            yPosition = addText('EDUCATION', 14, true);
            yPosition += 2;
            
            data.education.forEach(edu => {
              yPosition = addText(edu.degree || 'Degree', 12, true);
              yPosition += 1;
              
              let eduLine = edu.institution || 'School';
              if (edu.educationStartDate || edu.educationEndDate) {
                eduLine += ` | ${edu.educationStartDate || ''} - ${edu.educationEndDate || ''}`;
              }
              if (edu.educationLocation) {
                eduLine += ` | ${edu.educationLocation}`;
              }
              yPosition = addText(eduLine, 10);
              
              if (edu.gpa && edu.scoreType !== 'none') {
                const scoreLabel = edu.scoreType === 'percentage' ? 'Percentage' : 'GPA';
                yPosition = addText(`${scoreLabel}: ${edu.gpa}`, 10);
              }
              yPosition += 3;
            });
          }
          break;
          
        case 'certifications':
          if (data.certifications && data.certifications.length > 0) {
            yPosition += 5;
            yPosition = addText('CERTIFICATIONS', 14, true);
            yPosition += 2;
            
            data.certifications.forEach(cert => {
              yPosition = addText(cert.name || 'Certification', 12, true);
              yPosition += 1;
              
              let certLine = cert.organization || '';
              if (cert.date) {
                certLine += cert.organization ? ` | ${cert.date}` : cert.date;
              }
              if (certLine) {
                yPosition = addText(certLine, 10);
              }
              yPosition += 3;
            });
          }
          break;
          
        case 'achievements':
          if (data.achievements && data.achievements.length > 0) {
            yPosition += 5;
            yPosition = addText('ACHIEVEMENTS & HONORS', 14, true);
            yPosition += 2;
            
            data.achievements.forEach(achievement => {
              let achievementLine = achievement.title || 'Achievement';
              if (achievement.date) {
                achievementLine += ` | ${achievement.date}`;
              }
              yPosition = addText(achievementLine, 12, true);
              yPosition += 1;
              
              if (achievement.description) {
                yPosition = addText(achievement.description, 10);
              }
              yPosition += 3;
            });
          }
          break;
          
        case 'languages':
          if (data.languages && data.languages.length > 0) {
            yPosition += 5;
            yPosition = addText('LANGUAGES', 14, true);
            yPosition += 2;
            
            const languageList = data.languages.map(lang => 
              `${lang.language} (${lang.proficiency})`
            ).join(', ');
            yPosition = addText(languageList, 10);
            yPosition += 5;
          }
          break;
      }
    });
    
    // Save the PDF
    const fileName = (data.fullName || 'Resume').replace(/\s+/g, '_') + '_Resume.pdf';
    doc.save(fileName);
    
    hideLoading();
    showToast('Text-based PDF downloaded successfully!');
    
  } catch (error) {
    console.error('Error generating text PDF:', error);
    hideLoading();
    showToast('Error generating PDF. Please try again.', 'error');
  }
}

// Download resume as text-based PDF using pdfmake
function downloadTextBasedPDF() {
  showLoading();
  
  try {
    // Use existing data collection function
    const data = collectFormData();
    
    if (!data.fullName.trim()) {
      showToast('Please enter your name before generating PDF', 'warning');
      hideLoading();
      return;
    }
    
    // Create PDF document definition
    const docDefinition = createPDFDocumentDefinition(data);
    
    // Generate filename
    const fileName = (data.fullName || 'Resume').replace(/\s+/g, '_') + '_Resume.pdf';
    
    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(fileName);
    
    hideLoading();
    showToast('Text-based PDF downloaded successfully!');
    
  } catch (error) {
    console.error('Error generating text-based PDF:', error);
    hideLoading();
    showToast('Error generating PDF. Please try again.', 'error');
  }
}

// Create PDF document definition for pdfmake
function createPDFDocumentDefinition(data) {
  const content = [];
  
  // Header with name
  if (data.fullName) {
    content.push({
      text: data.fullName,
      style: 'name',
      alignment: 'center',
      margin: [0, 0, 0, 10]
    });
  }
  
  // Contact information
  const contactInfo = [];
  if (data.email) contactInfo.push(data.email);
  if (data.phone) contactInfo.push(data.phone);
  if (data.location) contactInfo.push(data.location);
  if (data.linkedin) contactInfo.push(data.linkedin);
  if (data.github) contactInfo.push(data.github);
  if (data.website) contactInfo.push(data.website);
  
  if (contactInfo.length > 0) {
    content.push({
      text: contactInfo.join(' | '),
      style: 'contact',
      alignment: 'center',
      margin: [0, 0, 0, 15]
    });
  }
  
  // Professional Summary
  if (data.summary) {
    content.push({ text: 'PROFESSIONAL SUMMARY', style: 'sectionHeader' });
    content.push({ text: data.summary, style: 'body', margin: [0, 0, 0, 10] });
  }
  
  // Skills
  if (data.skills) {
    content.push({ text: 'SKILLS', style: 'sectionHeader' });
    // Handle skills as a formatted string
    const skillLines = data.skills.split('\n').filter(line => line.trim());
    skillLines.forEach(line => {
      content.push({
        text: line,
        style: 'body',
        margin: [0, 0, 0, 3]
      });
    });
    content.push({ text: '', margin: [0, 0, 0, 10] });
  }
  
  // Rated Skills
  if (data.ratedSkills && data.ratedSkills.length > 0) {
    content.push({ text: 'TECHNICAL PROFICIENCY', style: 'sectionHeader' });
    data.ratedSkills.forEach(skill => {
      if (skill.skill_name) {
        const rating = skill.skill_rating ? ` (${skill.skill_rating}/5)` : '';
        content.push({
          text: `${skill.skill_name}${rating}`,
          style: 'body',
          margin: [0, 0, 0, 3]
        });
      }
    });
    content.push({ text: '', margin: [0, 0, 0, 10] });
  }
  
  // Experience
  if (data.experience && data.experience.length > 0) {
    content.push({ text: 'PROFESSIONAL EXPERIENCE', style: 'sectionHeader' });
    data.experience.forEach(exp => {
      if (exp.job_title && exp.company_name) {
        content.push({
          text: `${exp.job_title} | ${exp.company_name}`,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      // Format date range
      if (exp.start_date || exp.end_date) {
        const startDate = exp.start_date || '';
        const endDate = exp.end_date || 'Present';
        const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate);
        content.push({
          text: dateRange,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (exp.location) {
        content.push({
          text: exp.location,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (exp.description) {
        const bullets = exp.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          content.push({
            text: `• ${bullet.replace(/^[•\-\*]\s*/, '')}`,
            style: 'body',
            margin: [10, 0, 0, 3]
          });
        });
      }
      content.push({ text: '', margin: [0, 0, 0, 8] });
    });
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    content.push({ text: 'EDUCATION', style: 'sectionHeader' });
    data.education.forEach(edu => {
      if (edu.degree && edu.school_name) {
        content.push({
          text: `${edu.degree} | ${edu.school_name}`,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      // Format education date range
      if (edu.education_start_date || edu.education_end_date) {
        const startDate = edu.education_start_date || '';
        const endDate = edu.education_end_date || 'Present';
        const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate);
        content.push({
          text: dateRange,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (edu.education_location) {
        content.push({
          text: edu.education_location,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (edu.gpa && edu.score_type) {
        content.push({
          text: `${edu.score_type}: ${edu.gpa}`,
          style: 'body',
          margin: [0, 0, 0, 8]
        });
      }
    });
  }
  
  // Projects
  if (data.projects && data.projects.length > 0) {
    content.push({ text: 'PROJECTS', style: 'sectionHeader' });
    data.projects.forEach(project => {
      if (project.project_name) {
        content.push({
          text: project.project_name,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      if (project.project_technologies) {
        content.push({
          text: `Technologies: ${project.project_technologies}`,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (project.project_link || project.project_github) {
        const links = [];
        if (project.project_link) links.push(`Link: ${project.project_link}`);
        if (project.project_github) links.push(`GitHub: ${project.project_github}`);
        content.push({
          text: links.join(' | '),
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (project.project_description) {
        const bullets = project.project_description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          content.push({
            text: `• ${bullet.replace(/^[•\-\*]\s*/, '')}`,
            style: 'body',
            margin: [10, 0, 0, 3]
          });
        });
      }
      content.push({ text: '', margin: [0, 0, 0, 8] });
    });
  }
  
  // Languages
  if (data.languages && data.languages.length > 0) {
    content.push({ text: 'LANGUAGES', style: 'sectionHeader' });
    const langText = data.languages.map(lang => 
      `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
    ).join(', ');
    content.push({ text: langText, style: 'body', margin: [0, 0, 0, 10] });
  }
  
  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    content.push({ text: 'CERTIFICATIONS', style: 'sectionHeader' });
    data.certifications.forEach(cert => {
      if (cert.certification_name) {
        let certText = cert.certification_name;
        if (cert.certification_org) {
          certText += ` | ${cert.certification_org}`;
        }
        content.push({
          text: certText,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      if (cert.certification_date) {
        content.push({
          text: cert.certification_date,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (cert.credential_id) {
        content.push({
          text: `Credential ID: ${cert.credential_id}`,
          style: 'body',
          margin: [0, 0, 0, 8]
        });
      }
    });
  }
  
  // Achievements
  if (data.achievements && data.achievements.length > 0) {
    content.push({ text: 'ACHIEVEMENTS', style: 'sectionHeader' });
    data.achievements.forEach(achievement => {
      if (achievement.achievement_title) {
        content.push({
          text: achievement.achievement_title,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      if (achievement.achievement_date) {
        content.push({
          text: achievement.achievement_date,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (achievement.achievement_description) {
        content.push({
          text: achievement.achievement_description,
          style: 'body',
          margin: [0, 0, 0, 8]
        });
      }
    });
  }
  
  return {
    content: content,
    styles: {
      name: {
        fontSize: 20,
        bold: true,
        color: '#2c3e50'
      },
      contact: {
        fontSize: 10,
        color: '#5a6c7d'
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: '#2c3e50',
        margin: [0, 15, 0, 8],
        decoration: 'underline'
      },
      jobTitle: {
        fontSize: 11,
        bold: true,
        color: '#34495e'
      },
      duration: {
        fontSize: 9,
        color: '#7f8c8d',
        italics: true
      },
      body: {
        fontSize: 10,
        color: '#2c3e50',
        lineHeight: 1.3
      }
    },
    pageMargins: [40, 40, 40, 40]
  };
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