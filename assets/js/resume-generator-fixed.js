// Fixed Resume Generator - Simple Working Version
function generateResume() {
  console.log('🔄 generateResume() called');
  const preview = document.getElementById("resumePreview");
  const data = collectFormData();
  console.log('📊 Collected form data:', data);

  if (!preview) {
    console.error('❌ Resume preview element not found');
    return;
  }

  try {
    // Generate basic resume HTML
  let html = `
    <div class="resume-content" style="padding: 20px; font-family: Arial, sans-serif;">
      <div class="header" style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #333;">${data.fullName || ''}</h1>
        <div style="margin: 10px 0;">
          ${data.email || ''} | ${data.phone || ''}
        </div>
        <div style="margin: 5px 0;">
          ${data.location || ''}
        </div>
      </div>
  `;

  // Add experience section
  if (data.experience && data.experience.length > 0) {
    html += `<div class="section" style="margin-bottom: 20px;">
      <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Experience</h3>`;
    
    data.experience.forEach(exp => {
      html += `
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold;">${exp.title || ''} - ${exp.company || ''}</div>
          <div style="color: #666; font-size: 0.9em;">${exp.startDate || ''} - ${exp.endDate || ''}</div>
          <div style="margin-top: 5px;">`;
      
      if (exp.description) {
        const bullets = exp.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          // Remove any leading bullet characters
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            html += `<div>• ${cleanBullet}</div>`;
          }
        });
      }
      
      html += `</div></div>`;
    });
    html += `</div>`;
  }

  // Add projects section
  if (data.projects && data.projects.length > 0) {
    html += `<div class="section" style="margin-bottom: 20px;">
      <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Projects</h3>`;
    
    data.projects.forEach(project => {
      html += `
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold;">${project.name || ''}</div>
          <div style="margin-top: 5px;">`;
      
      if (project.description) {
        const bullets = project.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          // Remove any leading bullet characters
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            html += `<div>• ${cleanBullet}</div>`;
          }
        });
      }
      
      html += `</div></div>`;
    });
    html += `</div>`;
  }

  // Add education section
  if (data.education && data.education.length > 0) {
    html += `<div class="section" style="margin-bottom: 20px;">
      <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Education</h3>`;
    
    data.education.forEach(edu => {
      html += `
        <div style="margin-bottom: 10px;">
          <div style="font-weight: bold;">${edu.degree || ''}</div>
          <div>${edu.institution || ''}</div>
          <div style="color: #666; font-size: 0.9em;">${edu.year || ''}</div>
        </div>`;
    });
    html += `</div>`;
  }

  // Add skills section
  if (data.skills) {
    let skillsText = '';
    if (Array.isArray(data.skills)) {
      skillsText = data.skills.join(', ');
    } else if (typeof data.skills === 'string') {
      skillsText = data.skills;
    } else {
      skillsText = JSON.stringify(data.skills);
    }
    
    if (skillsText.trim()) {
      html += `<div class="section" style="margin-bottom: 20px;">
        <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Skills</h3>
        <div>${skillsText}</div>
      </div>`;
    }
  }

  html += `</div>`;
  preview.innerHTML = html;
  console.log('✅ Resume preview generated successfully');
  
  } catch (error) {
    console.error('❌ ERROR in generateResume():', error);
    console.error('❌ Stack trace:', error.stack);
    preview.innerHTML = '<div style="color: red; padding: 20px;">Error generating resume: ' + error.message + '</div>';
  }
}

// PDF Export functions
function downloadPDF() {
  console.log('📄 PDF download requested');
  // Default to single page PDF
  downloadSinglePagePDF();
}

function downloadFreePDF() {
  console.log('📄 Free PDF download requested');  
  const data = collectFormData();
  
  if (!data.fullName) {
    alert('Please fill in your name before exporting PDF');
    return;
  }

  // Create multi-page PDF document structure for detailed resume
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    content: []
  };

  // Header section
  docDefinition.content.push({
    text: data.fullName || '',
    style: 'header',
    alignment: 'center'
  });

  if (data.jobTitle) {
    docDefinition.content.push({
      text: data.jobTitle,
      style: 'subheader',
      alignment: 'center',
      margin: [0, 5, 0, 15]
    });
  }

  // Contact info
  const contactInfo = [];
  if (data.email) contactInfo.push(data.email);
  if (data.phone) contactInfo.push(data.phone);
  if (data.location) contactInfo.push(data.location);
  if (data.github) contactInfo.push(`GitHub: ${data.github}`);
  if (data.linkedin) contactInfo.push(`LinkedIn: ${data.linkedin}`);

  if (contactInfo.length > 0) {
    docDefinition.content.push({
      text: contactInfo.join(' | '),
      alignment: 'center',
      margin: [0, 0, 0, 20]
    });
  }

  // Summary section
  if (data.summary && data.summary.trim()) {
    docDefinition.content.push({
      text: 'SUMMARY',
      style: 'sectionHeader'
    });
    docDefinition.content.push({
      text: data.summary,
      margin: [0, 5, 0, 15]
    });
  }

  // Skills section
  if (data.skills && typeof data.skills === 'string' && data.skills.trim()) {
    docDefinition.content.push({
      text: 'SKILLS',
      style: 'sectionHeader'
    });
    
    docDefinition.content.push({
      text: data.skills.replace('Technical Skills:', '').trim(),
      margin: [0, 5, 0, 15]
    });
  }

  // Experience section
  if (data.experience && data.experience.length > 0) {
    docDefinition.content.push({
      text: 'EXPERIENCE',
      style: 'sectionHeader'
    });

    data.experience.forEach(exp => {
      docDefinition.content.push({
        columns: [
          { text: `${exp.title || ''} - ${exp.company || ''}`, style: 'jobTitle', width: '*' },
          { text: `${exp.startDate || ''} - ${exp.endDate || ''}`, alignment: 'right', width: 'auto' }
        ],
        margin: [0, 8, 0, 5]
      });

      if (exp.description) {
        const bullets = exp.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-' || cleanBullet.charAt(0) === '·') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            docDefinition.content.push({
              text: `• ${cleanBullet}`,
              margin: [20, 2, 0, 2]
            });
          }
        });
      }
      docDefinition.content.push({ text: '', margin: [0, 0, 0, 12] });
    });
  }

  // Projects section
  if (data.projects && data.projects.length > 0) {
    docDefinition.content.push({
      text: 'PROJECTS',
      style: 'sectionHeader'
    });

    data.projects.forEach(project => {
      docDefinition.content.push({
        text: project.name || '',
        style: 'jobTitle',
        margin: [0, 8, 0, 5]
      });

      if (project.technologies) {
        docDefinition.content.push({
          text: `Technologies: ${project.technologies}`,
          margin: [0, 2, 0, 5],
          fontSize: 9,
          italics: true
        });
      }

      if (project.description) {
        const bullets = project.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            docDefinition.content.push({
              text: `• ${cleanBullet}`,
              margin: [20, 2, 0, 2]
            });
          }
        });
      }
      docDefinition.content.push({ text: '', margin: [0, 0, 0, 12] });
    });
  }

  // Education section
  if (data.education && data.education.length > 0) {
    docDefinition.content.push({
      text: 'EDUCATION',
      style: 'sectionHeader'
    });

    data.education.forEach(edu => {
      docDefinition.content.push({
        columns: [
          { text: edu.degree || '', style: 'jobTitle', width: '*' },
          { text: edu.year || '', alignment: 'right', width: 'auto' }
        ],
        margin: [0, 8, 0, 3]
      });
      
      if (edu.institution) {
        docDefinition.content.push({
          text: edu.institution,
          margin: [0, 3, 0, 12]
        });
      }
    });
  }

  // Define styles
  docDefinition.styles = {
    header: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    },
    subheader: {
      fontSize: 14,
      bold: true,
      color: '#34495e'
    },
    sectionHeader: {
      fontSize: 12,
      bold: true,
      color: '#2c3e50',
      margin: [0, 15, 0, 8]
    },
    jobTitle: {
      fontSize: 11,
      bold: true
    }
  };

  // Generate and download PDF
  try {
    pdfMake.createPdf(docDefinition).download(`${data.fullName || 'Resume'}_Detailed_Resume.pdf`);
    console.log('✅ Free-flow PDF exported successfully');
  } catch (error) {
    console.error('❌ PDF Export Error:', error);
    alert('Error generating PDF. Please check the console for details.');
  }
}

function downloadSinglePagePDF() {
  console.log('📄 Single page PDF download requested');
  const data = collectFormData();
  
  if (!data.fullName) {
    alert('Please fill in your name before exporting PDF');
    return;
  }

  // Create single-page PDF document structure
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    content: []
  };

  // Header section
  docDefinition.content.push({
    text: data.fullName || '',
    style: 'header',
    alignment: 'center'
  });

  if (data.jobTitle) {
    docDefinition.content.push({
      text: data.jobTitle,
      style: 'subheader',
      alignment: 'center',
      margin: [0, 3, 0, 10]
    });
  }

  // Contact info
  const contactInfo = [];
  if (data.email) contactInfo.push(data.email);
  if (data.phone) contactInfo.push(data.phone);
  if (data.location) contactInfo.push(data.location);

  if (contactInfo.length > 0) {
    docDefinition.content.push({
      text: contactInfo.join(' | '),
      alignment: 'center',
      margin: [0, 0, 0, 12],
      fontSize: 10
    });
  }

  // Skills section (compact)
  if (data.skills && typeof data.skills === 'string' && data.skills.trim()) {
    docDefinition.content.push({
      text: 'SKILLS',
      style: 'sectionHeader'
    });
    
    docDefinition.content.push({
      text: data.skills.replace('Technical Skills:', '').trim(),
      margin: [0, 2, 0, 10],
      fontSize: 9
    });
  }

  // Experience section (compact)
  if (data.experience && data.experience.length > 0) {
    docDefinition.content.push({
      text: 'EXPERIENCE',
      style: 'sectionHeader'
    });

    data.experience.forEach(exp => {
      docDefinition.content.push({
        columns: [
          { text: `${exp.title || ''} - ${exp.company || ''}`, style: 'jobTitle', width: '*' },
          { text: `${exp.startDate || ''} - ${exp.endDate || ''}`, alignment: 'right', width: 'auto' }
        ],
        margin: [0, 5, 0, 2]
      });

      if (exp.description) {
        const bullets = exp.description.split('\n').filter(line => line.trim()).slice(0, 3); // Limit to 3 bullets
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-' || cleanBullet.charAt(0) === '·') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            docDefinition.content.push({
              text: `• ${cleanBullet}`,
              margin: [15, 1, 0, 1],
              fontSize: 9
            });
          }
        });
      }
      docDefinition.content.push({ text: '', margin: [0, 0, 0, 6] });
    });
  }

  // Projects section (compact)
  if (data.projects && data.projects.length > 0) {
    docDefinition.content.push({
      text: 'PROJECTS',
      style: 'sectionHeader'
    });

    data.projects.slice(0, 2).forEach(project => { // Limit to 2 projects
      docDefinition.content.push({
        text: project.name || '',
        style: 'jobTitle',
        margin: [0, 5, 0, 2]
      });

      if (project.description) {
        const bullets = project.description.split('\n').filter(line => line.trim()).slice(0, 2); // Limit to 2 bullets
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            docDefinition.content.push({
              text: `• ${cleanBullet}`,
              margin: [15, 1, 0, 1],
              fontSize: 9
            });
          }
        });
      }
      docDefinition.content.push({ text: '', margin: [0, 0, 0, 6] });
    });
  }

  // Education section
  if (data.education && data.education.length > 0) {
    docDefinition.content.push({
      text: 'EDUCATION',
      style: 'sectionHeader'
    });

    data.education.forEach(edu => {
      docDefinition.content.push({
        columns: [
          { text: edu.degree || '', style: 'jobTitle', width: '*' },
          { text: edu.year || '', alignment: 'right', width: 'auto' }
        ],
        margin: [0, 3, 0, 1]
      });
      
      if (edu.institution) {
        docDefinition.content.push({
          text: edu.institution,
          margin: [0, 1, 0, 6],
          fontSize: 9
        });
      }
    });
  }

  // Define compact styles
  docDefinition.styles = {
    header: {
      fontSize: 16,
      bold: true,
      color: '#2c3e50'
    },
    subheader: {
      fontSize: 12,
      bold: true,
      color: '#34495e'
    },
    sectionHeader: {
      fontSize: 11,
      bold: true,
      color: '#2c3e50',
      margin: [0, 10, 0, 5]
    },
    jobTitle: {
      fontSize: 10,
      bold: true
    }
  };

  // Generate and download PDF
  try {
    pdfMake.createPdf(docDefinition).download(`${data.fullName || 'Resume'}_SinglePage_Resume.pdf`);
    console.log('✅ Single-page PDF exported successfully');
  } catch (error) {
    console.error('❌ PDF Export Error:', error);
    alert('Error generating PDF. Please check the console for details.');
  }
}

function downloadTextVersion() {
  console.log('📝 Text version download requested');
  const data = collectFormData();
  
  if (!data.fullName) {
    alert('Please fill in your name before exporting text version');
    return;
  }

  let textContent = '';
  
  // Header
  textContent += `${data.fullName || ''}\n`;
  textContent += `${'='.repeat((data.fullName || '').length)}\n\n`;
  
  if (data.jobTitle) {
    textContent += `${data.jobTitle}\n\n`;
  }
  
  // Contact info
  const contactInfo = [];
  if (data.email) contactInfo.push(data.email);
  if (data.phone) contactInfo.push(data.phone);
  if (data.location) contactInfo.push(data.location);
  if (data.github) contactInfo.push(`GitHub: ${data.github}`);
  if (data.linkedin) contactInfo.push(`LinkedIn: ${data.linkedin}`);
  
  if (contactInfo.length > 0) {
    textContent += `${contactInfo.join(' | ')}\n\n`;
  }
  
  // Summary
  if (data.summary && data.summary.trim()) {
    textContent += `SUMMARY\n${'='.repeat(7)}\n${data.summary}\n\n`;
  }
  
  // Skills
  if (data.skills && typeof data.skills === 'string' && data.skills.trim()) {
    textContent += `SKILLS\n${'='.repeat(6)}\n${data.skills.replace('Technical Skills:', '').trim()}\n\n`;
  }
  
  // Experience
  if (data.experience && data.experience.length > 0) {
    textContent += `EXPERIENCE\n${'='.repeat(10)}\n`;
    
    data.experience.forEach(exp => {
      textContent += `\n${exp.title || ''} - ${exp.company || ''}\n`;
      textContent += `${exp.startDate || ''} - ${exp.endDate || ''}\n`;
      
      if (exp.description) {
        const bullets = exp.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-' || cleanBullet.charAt(0) === '·') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            textContent += `• ${cleanBullet}\n`;
          }
        });
      }
    });
    textContent += '\n';
  }
  
  // Projects
  if (data.projects && data.projects.length > 0) {
    textContent += `PROJECTS\n${'='.repeat(8)}\n`;
    
    data.projects.forEach(project => {
      textContent += `\n${project.name || ''}\n`;
      if (project.technologies) {
        textContent += `Technologies: ${project.technologies}\n`;
      }
      
      if (project.description) {
        const bullets = project.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          let cleanBullet = bullet.trim();
          while (cleanBullet.charAt(0) === '•' || cleanBullet.charAt(0) === '*' || cleanBullet.charAt(0) === '-') {
            cleanBullet = cleanBullet.substring(1).trim();
          }
          if (cleanBullet) {
            textContent += `• ${cleanBullet}\n`;
          }
        });
      }
    });
    textContent += '\n';
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    textContent += `EDUCATION\n${'='.repeat(9)}\n`;
    
    data.education.forEach(edu => {
      textContent += `\n${edu.degree || ''} - ${edu.year || ''}\n`;
      if (edu.institution) {
        textContent += `${edu.institution}\n`;
      }
    });
    textContent += '\n';
  }
  
  // Create and download text file
  try {
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.fullName || 'Resume'}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ Text version exported successfully');
  } catch (error) {
    console.error('❌ Text Export Error:', error);
    alert('Error generating text file. Please check the console for details.');
  }
}

console.log('✅ Resume generator functions loaded successfully');
