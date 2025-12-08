document.addEventListener('DOMContentLoaded', () => {
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            renderProfile(data.profile);
            renderLinks('contact-container', data.contact);
            renderLinks('programming-container', data.programming);
            renderLinks('research-container', data.research);

            renderTimeline('experience-container', data.experience);
            renderTimeline('education-container', data.education);
            renderTimeline('courses-container', data.courses);
            renderTechnologies(data.technologies);
            renderLanguages(data.languages);
        })
        .catch(error => console.error('Error loading data:', error));
});

function renderProfile(profile) {
    document.getElementById('profile-name').innerHTML = profile.name;
    document.getElementById('profile-image').src = profile.image;

    const bioContainer = document.getElementById('profile-bio');
    profile.bio.forEach(paragraph => {
        const p = document.createElement('p');
        p.innerHTML = paragraph;
        bioContainer.appendChild(p);
    });
}

function renderLinks(containerId, links) {
    const container = document.getElementById(containerId);
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        if (link.url.startsWith('http')) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }

        const h3 = document.createElement('h3');
        h3.className = 'link-header';
        h3.textContent = link.title;

        a.appendChild(h3);
        container.appendChild(a);
    });
}

function renderTimeline(containerId, items) {
    const container = document.getElementById(containerId);
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';

        const dateDiv = document.createElement('div');
        dateDiv.className = 'timeline-date date';
        dateDiv.textContent = item.date;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'timeline-content';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = item.title;
        contentDiv.appendChild(titleDiv);

        if (item.subtitle) {
            const subtitleDiv = document.createElement('div');
            subtitleDiv.className = 'subtitle';
            subtitleDiv.textContent = item.subtitle;
            contentDiv.appendChild(subtitleDiv);
        }

        if (item.description) {
            const descDiv = document.createElement('div');
            descDiv.className = 'description';
            descDiv.innerHTML = item.description;
            contentDiv.appendChild(descDiv);
        }

        itemDiv.appendChild(dateDiv);
        itemDiv.appendChild(contentDiv);
        container.appendChild(itemDiv);
    });
}

function renderTechnologies(technologies) {
    const container = document.getElementById('technologies-container');
    const descDiv = document.createElement('div');
    descDiv.className = 'description';

    technologies.forEach(paragraph => {
        const p = document.createElement('p');
        p.innerHTML = paragraph;
        descDiv.appendChild(p);
    });

    container.appendChild(descDiv);
}

function renderLanguages(languages) {
    const container = document.getElementById('languages-container');
    languages.forEach(lang => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';

        const langDiv = document.createElement('div');
        langDiv.className = 'timeline-date date';
        langDiv.textContent = lang.language;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'timeline-content';

        const levelDiv = document.createElement('div');
        levelDiv.className = 'date';
        levelDiv.textContent = lang.level;
        contentDiv.appendChild(levelDiv);

        itemDiv.appendChild(langDiv);
        itemDiv.appendChild(contentDiv);
        container.appendChild(itemDiv);
    });
}
