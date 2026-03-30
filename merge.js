const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
const pagesDir = path.join(__dirname, 'pages');

// Read original index.html
let indexHtml = fs.readFileSync(indexFile, 'utf8');

// Extract everything before the footer
const footerMatch = indexHtml.match(/<footer[\s\S]*/);
const footerAndAfter = footerMatch ? footerMatch[0] : '';
const beforeFooter = indexHtml.substring(0, indexHtml.indexOf('<footer'));

// Pages to merge in navbar order
const pages = [
    { file: 'about.html', id: 'about' },
    { file: 'skills.html', id: 'skills' },
    { file: 'experience.html', id: 'experience' },
    { file: 'education.html', id: 'education' },
    { file: 'projects.html', id: 'projects' },
    { file: 'contact.html', id: 'contact' }
];

let sections = '';

pages.forEach(page => {
    const filePath = path.join(pagesDir, page.file);
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Extract content between <main> tags (all pages use <main class="main-content">)
    const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
    if (mainMatch) {
        let content = mainMatch[0];
        // Fix image paths: ../imges -> imges
        content = content.replace(/\.\.\/imges/g, 'imges');
        // Fix cv path
        content = content.replace(/\.\.\/cv\.pdf/g, 'cv.pdf');
        // Fix internal page links
        content = content.replace(/href="projects\.html"/g, 'href="#projects"');
        content = content.replace(/href="education\.html"/g, 'href="#education"');
        content = content.replace(/href="contact\.html"/g, 'href="#contact"');
        content = content.replace(/href="about\.html"/g, 'href="#about"');
        content = content.replace(/href="skills\.html"/g, 'href="#skills"');
        content = content.replace(/href="experience\.html"/g, 'href="#experience"');
        
        // Add section id - extract the section from inside main and add id
        // Replace <main class="main-content"> wrapper with just the section content + id
        content = content.replace(/<main[^>]*>/, '');
        content = content.replace(/<\/main>/, '');
        
        // Add id to the first <section> tag if not present
        if (!content.includes(`id="${page.id}"`)) {
            content = content.replace(/<section/, `<section id="${page.id}"`);
        }
        
        sections += '\n    <!-- ' + page.id.charAt(0).toUpperCase() + page.id.slice(1) + ' Section -->\n' + content.trim() + '\n';
    }
});

// Extract modals from projects.html (they are outside <main>)
const projectsHtml = fs.readFileSync(path.join(pagesDir, 'projects.html'), 'utf8');
let modals = '';
const modalMatches = projectsHtml.match(/<div class="project-modal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g);
if (modalMatches) {
    modalMatches.forEach(modal => {
        let m = modal.replace(/\.\.\/imges/g, 'imges');
        modals += '\n    ' + m + '\n';
    });
}

// Also get the certificate modal from education
const eduHtml = fs.readFileSync(path.join(pagesDir, 'education.html'), 'utf8');
const certModalMatch = eduHtml.match(/<div class="certificate-modal"[\s\S]*?<\/div>\s*<\/div>/);
let certModal = '';
if (certModalMatch) {
    certModal = '\n    ' + certModalMatch[0] + '\n';
}

// Update nav links to hash links
let result = beforeFooter;
result = result.replace(/href="index\.html"/g, 'href="#"');
result = result.replace(/href="pages\/about\.html"/g, 'href="#about"');
result = result.replace(/href="pages\/skills\.html"/g, 'href="#skills"');
result = result.replace(/href="pages\/experience\.html"/g, 'href="#experience"');
result = result.replace(/href="pages\/education\.html"/g, 'href="#education"');
result = result.replace(/href="pages\/projects\.html"/g, 'href="#projects"');
result = result.replace(/href="pages\/contact\.html"/g, 'href="#contact"');

// Add CSS imports for contact and projects
result = result.replace(
    "@import url('css/premium.css');",
    "@import url('css/premium.css');\n        @import url('css/projects.css');\n        @import url('css/contact.css');"
);

// Build final HTML
let finalHtml = result + sections + modals + certModal + '\n' + footerAndAfter;

// Replace the script tag section to add inline scripts for project filtering, modals, etc.
finalHtml = finalHtml.replace(
    '<script src="js.js"></script>\n</body>',
    `<script src="js.js"></script>
    <script>
        // Project Filtering
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const emptyState = document.getElementById('emptyState');
        if (filterButtons.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const filter = button.getAttribute('data-filter');
                    let visibleCount = 0;
                    projectCards.forEach(card => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'flex';
                            card.classList.remove('visible');
                            setTimeout(() => card.classList.add('visible'), 50);
                            visibleCount++;
                        } else { card.style.display = 'none'; }
                    });
                    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
                });
            });
        }
        // Modal Logic
        document.querySelectorAll('.view-project').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = document.getElementById(button.getAttribute('data-project'));
                if (modal) { modal.classList.add('modal-visible'); document.body.style.overflow = 'hidden'; }
            });
        });
        const closeModal = () => { document.querySelectorAll('.modal-visible').forEach(m => m.classList.remove('modal-visible')); document.body.style.overflow = 'auto'; };
        document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', closeModal));
        window.addEventListener('click', (e) => { if (e.target.classList.contains('project-modal') || e.target.classList.contains('certificate-modal')) closeModal(); });
        // Skills animation
        document.addEventListener('DOMContentLoaded', () => {
            const fills = document.querySelectorAll('.progress-fill');
            fills.forEach(fill => { const w = fill.style.width; fill.style.width = '0'; setTimeout(() => fill.style.width = w, 300); });
        });
        // Smooth scroll for nav links
        document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    const target = document.getElementById(href.substring(1));
                    if (target) { window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' }); }
                    const mm = document.getElementById('mobileMenu');
                    if (mm && mm.classList.contains('active')) mm.classList.remove('active');
                } else if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    const mm = document.getElementById('mobileMenu');
                    if (mm && mm.classList.contains('active')) mm.classList.remove('active');
                }
            });
        });
        // Active nav link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
            let current = '';
            sections.forEach(s => { if (pageYOffset >= s.offsetTop - 150) current = s.getAttribute('id'); });
            links.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('href') === '#' + current) l.classList.add('active');
                if (pageYOffset < 100 && l.getAttribute('href') === '#') l.classList.add('active');
            });
        });
    </script>
</body>`
);

fs.writeFileSync(indexFile, finalHtml);
console.log('Merge complete! All sections integrated into index.html');
