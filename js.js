// Particles - only on home page
const particlesContainer = document.getElementById('particles-js');
if (particlesContainer) {
    particlesJS("particles-js", {
        particles: {
            number: { value: 70 }, color: { value: "#6366f1" }, opacity: { value: 0.18 }, size: { value: 2.5 },
            line_linked: { enable: true, distance: 140, color: "#6366f1", opacity: 0.12, width: 1 }, move: { speed: 1.8 }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } } }
        },
        retina_detect: true
    });
}

// Progress Bar & Scroll to Top Button
window.onscroll = () => {
    const progress = document.getElementById('progress');
    if (progress) {
        progress.style.width = (scrollY / (document.body.scrollHeight - innerHeight)) * 100 + '%';
    }

    // Show/hide scroll to top button
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
};

// Scroll to Top functionality
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // إغلاق لما تضغط على أي لينك
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // إغلاق لما تضغط بره القائمة
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target) && (!mobileMenuClose || !mobileMenuClose.contains(e.target))) {
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
    "Full Stack & Mobile Developer",
    "Laravel & Flutter Specialist",
    "Backend & Cross-Platform Architect",
    "Web & Mobile Solutions Expert"
];

const typingTextsAR = [
    "مطور ويب وموبايل متكامل",
    "متخصص لارافيل وفلاتر (Flutter)",
    "مهندس أنظمة وتطبيقات متعددة المنصات",
    "خبير حلول الويب والموبايل"
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

// ─── Smart Language Engine ───────────────────────────────────────────────────
// Safely updates only text nodes of elements with data-en/data-ar,
// WITHOUT destroying child elements (icons, spans, etc.)
function applyLang(lang) {
    const isAR = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isAR ? 'rtl' : 'ltr';
    const langTextEl = document.getElementById('langText');
    if (langTextEl) langTextEl.textContent = isAR ? 'AR' : 'EN';

    document.querySelectorAll('[data-en]').forEach(el => {
        // Skip the lang toggle button itself
        if (el.id === 'langToggle' || el.id === 'langText') return;

        const text = isAR ? el.dataset.ar : el.dataset.en;
        if (!text) return;

        // If element has only text (no child elements like icons/spans), set textContent directly
        const hasChildElements = [...el.childNodes].some(n => n.nodeType === 1);
        if (!hasChildElements) {
            el.textContent = text;
            return;
        }

        // Has children: find the first direct text node and update it,
        // OR find a <span> child that carries the text
        const spanChild = el.querySelector('span[data-en], span:not([class])') || el.querySelector('span');
        if (spanChild && !spanChild.hasAttribute('data-en')) {
            spanChild.textContent = text;
        } else if (!spanChild) {
            // Only text nodes, update the first one
            const textNode = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
            if (textNode) textNode.textContent = text;
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        el.placeholder = el.dataset[isAR ? 'placeholderAr' : 'placeholderEn'] || el.placeholder;
    });

    localStorage.setItem('lang', lang);
}

// Language Toggle button
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.onclick = () => {
        const newLang = document.documentElement.lang === 'ar' ? 'en' : 'ar';
        applyLang(newLang);
        // Reset typing effect
        currentTexts = newLang === 'ar' ? typingTextsAR : typingTextsEN;
        textIndex = 0; charIndex = 0; isDeleting = false;
        const te = document.querySelector('.typing');
        if (te) te.textContent = '';
    };
}

// Restore language on load
const savedLang = localStorage.getItem('lang') || 'en';
if (savedLang === 'ar') currentTexts = typingTextsAR;
applyLang(savedLang);

// Start typing effect only on home page
if (document.querySelector('.typing')) {
    setTimeout(typeWriter, 1000);
}

// ══════════════════════════════════════════════
// Contact Form – AJAX submit via Formspree
// ══════════════════════════════════════════════
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const FORMSPREE_URL = contactForm.dataset.action || 'https://formspree.io/f/mojpnzwz';

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const lang = document.documentElement.lang || 'en';
        const isAr = lang === 'ar';

        // ── Clear previous errors ─────────────────────────────
        const oldError = document.getElementById('form-error-msg');
        if (oldError) oldError.remove();
        contactForm.querySelectorAll('.field-error').forEach(e => e.remove());
        contactForm.querySelectorAll('.form-control').forEach(f => f.style.borderColor = '');

        // ── Validate fields ───────────────────────────────────
        const fields = ['name', 'email', 'subject', 'message'];
        let firstEmpty = null;

        for (const id of fields) {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                el.style.borderColor = '#ef4444';
                if (!firstEmpty) firstEmpty = el;
            }
        }

        if (firstEmpty) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'form-error-msg';
            errorDiv.style.cssText = 'background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.4);color:#ef4444;padding:12px;border-radius:8px;margin-bottom:20px;text-align:center;font-weight:600;';
            errorDiv.textContent = isAr ? 'يرجى تعبئة جميع الحقول المطلوبة.' : 'Please fill in all required fields.';
            contactForm.insertBefore(errorDiv, contactForm.firstChild);
            firstEmpty.focus();
            return;
        }

        // ── Email format validation ───────────────────────────
        const emailEl = document.getElementById('email');
        const emailVal = emailEl.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            emailEl.style.borderColor = '#ef4444';
            // Show inline error below email field
            const emailGroup = emailEl.closest('.form-group');
            const oldInline = emailGroup.querySelector('.field-error');
            if (oldInline) oldInline.remove();
            const inlineErr = document.createElement('small');
            inlineErr.className = 'field-error';
            inlineErr.style.cssText = 'color:#ef4444;font-size:0.85rem;margin-top:6px;display:block;';
            inlineErr.textContent = isAr
                ? 'يرجى إدخال بريد إلكتروني صحيح، مثال: mohamed_mahmoud@gmail.com'
                : 'Please enter a valid email address, e.g. mohamed_mahmoud@gmail.com';
            emailGroup.appendChild(inlineErr);
            emailEl.focus();
            return;
        }

        // ── Loading state ─────────────────────────────────────
        const submitBtn = contactForm.querySelector('.submit-btn');
        const savedBtnHTML = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (isAr ? 'جاري الإرسال...' : 'Sending...');
        }

        // ── Send via Formspree ────────────────────────────────
        try {
            const res = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (!res.ok) throw new Error('Server error');

            // ── Success: show card ────────────────────────────
            const container = contactForm.closest('.contact-form-container');
            const formTitle = container.querySelector('.form-title');
            if (formTitle) formTitle.style.display = 'none';
            contactForm.style.display = 'none';

            const card = document.createElement('div');
            card.id = 'successCard';
            card.className = 'contact-success-card';
            card.innerHTML = `
                <div class="success-icon-wrap"><i class="fas fa-check"></i></div>
                <h3 class="success-title">${isAr ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}</h3>
                <p class="success-desc">${isAr ? 'شكراً لتواصلك. سأرد عليك خلال 24 ساعة.' : 'Thank you for reaching out. I will get back to you within 24 hours.'}</p>
                <button type="button" class="reset-form-btn" id="resetFormBtn">
                    <span>${isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}</span>
                    <i class="fas fa-redo-alt"></i>
                </button>
            `;
            container.appendChild(card);

            // ── Reset button ──────────────────────────────────
            document.getElementById('resetFormBtn').addEventListener('click', function () {
                card.remove();
                if (formTitle) formTitle.style.display = '';
                contactForm.reset();
                contactForm.style.display = '';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = savedBtnHTML;
                }
            });

        } catch (_) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = savedBtnHTML;
            }
            alert(isAr ? 'حدث خطأ. تأكد من اتصالك بالإنترنت وحاول مجدداً.' : 'Something went wrong. Please check your connection and try again.');
        }
    });
}



/* Certificates use the same overlay as projects (.modal-visible + X close). */



/* ==========================================================================
   Bi-Directional Scroll Reveal & Stagger Animation Engine
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-tag elements for reveal animations
    const revealSelectors = [
        '.section-title',
        '.about-hero',
        '.info-card',
        '.skills-cat-group',
        '.skill-card-box',
        '.timeline-card-container',
        '.education-card',
        '.certificate-card',
        '.project-card',
        '.contact-card',
        '.contact-form-container'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (!el.classList.contains('reveal-on-scroll')) {
                el.classList.add('reveal-on-scroll');
            }
        });
    });

    // 2. Add directional variants for timeline items
    document.querySelectorAll('.timeline-card-container.left').forEach(el => {
        el.classList.add('reveal-left');
    });
    document.querySelectorAll('.timeline-card-container.right').forEach(el => {
        el.classList.add('reveal-right');
    });

    // 3. Staggered Delays & Alternating Left / Center / Right Flying Assembly
    const gridContainers = document.querySelectorAll(
        '.projects-grid, .certificates-grid, .skills-grid-cards, .info-cards-grid, .education-grid'
    );

    gridContainers.forEach(grid => {
        const children = Array.from(grid.children);
        children.forEach((child, index) => {
            const delay = (index % 6) * 0.04; // Reduced delay from 0.09 for faster loading
            child.style.transitionDelay = `${delay}s`;

            child.classList.remove('reveal-slide-left', 'reveal-slide-right', 'reveal-slide-up');

            if (index % 3 === 0) {
                child.classList.add('reveal-slide-left');
            } else if (index % 3 === 1) {
                child.classList.add('reveal-slide-up');
            } else {
                child.classList.add('reveal-slide-right');
            }
        });
    });

    // 4. Bi-Directional 60FPS Scroll Reveal (Animates smoothly on scroll UP and DOWN)
    const observerOptions = {
        threshold: 0.02, // Trigger earlier
        rootMargin: '50px 0px 50px 0px' // Trigger before it enters viewport
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            } else {
                // Reset when scrolled past viewport safety bounds so it re-reveals smoothly when scrolling back
                const rect = entry.target.getBoundingClientRect();
                if (rect.bottom < -80 || rect.top > window.innerHeight + 80) {
                    entry.target.classList.remove('reveal-active');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });
});



        // ── Image switcher with arrows ────────────────────────
        function showImage(imgId, src) {
            const img = document.getElementById(imgId);
            if (!img) return;
            img.src = src;

            // Highlight thumbnail
            const container = img.closest('.project-modal');
            if(container) {
                const thumbs = container.querySelectorAll('.thumbnails-grid img');
                thumbs.forEach(t => {
                    if (t.src === src) {
                        t.style.border = '2px solid #6366f1';
                    } else {
                        t.style.border = '1px solid #444';
                    }
                });
            }
        }

        window.nextImage = function(imgId) {
            const img = document.getElementById(imgId);
            if (!img) return;
            const container = img.closest('.project-modal');
            if(!container) return;
            const thumbs = Array.from(container.querySelectorAll('.thumbnails-grid img'));
            if(thumbs.length === 0) return;

            let currentIndex = thumbs.findIndex(t => t.src === img.src);
            if(currentIndex === -1) currentIndex = 0;

            let nextIndex = (currentIndex + 1) % thumbs.length;
            showImage(imgId, thumbs[nextIndex].src);
        }

        window.prevImage = function(imgId) {
            const img = document.getElementById(imgId);
            if (!img) return;
            const container = img.closest('.project-modal');
            if(!container) return;
            const thumbs = Array.from(container.querySelectorAll('.thumbnails-grid img'));
            if(thumbs.length === 0) return;

            let currentIndex = thumbs.findIndex(t => t.src === img.src);
            if(currentIndex === -1) currentIndex = 0;

            let prevIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
            showImage(imgId, thumbs[prevIndex].src);
        }
        
window.openCertModal = function (src, title, subtitle, desc, tagsStr) {
    const modal = document.getElementById('certModal');
    const img = document.getElementById('modalImg');
    const titleEl = document.getElementById('certModalTitle');
    const subtitleEl = document.getElementById('certModalSubtitle');
    const descEl = document.getElementById('certModalDesc');
    const tagsContainer = document.getElementById('certModalTags');
    const fullImgBtn = document.getElementById('certModalFullImg');

    if (!modal || !img) return;

    img.src = src;
    if (titleEl && title) titleEl.textContent = title;
    if (subtitleEl && subtitle) subtitleEl.textContent = subtitle;
    if (descEl && desc) descEl.textContent = desc;
    if (fullImgBtn) fullImgBtn.href = src;

    if (tagsContainer && tagsStr) {
        tagsContainer.innerHTML = '';
        tagsStr.split(',').forEach(t => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = t.trim();
            tagsContainer.appendChild(span);
        });
    }

    modal.classList.remove('active');
    modal.style.display = '';
    modal.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
};

window.closeCertModal = function () {
    const modal = document.getElementById('certModal');
    if (!modal) return;
    modal.classList.remove('modal-visible', 'active');
    modal.style.display = '';
    document.body.style.overflow = 'auto';
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.certificate-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const thumb = card.querySelector('.certificate-thumb');
            if (thumb && typeof thumb.onclick === 'function') {
                thumb.onclick();
            }
        });
    });

    const certModal = document.getElementById('certModal');
    if (!certModal) return;

    certModal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.closeCertModal();
        });
    });

    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) window.closeCertModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.classList.contains('modal-visible')) {
            window.closeCertModal();
        }
    });
});
