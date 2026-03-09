// Transparent Navbar on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if(navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
    });
});

// Reveal Elements on Scroll
function reveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-right');

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', reveal);
// trigger once on load
reveal();

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        let filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Theme Toggle
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Function to set theme
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Check saved theme or establish default (dark)
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // default to dark
    setTheme('dark');
}

if(themeToggleBtn){
    themeToggleBtn.addEventListener('click', () => {

        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// ------ CMS Auto Population Logic ------
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('content.json');
        if (!response.ok) throw new Error("Could not fetch content.json");
        const data = await response.json();
        
        // Determine language from HTML lang attribute
        const lang = document.documentElement.lang === 'tr' ? 'tr' : 'ar';
        
        const setContent = (id, obj, textKey = lang) => {
            const el = document.getElementById(id);
            if (el && obj[textKey]) {
                el.innerHTML = obj[textKey];
            }
        };

        // Site Title
        if(document.title) document.title = data.site_title[lang];
        
        // Navigation
        setContent('nav-home', data.navbar.home);
        setContent('nav-about', data.navbar.about);
        setContent('nav-experience', data.navbar.experience);
        setContent('nav-books', data.navbar.books);
        setContent('nav-portfolio', data.navbar.portfolio);

        // Images 
        const navLogos = document.querySelectorAll('.nav-logo, .footer-logo');
        navLogos.forEach(img => { img.src = data.images.logo; });
        
        const heroImg = document.getElementById('cms-hero-img');
        if (heroImg) heroImg.src = data.images.hero_img;
        
        const booksImg = document.getElementById('cms-books-img');
        if (booksImg) booksImg.src = data.images.books_img;
        
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.href = data.images.logo;

        // Hero
        setContent('hero-greeting', data.hero.greeting);
        const nameNode = document.getElementById('hero-name');
        if(nameNode) {
            nameNode.innerHTML = `${data.hero.name_first[lang]} <span>${data.hero.name_last[lang]}</span>`;
        }
        setContent('hero-title', data.hero.title);
        setContent('hero-desc', data.hero.description);
        setContent('hero-cta1', data.hero.cta_primary);
        setContent('hero-cta2', data.hero.cta_secondary);
        setContent('hero-exp-num', data.hero.experience_years);
        setContent('hero-exp-text', data.hero.experience_text);

        // About
        setContent('about-sec-title', data.about.section_title);
        setContent('about-sec-high', data.about.section_highlight);
        setContent('about-sec-sub', data.about.section_subtitle);
        setContent('about-sum-title', data.about.summary_title);
        setContent('about-sum-text', data.about.summary_text);
        setContent('about-edu-title', data.about.education_title);
        setContent('about-edu-text', data.about.education_text);
        setContent('about-skill-title', data.about.skills_title);
        setContent('about-lang-title', data.about.languages_title);

        // Experience
        setContent('exp-sec-title', data.experience.section_title);
        setContent('exp-sec-high', data.experience.section_highlight);
        setContent('exp-sec-sub', data.experience.section_subtitle);
        
        const timelineContainer = document.getElementById('cms-timeline');
        if (timelineContainer && data.experience.items) {
            timelineContainer.innerHTML = '';
            data.experience.items.forEach(item => {
                timelineContainer.innerHTML += `
                <div class="timeline-item reveal active">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content glass-card">
                        <span class="date">${item.date[lang]}</span>
                        <h3>${item.title[lang]}</h3>
                        <h4>${item.company[lang]}</h4>
                        <p>${item.description[lang]}</p>
                    </div>
                </div>`;
            });
        }

        // Books
        setContent('books-sec-title', data.books.section_title);
        setContent('books-sec-high', data.books.section_highlight);
        setContent('books-sec-sub', data.books.section_subtitle);
        
        const booksListContainer = document.getElementById('cms-books-list');
        if (booksListContainer && data.books.items) {
            booksListContainer.innerHTML = '';
            data.books.items.forEach(book => {
                booksListContainer.innerHTML += `
                <div class="book-item glass-card card-hover">
                    <i class="fas ${book.icon} book-icon"></i>
                    <div class="book-info">
                        <h3>${book.title[lang]}</h3>
                        <p>${book.description[lang]}</p>
                    </div>
                </div>`;
            });
        }

        // Portfolio Top Texts
        setContent('port-sec-title', data.portfolio.section_title);
        setContent('port-sec-high', data.portfolio.section_highlight);
        setContent('port-sec-sub', data.portfolio.section_subtitle);
        setContent('filter-all', data.portfolio.filter_all);
        setContent('filter-social', data.portfolio.filter_social);
        setContent('filter-ui', data.portfolio.filter_uiux);

        // Footer
        setContent('footer-copy', data.footer.copyright);

    } catch (error) {
        console.error("Error loading CMS content:", error);
    }
});
