document.addEventListener('DOMContentLoaded', () => {
    fetch('data/data.json')
        .then(response => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(data => {
            renderHero(data.profile);
            renderAbout(data.profile.bio);
            renderProjects(data.projects);
            renderVideos(data.youtube);
            renderTimeline('experience-container', data.experience);
            renderSpeaking(data.speaking);
            renderPublications(data.publications);
            renderResearch(data.research);
            renderTechnologies(data.technologies);
            renderTimeline('education-container', data.education);
            renderTimeline('courses-container', data.courses);
            renderLanguages(data.languages);
            renderFooter(data);
            initScrollAnimations();
            initStickyNav();
            initThemeToggle();
            initActiveNavTracking();
        })
        .catch(function(error) {
            console.error('Error loading data:', error);
            document.querySelector('main').innerHTML = '<p style="text-align:center;padding:40px;color:var(--color-text-secondary)">Unable to load content. Please refresh the page.</p>';
        });
});

/* ============================================
   Sanitize HTML: only allow <b>, <i>, <a>, <br>, <strong>, <em>
   ============================================ */

var ALLOWED_TAGS = ['B', 'I', 'A', 'BR', 'STRONG', 'EM'];

function sanitizeHTML(dirty) {
    var template = document.createElement('template');
    template.innerHTML = dirty;
    var nodes = template.content.querySelectorAll('*');
    nodes.forEach(function(node) {
        if (ALLOWED_TAGS.indexOf(node.tagName) === -1) {
            node.replaceWith(document.createTextNode(node.textContent));
        } else {
            // Strip all attributes except href on <a>
            Array.from(node.attributes).forEach(function(attr) {
                if (!(node.tagName === 'A' && attr.name === 'href')) {
                    node.removeAttribute(attr.name);
                }
            });
            if (node.tagName === 'A') {
                var href = node.getAttribute('href') || '';
                if (!/^(https?:\/\/|mailto:|\/)/i.test(href)) {
                    node.removeAttribute('href');
                }
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer');
            }
        }
    });
    return template.innerHTML;
}

/* ============================================
   Hero
   ============================================ */

function renderHero(profile) {
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-image').src = profile.image;
    document.getElementById('hero-headline').textContent = profile.headline;
    document.getElementById('hero-tagline').textContent = profile.tagline;

    var metricsContainer = document.getElementById('hero-metrics');
    profile.metrics.forEach(function(m) {
        var div = document.createElement('div');
        div.className = 'metric';

        var value = document.createElement('span');
        value.className = 'metric-value';
        value.textContent = m.value;

        var label = document.createElement('span');
        label.className = 'metric-label';
        label.textContent = m.label;

        div.appendChild(value);
        div.appendChild(label);
        metricsContainer.appendChild(div);
    });
}

/* ============================================
   About
   ============================================ */

function renderAbout(bio) {
    if (!bio || bio.length === 0) return;
    var container = document.getElementById('about-container');
    bio.forEach(function(paragraph) {
        var p = document.createElement('p');
        p.textContent = paragraph;
        container.appendChild(p);
    });
}

/* ============================================
   Projects
   ============================================ */

function renderProjects(projects) {
    var container = document.getElementById('projects-container');
    projects.forEach(function(project) {
        var card = document.createElement('a');
        card.className = 'project-card';
        card.href = project.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        var header = document.createElement('div');
        header.className = 'project-header';

        var title = document.createElement('h3');
        title.textContent = project.name;
        header.appendChild(title);

        if (project.stars) {
            var stars = document.createElement('span');
            stars.className = 'project-stars';
            stars.textContent = '\u2605 ' + project.stars;
            header.appendChild(stars);
        }

        var desc = document.createElement('p');
        desc.textContent = project.tagline;

        var tags = document.createElement('div');
        tags.className = 'project-tags';
        project.tech.forEach(function(t) {
            var tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = t;
            tags.appendChild(tag);
        });

        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(tags);
        container.appendChild(card);
    });
}

/* ============================================
   Videos
   ============================================ */

function renderVideos(youtube) {
    if (!youtube || !youtube.featured_videos || youtube.featured_videos.length === 0) return;

    var container = document.getElementById('videos-container');
    youtube.featured_videos.forEach(function(video) {
        var card = document.createElement('div');
        card.className = 'video-card';

        var lite = document.createElement('lite-youtube');
        lite.setAttribute('videoid', video.id);
        lite.setAttribute('playlabel', video.title);

        var title = document.createElement('div');
        title.className = 'video-card-title';
        title.textContent = video.title;

        card.appendChild(lite);
        card.appendChild(title);
        container.appendChild(card);
    });

    var ctaContainer = document.getElementById('youtube-cta');
    var link = document.createElement('a');
    link.href = youtube.channel_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View all videos on YouTube \u2192';
    ctaContainer.appendChild(link);
}

/* ============================================
   Timeline (Experience, Education, Courses)
   ============================================ */

function renderTimeline(containerId, items) {
    var container = document.getElementById(containerId);
    items.forEach(function(item) {
        var el = document.createElement('div');
        el.className = 'timeline-item';

        if (item.date) {
            var date = document.createElement('div');
            date.className = 'timeline-date';
            date.textContent = item.date;
            el.appendChild(date);
        }

        var title = document.createElement('div');
        title.className = 'timeline-title';
        title.textContent = item.title;
        el.appendChild(title);

        if (item.subtitle) {
            var subtitle = document.createElement('div');
            subtitle.className = 'timeline-subtitle';
            subtitle.textContent = item.subtitle;
            el.appendChild(subtitle);
        }

        if (item.description) {
            var desc = document.createElement('div');
            desc.className = 'timeline-description';
            desc.innerHTML = sanitizeHTML(item.description);
            el.appendChild(desc);
        }

        container.appendChild(el);
    });
}

/* ============================================
   Speaking & Teaching
   ============================================ */

function renderSpeaking(items) {
    if (!items || items.length === 0) return;

    var container = document.getElementById('speaking-container');
    items.forEach(function(item) {
        var card;
        if (item.url) {
            card = document.createElement('a');
            card.href = item.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
        } else {
            card = document.createElement('div');
        }
        card.className = 'speaking-card';

        var badge = document.createElement('div');
        badge.className = 'type-badge';
        badge.textContent = item.type;

        var title = document.createElement('h3');
        title.textContent = item.title;

        var desc = document.createElement('p');
        desc.textContent = item.description;

        card.appendChild(badge);
        card.appendChild(title);
        card.appendChild(desc);
        container.appendChild(card);
    });
}

/* ============================================
   LinkedIn Posts
   ============================================ */

function renderPublications(posts) {
    if (!posts || posts.length === 0) return;

    var container = document.getElementById('linkedin-container');
    posts.forEach(function(post) {
        var card = document.createElement('a');
        card.className = 'post-card';
        card.href = post.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        var meta = document.createElement('div');
        meta.className = 'post-date';
        var parts = [post.date];
        if (post.source) parts.push(post.source);
        meta.textContent = parts.join(' · ');

        var title = document.createElement('h3');
        title.textContent = post.title;

        var summary = document.createElement('p');
        summary.textContent = post.summary;

        card.appendChild(meta);
        card.appendChild(title);
        card.appendChild(summary);
        container.appendChild(card);
    });
}

/* ============================================
   Academic Research
   ============================================ */

function renderResearch(items) {
    if (!items || items.length === 0) return;

    var container = document.getElementById('research-container');
    items.forEach(function(item) {
        var card = document.createElement('a');
        card.className = 'post-card';
        card.href = item.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        var meta = document.createElement('div');
        meta.className = 'post-date';
        meta.textContent = item.year + ' · ' + item.venue;

        var title = document.createElement('h3');
        title.textContent = item.title;

        var authors = document.createElement('p');
        authors.textContent = item.authors;

        card.appendChild(meta);
        card.appendChild(title);
        card.appendChild(authors);
        container.appendChild(card);
    });
}

/* ============================================
   Technologies
   ============================================ */

function renderTechnologies(categories) {
    var container = document.getElementById('technologies-container');
    categories.forEach(function(cat) {
        var card = document.createElement('div');
        card.className = 'tech-card';

        var title = document.createElement('h3');
        title.textContent = cat.category;

        var tagsDiv = document.createElement('div');
        tagsDiv.className = 'tech-card-tags';
        cat.items.forEach(function(item) {
            var tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = item;
            tagsDiv.appendChild(tag);
        });

        card.appendChild(title);
        card.appendChild(tagsDiv);
        container.appendChild(card);
    });
}

/* ============================================
   Languages
   ============================================ */

function renderLanguages(languages) {
    var container = document.getElementById('languages-container');
    languages.forEach(function(lang) {
        var item = document.createElement('div');
        item.className = 'language-item';

        var name = document.createElement('h3');
        name.textContent = lang.language;

        var level = document.createElement('span');
        level.textContent = lang.level;

        item.appendChild(name);
        item.appendChild(level);
        container.appendChild(item);
    });
}

/* ============================================
   SVG Icons (Simple Icons / Lucide)
   ============================================ */

var ICONS = {
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
    stackoverflow: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154z"/></svg>'
};

/* ============================================
   Footer
   ============================================ */

function renderFooter(data) {
    // Footer text
    var footerTextEl = document.getElementById('available-for');
    if (data.profile.footer_text) {
        footerTextEl.textContent = data.profile.footer_text;
    }

    // Contact links
    var linksContainer = document.getElementById('footer-links');
    data.contact.forEach(function(link) {
        var a = document.createElement('a');
        a.className = 'footer-link';
        a.href = link.url;
        if (link.url.startsWith('http')) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }

        var icon = document.createElement('span');
        icon.className = 'footer-link-icon';
        if (ICONS[link.icon]) {
            icon.innerHTML = ICONS[link.icon];
        }

        var text = document.createElement('span');
        text.textContent = link.title;

        a.appendChild(icon);
        a.appendChild(text);
        linksContainer.appendChild(a);
    });

    // Research links
    var researchContainer = document.getElementById('footer-research-links');
    data.research_profiles.forEach(function(link) {
        var a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.title;
        researchContainer.appendChild(a);
    });
}

/* ============================================
   Scroll Animations (IntersectionObserver)
   ============================================ */

function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // Group elements by parent section for stagger delays
    var sections = document.querySelectorAll('.section, .footer');
    sections.forEach(function(section) {
        var elements = section.querySelectorAll(
            '.about-content, .project-card, .video-card, .timeline-item, .speaking-card, .post-card, .tech-card, .language-item, .section-title, .subsection-title'
        );
        elements.forEach(function(el, i) {
            el.classList.add('reveal');
            el.style.transitionDelay = Math.min(i * 0.08, 0.4) + 's';
            observer.observe(el);
        });
    });
}

/* ============================================
   Sticky Nav
   ============================================ */

function initStickyNav() {
    var nav = document.getElementById('main-nav');
    var hero = document.getElementById('hero');

    var observer = new IntersectionObserver(function(entries) {
        var isHeroVisible = entries[0].isIntersecting;
        nav.classList.toggle('visible', !isHeroVisible);
        // Prevent keyboard focus on hidden nav
        var links = nav.querySelectorAll('a, button');
        links.forEach(function(el) {
            el.tabIndex = isHeroVisible ? -1 : 0;
        });
    }, { threshold: 0, rootMargin: '-56px 0px 0px 0px' });

    observer.observe(hero);
}

/* ============================================
   Active Nav Link Tracking
   ============================================ */

function initActiveNavTracking() {
    var navLinks = document.querySelectorAll('.nav-links a');
    var sectionMap = [];
    var currentActive = null;

    navLinks.forEach(function(link) {
        var id = link.getAttribute('href').slice(1);
        var section = document.getElementById(id);
        if (section) sectionMap.push({ id: id, el: section, link: link });
    });

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            var match = sectionMap.find(function(s) { return s.el === entry.target; });
            if (match) match.isVisible = entry.isIntersecting;
        });
        // Only highlight the first visible section
        var firstVisible = sectionMap.find(function(s) { return s.isVisible; });
        if (currentActive) currentActive.classList.remove('active');
        if (firstVisible) {
            firstVisible.link.classList.add('active');
            currentActive = firstVisible.link;
        }
    }, { threshold: 0.15, rootMargin: '-56px 0px -40% 0px' });

    sectionMap.forEach(function(s) { observer.observe(s.el); });
}

/* ============================================
   Theme Toggle
   ============================================ */

function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    var root = document.documentElement;

    // Theme already applied by inline script in <head>
    updateToggleIcon();

    toggle.addEventListener('click', function() {
        var isDark = root.getAttribute('data-theme') === 'dark' ||
            (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

        var newTheme = isDark ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon();
    });

    function updateToggleIcon() {
        var theme = root.getAttribute('data-theme');
        var isDark = theme === 'dark' ||
            (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        toggle.textContent = isDark ? '\u2600' : '\u263E';
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
}
