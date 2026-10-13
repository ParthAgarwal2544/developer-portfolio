// ─────────────────────────────────────────────────────────────
//  content.js – Single source of truth for all portfolio data.
//  Edit this file to update name, projects, skills, and links.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Parth Rohit Agarwal',
  role: 'AI/ML Developer · Software Engineer · Full-Stack Developer',
  tagline: 'I build practical AI systems, full-stack applications, and interactive digital experiences.',
  location: 'Dehradun, India',
  email: null,
  phone: '9696972800',
  availability: "Open to internships in software engineering, AI/ML, and full-stack development. Let's build something useful.",
  socials: [
    { label: 'GitHub', url: 'https://github.com/ParthAgarwal2544' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/parth-rohit-agarwal' },
  ],
}

// status: 'done' | 'in-progress'
export const projects = [
  {
    id: 'tapsense',
    title: 'TapSense',
    category: 'Python · Signal Processing & Automation',
    blurb: 'A Python-based touchless computer control system designed to interpret acoustic tap sounds as gestures for desktop automation.',
    description: [
      'Engineered a touchless computer control system in Python designed to interpret acoustic tap sounds as desktop gestures.',
      'Explored audio signal processing, acoustic feature extraction, and gesture recognition for touchless navigation.',
      'Architected with a modular system design and configurable application settings for desktop task automation.',
    ],
    tags: ['Python', 'Audio Processing', 'Gesture Recognition', 'Automation'],
    github: 'https://github.com/ParthAgarwal2544/TapSense',
    demo: null,
    status: 'done',
    doodle: 0,
  },
  {
    id: 'zeno',
    title: 'ZENO AI Assistant',
    category: 'AI · Voice Interaction & Automation',
    blurb: 'An AI-powered desktop assistant built with Python, featuring voice interaction, wake-word detection, and system automation.',
    description: [
      'Developed an AI desktop assistant using Python, OpenWakeWord, and ONNX for efficient, low-latency wake-word detection.',
      'Implemented voice interaction, natural command handling, and local audio model inference.',
      'Structured with modular Python components to execute system automations and desktop workflows hands-free.',
    ],
    tags: ['Python', 'OpenWakeWord', 'ONNX', 'Voice AI', 'Automation'],
    github: 'https://github.com/ParthAgarwal2544/ZENO-AI-Assistant',
    demo: null,
    status: 'in-progress',
    doodle: 2,
  },
  {
    id: 'kissan',
    title: 'Kissan Global Gully',
    category: 'Frontend Development',
    blurb: 'A product showcase website with a vertically scrollable, short-form video–inspired browsing experience built for an agricultural goods brand.',
    description: [
      'Designed and developed a product showcase site with a scroll-driven vertical browsing interface inspired by short-form video feeds.',
      'Each product is presented as a full-viewport section with visual emphasis, making browsing intuitive and engaging.',
      'Built with a focus on visual clarity and mobile performance for a target audience new to online shopping.',
    ],
    tags: ['React', 'CSS', 'Vite', 'Responsive Design'],
    github: 'https://github.com/ParthAgarwal2544/kissan-global-gully',
    demo: null,
    status: 'done',
    doodle: 1,
  },
  {
    id: 'setu',
    title: 'Setu',
    category: 'Full-Stack Development | Hackathon',
    badge: 'Latest Hackathon Project · SIH 2026 Nationals',
    badgeVariant: 'highlight',
    blurb: 'An AI-powered competency management copilot built for institutional civil service training, identifying skill gaps and recommending tailored learning pathways. Selected for Nationals in Smart India Hackathon (SIH) 2026.',
    description: [
      'Hackathon Achievement: Selected for Nationals in Smart India Hackathon (SIH) 2026 as my latest hackathon project (institutional capacity building framework for MoSPI & NSSTA civil service training).',
      'Key Implemented Features: Automated competency profiling across 4 core domains (Statistical, Technical, Digital Governance, Behavioural/Managerial), deterministic explainable gap engine with plain-language rationales, course catalog adapters (iGOT Karmayogi & NSSTA TPAC), Gemini Flash-powered adaptive quiz generator from training documents/PPTs with Bloom’s taxonomy tagging, and scheduled proactive nudges.',
      'My Technical Contributions: Architected the full-stack system with a Next.js frontend and Python FastAPI REST backend. Designed the asynchronous data layer using SQLite (aiosqlite) with Alembic migrations for local storage. Built the deterministic rule-based gap scoring engine and integrated APScheduler for background AI-assisted nudge dispatching.',
    ],
    tags: ['Next.js', 'Python', 'FastAPI', 'SQLite', 'SQLAlchemy', 'AI Copilot'],
    github: 'https://github.com/ParthAgarwal2544/Setu-',
    demo: null,
    status: 'done',
    doodle: 0,
  },
  {
    id: 'carevoice',
    title: 'CareVoice',
    category: 'AI / Assistive Technology | Hackathon',
    badge: '2025 Hackathon Project',
    badgeVariant: 'subtle',
    blurb: 'An earlier hackathon project (2025), an assistive conversational chatbot powered by a Flask backend designed to support users facing barriers with standard digital interfaces.',
    description: [
      'Problem & Purpose: Developed as a 2025 hackathon project in the AI / Assistive Technology category to improve accessibility for individuals with interface interaction challenges.',
      'Implementation: Built an AI conversational assistant with a Python and Flask backend for request handling, dialogue management, and contextual response dispatch.',
      'Assistive Design: Explored combining voice and text input modalities to lower accessibility barriers and simplify interaction with digital services.',
    ],
    tags: ['Python', 'Flask', 'AI Chatbot', 'Accessibility'],
    github: null,
    demo: null,
    status: 'done',
    doodle: 3,
  },
  {
    id: 'ids',
    title: 'Port-Based Intrusion Detection System',
    category: 'Machine Learning · Cybersecurity',
    blurb: 'A machine learning pipeline that analyses port-level network traffic features to identify suspicious activity and flag potential intrusions.',
    description: [
      'Built a supervised ML pipeline focused on port-level network traffic features to detect anomalous and potentially malicious activity.',
      'Implemented data preprocessing, feature selection, normalisation, and class-imbalance handling. Trained and evaluated multiple classifiers optimising for precision and recall on the minority (attack) class.',
      'Used SHAP values to interpret model decisions and surface which port-based features most strongly indicate intrusion attempts.',
    ],
    tags: ['Python', 'scikit-learn', 'LightGBM', 'pandas', 'NumPy', 'SHAP'],
    github: null,
    demo: null,
    status: 'done',
    doodle: 0,
  },
  {
    id: 'netguard',
    title: 'NetGuard',
    category: 'Android Development · Security',
    blurb: 'An Android security application built in Java that monitors device network behaviour and alerts users to potentially harmful connections.',
    description: [
      'Developed an Android application in Java to give users visibility into network activity happening on their device.',
      'Implemented features to surface active connections, flag known suspicious destinations, and provide actionable alerts.',
      'Focused on a clean, usable interface that surfaces security information without requiring technical expertise from the user.',
    ],
    tags: ['Java', 'Android', 'Network Security'],
    github: null,
    demo: null,
    status: 'done',
    doodle: 3,
  },
  {
    id: 'scam-detect',
    title: 'Scam Detection and Alert System',
    category: 'AI · Cybersecurity',
    blurb: 'A system that analyses text-based communications to identify patterns associated with scam content and alert users before they respond.',
    description: [
      'Designed a text analysis pipeline to classify incoming messages or content as likely scam or legitimate.',
      'Implemented pattern matching and trained a classifier on labelled scam and non-scam text samples.',
      'Integrated an alert mechanism to surface warnings to the user when suspicious content is detected.',
    ],
    tags: ['Python', 'NLP', 'scikit-learn', 'pandas'],
    github: null,
    demo: null,
    status: 'done',
    doodle: 2,
  },
  {
    id: 'nazrana',
    title: 'Nazrana',
    category: 'Web Development · Business Website',
    blurb: 'A luxury silver jewellery brand website focused on premium product presentation, catalogue discovery, and customer inquiry.',
    description: [
      'Built a multi-page business website for a luxury silver jewellery brand with an emphasis on visual identity and elegant product presentation.',
      'Implemented a catalogue section for browsing collections and a contact/inquiry section for customer engagement.',
      'Prioritised typography, spacing, and image presentation to communicate a premium, trustworthy brand experience.',
    ],
    tags: ['HTML', 'CSS', 'JavaScript'],
    github: null,
    demo: null,
    status: 'done',
    doodle: 0,
  },
]

export const about = {
  bio: [
    "I'm a B.Tech Computer Science Engineering student specializing in AI and Machine Learning at UPES who enjoys building practical software systems, AI-powered applications, and interactive digital experiences.",
    "My focus centers on developing practical software systems, machine learning pipelines, and accessible digital tools that solve real-world problems. I enjoy engineering solutions from end to end, from system architecture and model integration to clean, intuitive user experiences.",
    "I learn best by building hands-on projects, continually expanding my technical capabilities across modern AI frameworks, web technologies, and software engineering practices.",
  ],
  education: {
    degree: 'B.Tech in Computer Science Engineering, AI & ML Specialization',
    institution: 'UPES',
    status: 'Started 2024 · Expected Graduation: 2028',
  },
  interests: [
    'Machine Learning & AI systems',
    'Full-stack and application development',
    'Cybersecurity & intelligent threat detection',
    'Assistive and accessible technology',
    'Desktop automation and AI tooling',
  ],
  currentlyLearning: ['LLM integration & prompt engineering', 'ML model deployment', 'System-level programming'],
  achievements: [
    {
      id: 'sih-2026',
      title: 'Smart India Hackathon (SIH), 2026',
      status: 'Selected for Nationals',
      badge: 'Selected for Nationals',
      badgeVariant: 'highlight',
      project: 'Setu (Latest Hackathon Project)',
      year: '2026',
      featured: true,
      description:
        'Selected for the national round of Smart India Hackathon (SIH) 2026 with Setu, an AI-powered competency management copilot for institutional civil service training. Features automated competency profiling, explainable gap identification, and personalized learning pathways. (Selected for Nationals, qualified for the national round).',
    },
    {
      id: 'carevoice-2025',
      title: 'CareVoice: Hackathon Project, 2025',
      status: 'Earlier Hackathon Project',
      badge: '2025 Hackathon Project',
      badgeVariant: 'subtle',
      project: 'CareVoice',
      category: 'AI / Assistive Technology',
      year: '2025',
      featured: false,
      description:
        'Developed CareVoice as an earlier hackathon project in the AI / Assistive Technology category. Engineered an assistive conversational chatbot backed by Python and Flask to lower digital accessibility barriers for users facing standard interface challenges.',
    },
  ],
  experience: [
    {
      category: 'Community Service Internship',
      title: 'Social Internship: Leo Club of Mumbai Vikas',
      organization: 'Leo Club of Mumbai Vikas',
      type: 'Community Service & Civic Welfare (Non-Technical)',
      badge: 'Community Service',
      badgeVariant: 'subtle',
      description:
        'Completed a community service and social welfare internship focused on civic support and environmental welfare initiatives. Dedicated exclusively to community service and social welfare activities, entirely separate from technical projects and hackathon achievements.',
      highlights: [
        'Environmental Initiatives: Participated in tree plantation drives, beach clean-up drives, and plastic recycling campaigns.',
        'Community & Animal Welfare: Feeding stray animals and organizing drives for feeding people in need.',
        'Civic Support & Donations: Raincoat distribution, book and clothes donation drives, and distributing hydrating drinks to on-duty government workers.',
      ],
    },
  ],
  timeline: [
    {
      when: '2024',
      what: 'Started College: B.Tech CSE (AI & ML)',
      where: 'UPES',
      detail:
        'Began B.Tech in Computer Science Engineering specializing in Artificial Intelligence and Machine Learning (Expected graduation: 2028).',
    },
    {
      when: '2024',
      what: 'Social Internship: Community Service',
      where: 'Leo Club of Mumbai Vikas',
      badge: 'Community Service',
      badgeVariant: 'subtle',
      detail:
        'Completed a community service internship focused on environmental initiatives and civic welfare activities (separate from technical work).',
    },
    {
      when: '2025',
      what: 'CareVoice: Hackathon Project',
      where: 'AI / Assistive Technology',
      badge: '2025 Hackathon',
      badgeVariant: 'subtle',
      detail:
        'Earlier hackathon project developing an assistive conversational AI chatbot with a Flask backend to reduce digital interface accessibility barriers.',
    },
    {
      when: '2026',
      what: 'Smart India Hackathon (SIH): 2026',
      where: 'Selected for Nationals · Project: Setu',
      badge: 'Selected for Nationals',
      badgeVariant: 'highlight',
      featured: true,
      detail:
        'Selected for Nationals in Smart India Hackathon 2026 with Setu, my latest hackathon project: an AI competency management copilot for institutional civil service training.',
    },
  ],
}

export const achievements = about.achievements
export const experience = about.experience

export const skills = {
  programming: {
    label: 'Programming',
    items: ['Python', 'Java', 'JavaScript', 'C/C++', 'SQL'],
  },
  aiml: {
    label: 'AI & Machine Learning',
    items: ['NumPy', 'pandas', 'scikit-learn', 'LightGBM', 'SHAP', 'Deep Learning', 'Speech Recognition', 'ONNX'],
  },
  web: {
    label: 'Web & App Development',
    items: ['Next.js', 'FastAPI', 'React', 'Flask', 'HTML', 'CSS', 'Android (Java)', 'Vite'],
  },
  tools: {
    label: 'Tools & Platforms',
    items: ['Git', 'GitHub', 'MySQL', 'Supabase', 'SQLite', 'PyQt6'],
  },
}

export const linkedin = 'https://www.linkedin.com/in/parth-rohit-agarwal'


