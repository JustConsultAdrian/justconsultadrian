/**
 * Just Consult Adrian - Engine & Interactivity Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollProgress();
    initKeyboardListeners();
    initCounters();
    checkCookieConsent();
});

/* Theme State Persistence */
function initTheme() {
    const savedTheme = localStorage.getItem('jca_theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('jca_theme', 'light');
        showToast('Light mode enabled', 'info');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('jca_theme', 'dark');
        showToast('Dark mode enabled', 'info');
    }
}

/* Reading Progress Bar Listener */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;

        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Toast Notification Engine */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-400' : 'bg-slate-900/95 border-amber-500/50 text-amber-400';
    
    toast.className = `toast glass-panel border px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold ${bgClass}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✓' : 'ℹ'}</span>
        <span class="text-white">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* Accessible Modal Management & Focus Lock */
let lastFocusedElement = null;

function toggleModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    const isHidden = modal.classList.contains('hidden');
    if (isHidden) {
        lastFocusedElement = document.activeElement;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        
        const focusable = modal.querySelector('input, button, [tabindex="0"]');
        if (focusable) focusable.focus();
    } else {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        if (lastFocusedElement) lastFocusedElement.focus();
    }
}

/* Keyboard Event Management (ESC key modal close) */
function initKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('[role="dialog"]').forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    toggleModal(modal.id);
                }
            });
        }
    });
}

/* Cookie Consent Persistence */
function checkCookieConsent() {
    if (!localStorage.getItem('jca_cookies_accepted')) {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.classList.remove('hidden');
    }
}

function acceptCookies() {
    localStorage.setItem('jca_cookies_accepted', 'true');
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.add('hidden');
    showToast('Preferences saved successfully');
}

/* Mobile Navigation Controls */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    if (!menu) return;

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('hidden');
}

/* Portfolio Filter Algorithm */
function filterPortfolio(category, btnElement) {
    document.querySelectorAll('.port-filter-btn').forEach(btn => {
        btn.classList.remove('bg-amber-500', 'text-gray-950');
        btn.classList.add('bg-slate-800', 'text-slate-300');
    });
    btnElement.classList.remove('bg-slate-800', 'text-slate-300');
    btnElement.classList.add('bg-amber-500', 'text-gray-950');

    const items = document.querySelectorAll('.port-item');
    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/* Interactive Calculator Sync */
function calculateEstimate() {
    const service = parseInt(document.getElementById('calc-service').value);
    const speed = parseInt(document.getElementById('calc-speed').value);
    const total = service + speed;
    document.getElementById('calc-total').textContent = '$' + total;
}

function syncEstimateToForm() {
    const serviceSelect = document.getElementById('calc-service');
    const targetVal = serviceSelect.value;
    const packageSelect = document.getElementById('form-package-select');
    
    for (let opt of packageSelect.options) {
        if (opt.text.includes(targetVal)) {
            packageSelect.value = opt.text;
            break;
        }
    }
    showToast('Estimate applied to inquiry form');
}

/* Animated Stat Counters */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const speed = target / 30;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 40);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(c => observer.observe(c));
}
