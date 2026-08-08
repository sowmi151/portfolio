/**
 * Dynamic GitHub API Integration for Sowmiya A (@sowmi151)
 * Fetches User Profile Details, Metrics, and Public Repositories
 */

const GITHUB_USERNAME = 'sowmi151';

document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProfile();
    fetchGitHubRepos();
});

async function fetchGitHubProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Failed to load GitHub user');

        const data = await response.json();

        document.getElementById('publicRepos').textContent = data.public_repos || 0;
        document.getElementById('followers').textContent = data.followers || 0;
        document.getElementById('following').textContent = data.following || 0;
        
        if (data.avatar_url) {
            document.getElementById('avatarImage').src = data.avatar_url;
        }
    } catch (error) {
        console.error('GitHub API Error:', error);
    }
}

async function fetchGitHubRepos() {
    const projectsGrid = document.getElementById('projectsGrid');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        if (!response.ok) throw new Error('Failed to load repositories');

        const repos = await response.json();
        
        // Calculate Total Stars across fetched repos
        let stars = 0;
        repos.forEach(repo => stars += repo.stargazers_count);
        document.getElementById('totalStars').textContent = stars;

        renderProjects(repos);
        setupProjectFiltering(repos);
    } catch (error) {
        console.error('Error fetching projects:', error);
        projectsGrid.innerHTML = `
            <div class="glass-card span-2" style="text-align: center; color: var(--text-muted);">
                <p><i class="fa-solid fa-triangle-exclamation"></i> Unable to load projects automatically from GitHub.</p>
                <a href="https://github.com/sowmi151" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">View on GitHub</a>
            </div>
        `;
    }
}

function renderProjects(repos) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    repos.forEach(repo => {
        const lang = repo.language || 'Code';
        const card = document.createElement('div');
        card.className = 'glass-card project-card';
        card.setAttribute('data-category', getCategoryFromLanguage(lang));

        card.innerHTML = `
            <div>
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-desc">${repo.description || 'Modern software project built with clean code and best practices.'}</p>
                <div class="project-techs">
                    <span class="tech-badge">${lang}</span>
                    <span class="tech-badge"><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="tech-badge"><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
                </div>
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-glass" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    <i class="fa-brands fa-github"></i> Code
                </a>
                ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo
                </a>
                ` : ''}
            </div>
        `;

        projectsGrid.appendChild(card);
    });
}

function getCategoryFromLanguage(lang) {
    const lower = lang.toLowerCase();
    if (['python', 'jupyter notebook', 'c++'].includes(lower)) return 'ai';
    if (['html', 'css', 'javascript', 'typescript', 'react'].includes(lower)) return 'web';
    return 'all';
}

function setupProjectFiltering(repos) {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const projectCards = document.querySelectorAll('.project-card');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}