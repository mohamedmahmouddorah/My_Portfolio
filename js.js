// Particles - only on home page
const particlesContainer = document.getElementById('particles-js');
if (particlesContainer) {
    particlesJS("particles-js", {
        particles: {
            number: { value: 80 }, color: { value: "#6366f1" }, opacity: { value: 0.2 }, size: { value: 3 },
            line_linked: { enable: true, distance: 140, color: "#6366f1", opacity: 0.15, width: 1 }, move: { speed: 2 }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } } }
        },
        retina_detect: true
    });
}

// Progress Bar
window.onscroll = () => {
    const progress = document.getElementById('progress');
    if (progress) {
        progress.style.width = (scrollY / (document.body.scrollHeight - innerHeight)) * 100 + '%';
    }
};

// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // إغلاق لما تضغط على أي لينك
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // إغلاق لما تضغط بره القائمة
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Theme Toggle - Load saved theme
const themeBtn = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');
const savedTheme = localStorage.getItem('theme') || 'dark';

if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
}

if (themeBtn) {
    themeBtn.onclick = () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        if (icon) {
            icon.classList.toggle('fa-sun', isLight);
            icon.classList.toggle('fa-moon', !isLight);
        }
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };
}

// Language + Typing Effect
const typingTextsEN = [
    "Full Stack Laravel Developer",
    "Backend & API Specialist",
    "Scalable Systems Architect",
    "E-commerce Solutions Expert"
];

const typingTextsAR = [
    "مطور Full-Stack لارافيل",
    "متخصص باك إند وواجهات برمجة",
    "مهندس أنظمة قابلة للتوسع",
    "خبير حلول التجارة الإلكترونية"
];

let currentTexts = typingTextsEN;
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.querySelector('.typing');

function typeWriter() {
    const currentText = currentTexts[textIndex];

    if (isDeleting) {
        typingEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentText.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % currentTexts.length;
        speed = 500;
    }

    setTimeout(typeWriter, speed);
}

// Language Toggle
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.onclick = () => {
        const isEN = document.documentElement.lang === 'en';
        document.documentElement.lang = isEN ? 'ar' : 'en';
        document.documentElement.dir = isEN ? 'rtl' : 'ltr';
        const langText = document.getElementById('langText');
        if (langText) langText.textContent = isEN ? 'AR' : 'EN';

        // Update typing effect if exists
        currentTexts = isEN ? typingTextsAR : typingTextsEN;
        textIndex = 0;
        charIndex = 0;
        isDeleting = false;
        const typingEl = document.querySelector('.typing');
        if (typingEl) {
            typingEl.textContent = '';
        }

        // Update all elements with data-en and data-ar attributes (including labels, buttons, etc.)
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = isEN ? el.dataset.ar : el.dataset.en;
            if (text) {
                if (el.tagName === 'BUTTON' && el.querySelector('span')) {
                    el.querySelector('span').textContent = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update button spans without parent data attributes
        document.querySelectorAll('.btn span').forEach(span => {
            const parent = span.parentElement;
            if (parent && parent.dataset) {
                span.textContent = parent.dataset[isEN ? 'ar' : 'en'];
            }
        });

        localStorage.setItem('lang', isEN ? 'ar' : 'en');
    };
}

// First load - restore language preference
const savedLang = localStorage.getItem('lang') || 'en';
document.documentElement.lang = savedLang;
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

const langText = document.getElementById('langText');
if (langText) {
    langText.textContent = savedLang === 'ar' ? 'AR' : 'EN';
}

if (savedLang === 'ar') {
    currentTexts = typingTextsAR;
} else {
    currentTexts = typingTextsEN;
}

// Update all elements on page load
document.querySelectorAll('[data-en]').forEach(el => {
    const text = savedLang === 'ar' ? el.dataset.ar : el.dataset.en;
    if (text) {
        if (el.tagName === 'BUTTON' && el.querySelector('span')) {
            el.querySelector('span').textContent = text;
        } else {
            el.textContent = text;
        }
    }
});

// Update button spans
document.querySelectorAll('.btn span').forEach(span => {
    const parent = span.parentElement;
    if (parent && parent.dataset) {
        span.textContent = parent.dataset[savedLang === 'ar' ? 'ar' : 'en'];
    }
});

// Start typing effect only on home page
if (document.querySelector('.typing')) {
    setTimeout(typeWriter, 1000);
}

// Contact form submit handler: EmailJS + formatted mailto fallback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const subjectEl = document.getElementById('subject');
        const messageEl = document.getElementById('message');
        const name = nameEl ? nameEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';
        const subject = subjectEl ? subjectEl.value.trim() : '';
        const message = messageEl ? messageEl.value.trim() : '';
        const lang = document.documentElement.lang || 'en';

        const missingMsg = lang === 'ar' ? 'يرجى تعبئة جميع الحقول المطلوبة.' : 'Please fill in all required fields.';
        if (!name || !email || !subject || !message) {
            alert(missingMsg);
            return;
        }

        // Check if EmailJS is configured
        const serviceId = contactForm.dataset.service;
        const templateId = contactForm.dataset.template;
        const userId = contactForm.dataset.user;

        // Helper to show localized confirmation
        function showConfirmation(text) {
            const formContainer = document.querySelector('.contact-form-container');
            if (formContainer) {
                formContainer.innerHTML = `<div class="form-sent" style="padding:20px;background:rgba(99,102,241,0.06);border-radius:8px;text-align:center;font-weight:600;">${text}</div>`;
            }
        }

        // Try EmailJS first if configured with real IDs
        if (serviceId && serviceId !== 'YOUR_EMAILJS_SERVICE_ID' && templateId && templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' && userId && userId !== 'YOUR_EMAILJS_USER_ID' && window.emailjs) {
            try {
                emailjs.init(userId);
                emailjs.sendForm(serviceId, templateId, '#contactForm')
                    .then(function () {
                        const okText = lang === 'ar' ? 'تم إرسال رسالتك بنجاح. شكراً!' : 'Your message was sent successfully. Thank you!';
                        showConfirmation(okText);
                    }, function (err) {
                        console.error('EmailJS error:', err);
                        const failText = lang === 'ar' ? 'حدث خطأ. المرجو المحاولة مجددا.' : 'An error occurred. Please try again.';
                        alert(failText);
                    });
            } catch (err) {
                console.error('EmailJS exception:', err);
                fallbackToFormattedEmail();
            }
        } else {
            // EmailJS not configured or SDK not loaded
            fallbackToFormattedEmail();
        }

        // Fallback function: formatted mailto with all fields clearly separated
        function fallbackToFormattedEmail() {
            const recipient = 'mohamedmahmouddorah@gmail.com';
            const bodyText = `${lang === 'ar' ? '=== معلومات المرسل ===' : '=== Sender Information ==='}
${lang === 'ar' ? 'الاسم:' : 'Name:'} ${name}
${lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'} ${email}

${lang === 'ar' ? '=== الموضوع ===' : '=== Subject ==='}
${subject}

${lang === 'ar' ? '=== الرسالة ===' : '=== Message ==='}
${message}`;
            const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

            // Open user's mail client
            window.location.href = mailto;
            showConfirmation(lang === 'ar' ? 'تم فتح برنامج البريد. شكراً!' : 'Your mail client was opened. Thank you!');
        }
    });
}

// ==========================================
// API INTEGRATION
// ==========================================
const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchPortfolioData() {
    updateLanguageText();
    try {
        // Determine if we need to fetch data based on page content
        const needsSkills = document.getElementById('backend-skills');
        const needsExp = document.getElementById('experience-container');
        const needsEdu = document.getElementById('education-container');

        // If current page doesn't have any of these containers, skip fetching
        if (!needsSkills && !needsExp && !needsEdu) return;
        console.log('Front-end mode active: Skipping API fetch');
        updateLanguageText(); 
        return;

        // Check for hardcoded content to prevent overwrite
        if ((needsSkills && needsSkills.innerHTML.trim().length > 0) ||
            (needsExp && needsExp.innerHTML.trim().length > 0) ||
            (needsEdu && needsEdu.innerHTML.trim().length > 0)) {
            console.log('Static content detected. Skipping API fetch.');
            updateLanguageText();
            return;
        }

        // Scroll Reveal Animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        const scrollElements = document.querySelectorAll('.scroll-reveal');
        scrollElements.forEach(el => observer.observe(el));
        console.log('Fetching portfolio data...');
        const response = await fetch(`${API_BASE_URL}/portfolio`);

        if (!response.ok) {
            console.warn('API not reachable. Using static fallback if available.');
            return;
        }
        const data = await response.json();
        console.log("API Data:", data);

        if (needsSkills && data.skills) renderSkills(data.skills);
        if (needsExp && data.experience) renderExperience(data.experience);
        if (needsEdu && data.education) renderEducation(data.education);

    } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
    }
}

function renderSkills(skillsGrouped) {
    const categories = {
        'backend': 'backend-skills',
        'frontend': 'frontend-skills',
        'languages': 'language-skills',
        'tools': 'tools-skills'
    };

    for (const [catKey, containerId] of Object.entries(categories)) {
        const container = document.getElementById(containerId);
        // Check if container exists and if we have data for this category
        if (!container || !skillsGrouped[catKey]) continue;

        container.innerHTML = skillsGrouped[catKey].map(skill => `
                    <div class="skill-card card-hover">
                        ${skill.icon ? `<i class="${skill.icon} skill-icon"></i>` : ''}
                        <h3>${skill.name_en}</h3>
                        <p data-en="${skill.name_en} - ${skill.proficiency}%" data-ar="${skill.name_ar} - ${skill.proficiency}%"></p>
                    </div>
                `).join('');
    }
    // Trigger language update to set initial text
    updateLanguageText();
}

function renderExperience(experiences) {
    const container = document.getElementById('experience-container');
    if (!container) return;

    container.innerHTML = experiences.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content card-hover">
                        <span class="timeline-date">${exp.period}</span>
                        <h3 data-en="${exp.role_en}" data-ar="${exp.role_ar}"></h3>
                        <h4 data-en="${exp.company_en}" data-ar="${exp.company_ar}"></h4>
                        <div class="desc-content" style="margin-top:10px" data-en="${exp.description_en || ''}" data-ar="${exp.description_ar || ''}">
                        </div>
                    </div>
                </div>
            `).join('');
    updateLanguageText();
}

function renderEducation(educations) {
    const container = document.getElementById('education-container');
    if (!container) return;

    container.innerHTML = educations.map(edu => `
                <div class="edu-card card-hover">
                    <i class="fas fa-graduation-cap"></i>
                    <h3 data-en="${edu.degree_en}" data-ar="${edu.degree_ar}"></h3>
                    <span class="edu-year" data-en="${edu.year}" data-ar="${edu.year}"></span>
                    <p data-en="${edu.description_en || ''}" data-ar="${edu.description_ar || ''}"></p>
                </div>
            `).join('');
    updateLanguageText();
}

// Helper to update text after dynamic injection
function updateLanguageText() {
    const isEN = document.documentElement.lang === 'en' || !document.documentElement.lang; // default en

    // Create list from text if it contains dashes
    const formatList = (text) => {
        if (text && text.includes('- ')) {
            return '<ul class="custom-list">' +
                text.split('\n').filter(line => line.trim().startsWith('-')).map(line => `<li>${line.replace(/^- /, '')}</li>`).join('') +
                '</ul>';
        }
        return text;
    };

    document.querySelectorAll('[data-en]').forEach(el => {
        const text = isEN ? el.dataset.en : el.dataset.ar;
        if (text) {
            if (el.classList.contains('desc-content')) {
                el.innerHTML = formatList(text);
            } else if (el.tagName === 'BUTTON' && el.querySelector('span')) {
                el.querySelector('span').textContent = text;
            } else {
                el.textContent = text;
            }
        }
    });
}

// Call on load
document.addEventListener('DOMContentLoaded', fetchPortfolioData);

/* --- Manual Image Lightbox for Certificates --- */
document.addEventListener('DOMContentLoaded', () => {
    const certModal = document.getElementById('certModal');
    const modalImg  = document.getElementById('modalImg');
    const certThumbs = document.querySelectorAll('.certificate-thumb img');

    if (!certModal || !modalImg) return;

    // ── دالة الفتح ──────────────────────────────────────────
    function openCertModal(src, alt) {
        modalImg.src = src;
        modalImg.alt = alt || '';
        certModal.style.display = 'flex';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                certModal.classList.add('active');
            });
        });
        document.body.style.overflow = 'hidden';
    }

    // ── دالة الغلق ──────────────────────────────────────────
    function closeCertModal() {
        certModal.classList.remove('active');
        setTimeout(() => {
            certModal.style.display = 'none';
            modalImg.src = '';
        }, 400);
        document.body.style.overflow = '';
    }

    // ── فتح عند الضغط على الصورة ───────────────────────────
    certThumbs.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            openCertModal(e.target.src, e.target.alt);
        });
    });

    // ── زرار الغلق × ────────────────────────────────────────
    const certCloseBtn = certModal.querySelector('.cert-close-btn');
    if (certCloseBtn) {
        certCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCertModal();
        });
        // دعم اللمس على الموبايل
        certCloseBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeCertModal();
        });
    }

    // ── غلق عند الضغط على الـ background بس ────────────────
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) closeCertModal();
    });

    // ── غلق بالـ Escape ──────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });
});

/* --- 3D Vanilla-Tilt.js Interactions --- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject VanillaTilt.js dynamically if not present
    if (typeof VanillaTilt === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js';
        script.onload = initTilt;
        document.head.appendChild(script);
    } else {
        initTilt();
    }

    function initTilt() {
        // 2. Initialize VanillaTilt only on the hero section, keeping cards clean and professional
        VanillaTilt.init(document.querySelectorAll(".hero-content-3d"), {
            max: 5,            // Extremely subtle for hero
            speed: 600,
            glare: true,
            "max-glare": 0.1,  
            perspective: 1000,
            transition: true,
            easing: "cubic-bezier(.03,.98,.52,.99)"
        });
    }
});