// ===== ОСНОВНОЙ JAVASCRIPT ФАЙЛ =====

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeModals();
    initializeProgressBars();
});

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами для анимации
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .entry-item, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== НАВИГАЦИЯ =====
function initializeNavigation() {
    // Подсветка активного пункта меню
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === '../index.html')) {
            link.classList.add('active');
        }
    });

    // Плавная прокрутка для якорных ссылок
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initializeModals() {
    // Bootstrap модалы инициализируются автоматически
    // Добавляем только кастомные обработчики если нужно
    
    // Обработчики для кастомных триггеров модалов
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
}

function openModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function closeModal(modalElement) {
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
}

// ===== ПРОГРЕСС-БАРЫ =====
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.course-progress');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 200);
                
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        bar.style.width = '0%';
        progressObserver.observe(bar);
    });
}

// ===== УТИЛИТЫ =====

// Функция для показа уведомлений с Bootstrap toasts
function showNotification(message, type = 'success') {
    // Создаем контейнер для toasts если его нет
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '3000';
        document.body.appendChild(toastContainer);
    }
    
    // Определяем иконку и цвет в зависимости от типа
    let icon, bgClass, textClass;
    switch(type) {
        case 'success':
            icon = 'bi-check-circle-fill';
            bgClass = 'bg-success';
            textClass = 'text-white';
            break;
        case 'error':
            icon = 'bi-exclamation-triangle-fill';
            bgClass = 'bg-danger';
            textClass = 'text-white';
            break;
        case 'warning':
            icon = 'bi-exclamation-triangle-fill';
            bgClass = 'bg-warning';
            textClass = 'text-dark';
            break;
        case 'info':
            icon = 'bi-info-circle-fill';
            bgClass = 'bg-info';
            textClass = 'text-white';
            break;
        default:
            icon = 'bi-info-circle-fill';
            bgClass = 'bg-primary';
            textClass = 'text-white';
    }
    
    // Создаем toast элемент
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast ${bgClass} ${textClass}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <i class="bi ${icon} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Инициализируем и показываем toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    
    toast.show();
    
    // Удаляем элемент после скрытия
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Функция для валидации email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для валидации телефона
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Функция для форматирования даты
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('ru-RU', options);
}

// Функция для дебаунса
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Функция для троттлинга
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
    // В продакшене здесь можно отправлять ошибки на сервер
});

// ===== ЭКСПОРТ ФУНКЦИЙ ДЛЯ ДРУГИХ СКРИПТОВ =====
window.AppUtils = {
    showNotification,
    validateEmail,
    validatePhone,
    formatDate,
    debounce,
    throttle,
    openModal,
    closeModal
};