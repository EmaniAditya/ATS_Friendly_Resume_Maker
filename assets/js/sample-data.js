// Sample resume data
const SAMPLE_RESUME_DATA = {
  fullName: "E S AADITYA REDDY",
  jobTitle: "Software Developer | Full Stack Engineer",
  phone: "+91 7587202379",
  email: "esaadityareddy@gmail.com",
  github: "github.com/EmaniAditya",
  linkedin: "linkedin.com/in/esaadityareddy",
  website: "emaniaditya.github.io",
  location: "Raipur, India",
  dob: "05 Nov 2004",
  summary: "Detail-oriented Full Stack Developer with 2+ years of experience building enterprise-grade applications using modern JavaScript frameworks and Java. Strong expertise in MERN stack with proven ability to architect scalable web applications that meet business requirements. Skilled in optimizing application performance, implementing robust security practices, and delivering user-friendly interfaces with responsive design principles. Dedicated to writing clean, maintainable code and continuously exploring new technologies to enhance development efficiency.",
  experience: [
    {
      company_name: "Accenture",
      job_title: "Software Engineering Intern",
      start_date: "05/2025",
      end_date: "07/2025",
      location: "Bengaluru, Karnataka",
      description: "• Developed and maintained RESTful APIs using Java Spring Boot, improving system response time by 27%\n• Implemented workflow automation with Camunda BPM, reducing manual interventions by 40%\n• Integrated Camunda flows with ServiceNow for automated ticket management and incident routing\n• Collaborated with cross-functional teams to analyze requirements and deliver high-quality solutions\n• Participated in agile development processes including daily stand-ups and sprint planning"
    },
    {
      company_name: "KODAAC (Kodagians Alumni Association)",
      job_title: "Web Development Intern",
      start_date: "01/2025",
      end_date: "04/2025",
      location: "Bengaluru, Karnataka",
      description: "• Led frontend development using React.js, resulting in 30% faster page load times\n• Optimized MongoDB database queries, improving data retrieval speed by 35%\n• Implemented responsive design principles ensuring seamless experience across all device types\n• Developed and maintained API endpoints using Express.js to facilitate client-server communication\n• Created comprehensive documentation for codebase and APIs to improve knowledge sharing"
    },
    {
      company_name: "Freelance Web Developer",
      job_title: "Full Stack Developer",
      start_date: "06/2024",
      end_date: "12/2024",
      location: "Remote",
      description: "• Built custom e-commerce solutions for 3 small businesses using MERN stack\n• Implemented secure payment processing using Stripe API with 100% transaction success rate\n• Designed and developed responsive UI components with React.js and Tailwind CSS\n• Created automated testing suites with Jest and React Testing Library\n• Deployed and maintained applications on AWS using CI/CD pipelines"
    }
  ],
  education: [
    {
      school_name: "Shri Rawatpura Sarkar University, Raipur",
      degree: "Bachelor of Technology, Computer Science and Engineering",
      education_start_date: "08/2022",
      education_end_date: "Present",
      education_location: "Raipur, Chhattisgarh",
      gpa: "8.9",
      score_type: "gpa"
    },
    {
      school_name: "Sainik School, Kodagu",
      degree: "Class XII (Senior Secondary), Science with Computer Science",
      education_start_date: "07/2020",
      education_end_date: "07/2022",
      education_location: "Kodagu, Karnataka",
      gpa: "92.5",
      score_type: "percentage"
    },
    {
      school_name: "Sainik School, Kodagu",
      degree: "Class X (Secondary)",
      education_start_date: "07/2015",
      education_end_date: "06/2020",
      education_location: "Kodagu, Karnataka",
      gpa: "89.8",
      score_type: "percentage"
    }
  ],
  projects: [
    {
      project_name: "Service Health Dashboard",
      project_description: "• Designed and implemented a real-time monitoring system for microservices using Spring Boot and WebSocket\n• Created visualization components with React and D3.js showing system health metrics\n• Implemented automated alert system reducing incident response time by 65%\n• Integrated with Prometheus and Grafana for advanced metrics collection and visualization",
      project_technologies: "Java, Spring Boot, Camunda, React, WebSocket, Prometheus",
      project_link: "dashboard.example.com",
      project_github: "github.com/EmaniAditya/service-health-dashboard"
    },
    {
      project_name: "E-Commerce Platform",
      project_description: "• Built a full-featured e-commerce platform with React, Node.js, Express, and MongoDB\n• Implemented secure user authentication with JWT and role-based access control\n• Developed shopping cart functionality with real-time inventory management\n• Integrated Stripe payment gateway with 99.8% transaction success rate\n• Implemented automated testing with 85% code coverage",
      project_technologies: "MERN Stack, Redux, JWT, Stripe API, Jest",
      project_link: "ecommerce-demo.example.com",
      project_github: "github.com/EmaniAditya/ecommerce-platform"
    },
    {
      project_name: "ATS-Friendly Resume Maker",
      project_description: "• Developed a responsive web application for creating ATS-optimized resumes\n• Implemented multiple template designs with custom CSS and dynamic content rendering\n• Created PDF generation functionality with proper formatting and styling\n• Built keyword analysis tool to optimize resume content against job descriptions\n• Added local storage functionality for saving multiple resume versions",
      project_technologies: "JavaScript, HTML5, CSS3, Bootstrap, PDF.js",
      project_link: "ats-resume-maker.example.com",
      project_github: "github.com/EmaniAditya/ATS_Friendly_Resume_Maker"
    },
    {
      project_name: "Campus Connect Mobile App",
      project_description: "• Built a cross-platform mobile application to connect university students\n• Implemented real-time chat functionality using Socket.IO and MongoDB\n• Created event management system with in-app notifications and calendar integration\n• Developed location-based services for campus navigation\n• Deployed backend on Google Cloud Platform with auto-scaling configuration",
      project_technologies: "React Native, Node.js, Socket.IO, MongoDB, GCP",
      project_link: "campusconnect-demo.example.com",
      project_github: "github.com/EmaniAditya/campus-connect"
    }
  ],
  skills: "Technical Skills:\nReact.js · Node.js · Express.js · MongoDB · MySQL · PostgreSQL · Redux · TypeScript · Java · Spring Boot · Camunda BPM · Docker · Kubernetes · AWS · CI/CD · REST API Design · GraphQL · WebSocket · React Native · Git · GitHub Actions · Webpack · Jest · Mocha · Chai · Material UI · Bootstrap · Tailwind CSS · HTML5 · CSS3 · SASS/SCSS · Redux Toolkit · NextJS\n\nSoft Skills:\nTeam Leadership · Problem Solving · Agile Methodology · Technical Documentation · Communication · Time Management · Critical Thinking · Adaptability · Client Collaboration · Project Planning · Knowledge Sharing",
  ratedSkills: [
    {
      skill_name: "JavaScript/TypeScript",
      skill_rating: "Expert"
    },
    {
      skill_name: "React.js & React Native",
      skill_rating: "Expert"
    },
    {
      skill_name: "Node.js & Express",
      skill_rating: "Advanced"
    },
    {
      skill_name: "MongoDB & SQL Databases",
      skill_rating: "Advanced"
    },
    {
      skill_name: "Java & Spring Boot",
      skill_rating: "Intermediate"
    },
    {
      skill_name: "DevOps & Cloud (AWS/GCP)",
      skill_rating: "Intermediate"
    },
    {
      skill_name: "UI/UX Design Principles",
      skill_rating: "Advanced"
    }
  ],
  achievements: [
    {
      achievement_title: "Production MERN Applications",
      achievement_date: "2024",
      achievement_description: "Developed and deployed 5 full-stack MERN applications serving 1000+ monthly active users with 99.9% uptime."
    },
    {
      achievement_title: "Rapid Java & Camunda Onboarding",
      achievement_date: "2025",
      achievement_description: "Mastered Spring Boot and Camunda BPM in 2 weeks, reducing system monitoring overhead by 40% through automation."
    },
    {
      achievement_title: "Frontend Performance Optimization",
      achievement_date: "2024",
      achievement_description: "Improved application load time by 65% through code splitting, lazy loading, and optimized rendering techniques."
    },
    {
      achievement_title: "Hackathon Winner",
      achievement_date: "2023",
      achievement_description: "Won first place at University Hackathon by developing an AI-powered study assistance platform in 48 hours."
    },
    {
      achievement_title: "Open Source Contributor",
      achievement_date: "2024-Present",
      achievement_description: "Regular contributor to open-source projects with 15+ pull requests merged into popular JavaScript libraries."
    }
  ],
  certifications: [
    {
      certification_name: "AWS Certified Solutions Architect - Associate",
      certification_org: "Amazon Web Services",
      certification_date: "06/2025",
      certification_expiration: "06/2028",
      credential_id: "AWS-SA-87654321"
    },
    {
      certification_name: "MongoDB Certified Developer - Associate",
      certification_org: "MongoDB University",
      certification_date: "04/2025",
      certification_expiration: "04/2028",
      credential_id: "MCD-12345678"
    },
    {
      certification_name: "Professional Scrum Master I (PSM I)",
      certification_org: "Scrum.org",
      certification_date: "02/2025",
      certification_expiration: "N/A",
      credential_id: "PSM-I-123456"
    },
    {
      certification_name: "JavaScript Algorithms and Data Structures",
      certification_org: "freeCodeCamp",
      certification_date: "11/2024",
      certification_expiration: "N/A",
      credential_id: "FCC-JADS-67890"
    },
    {
      certification_name: "React - The Complete Guide",
      certification_org: "Udemy",
      certification_date: "09/2024",
      certification_expiration: "N/A",
      credential_id: "UC-REACT-123456"
    }
  ],
  languages: [
    {
      language: "English",
      proficiency: "Fluent"
    },
    {
      language: "Hindi",
      proficiency: "Native"
    },
    {
      language: "Kannada",
      proficiency: "Conversational"
    },
    {
      language: "Telugu",
      proficiency: "Basic"
    }
  ],
  template: "professional",
  sectionOrder: ["summary", "skills", "experience", "projects", "education", "certifications", "achievements", "languages"]
}; 