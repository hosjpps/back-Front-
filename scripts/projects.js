// ===== JAVASCRIPT ДЛЯ СТРАНИЦЫ ПРОЕКТОВ =====

// Данные проектов
const projectsData = [
    {
        id: 1,
        title: "Интернет-магазин",
        category: "html-css",
        description: "Адаптивный интернет-магазин с корзиной и формой заказа",
        fullDescription: "Полнофункциональный интернет-магазин, созданный с использованием HTML5, CSS3 и JavaScript. Включает каталог товаров, корзину покупок, форму оформления заказа, адаптивный дизайн для всех устройств. Реализованы анимации, валидация форм и локальное хранение данных корзины.",
        technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
        image: "../images/project1.jpg",
        demoUrl: "#",
        codeUrl: "#",
        features: [
            "Адаптивный дизайн",
            "Корзина покупок",
            "Валидация форм",
            "Анимации CSS",
            "LocalStorage"
        ]
    },
    {
        id: 2,
        title: "Погодное приложение",
        category: "javascript",
        description: "Приложение для просмотра погоды с API интеграцией",
        fullDescription: "Современное погодное приложение с интеграцией OpenWeatherMap API. Показывает текущую погоду, прогноз на 5 дней, поиск по городам, геолокацию. Реализован красивый UI с анимированными иконками погоды и градиентными фонами в зависимости от времени суток.",
        technologies: ["JavaScript", "API", "Geolocation", "CSS3"],
        image: "../images/project2.jpg",
        demoUrl: "#",
        codeUrl: "#",
        features: [
            "OpenWeatherMap API",
            "Геолокация",
            "Прогноз на 5 дней",
            "Поиск городов",
            "Анимированные иконки"
        ]
    },
    {
        id: 3,
        title: "Todo приложение",
        category: "react",
        description: "Приложение для управления задачами на React",
        fullDescription: "Современное Todo приложение, построенное на React с использованием хуков. Включает добавление, редактирование, удаление задач, фильтрацию по статусу, локальное сохранение данных. Реализован drag-and-drop для изменения порядка задач и темная тема.",
        technologies: ["React", "Hooks", "LocalStorage", "CSS Modules"],
        image: "../images/project3.jpg",
        demoUrl: "#",
        codeUrl: "#",
        features: [
            "React Hooks",
            "Drag & Drop",
            "Фильтрация задач",
            "Темная тема",
            "Локальное сохранение"
        ]
    },
    {
        id: 4,
        title: "Лендинг ресторана",
        category: "bootstrap",
        description: "Красивый лендинг для ресторана с Bootstrap",
        fullDescription: "Элегантный лендинг для ресторана, созданный с использованием Bootstrap 5. Включает секции меню, галерею, форму бронирования, карту проезда. Реализованы параллакс-эффекты, плавные анимации, адаптивная галерея изображений и интеграция с картами.",
        technologies: ["Bootstrap 5", "jQuery", "AOS", "Google Maps"],
        image: "../images/project4.jpg",
        demoUrl: "#",
        codeUrl: "#",
        features: [
            "Bootstrap 5",
            "Параллакс эффекты",
            "Форма бронирования",
            "Google Maps",
            "AOS анимации"
        ]
    },
    {
        id: 5,
        title: "Калькулятор",
        category: "javascript",
        description: "Научный калькулятор с расширенными функциями",
        fullDescription: "Полнофункциональный научный калькулятор с поддержкой базовых и расширенных математических операций. Включает тригонометрические функции, логарифмы, степени, работу с памятью. Реализована история вычислений и клавиатурные сокращения.",
        technologies: ["JavaScript", "CSS Grid", "Math.js"],
        image: "../images/project5.jpg",
        demoUrl: "#",
        codeUrl: "#",
        features: [
            "Научные функции",
            "История вычислений",
            "Клавиатурные сокращения",
            "Работа с памятью",
            "CSS Grid Layout"
        ]
    },
    {
        id: 6,
        title: "Портфолио фотографа",
        category: "html-css",
        description: "Элегантное портфолио с галереей изображений",
        fullDescription: "Стильное портфолио для фотографа с акцентом на визуальную составляющую. Включает адаптивную галерею с лайтбоксом, фильтрацию по категориям, форму контактов, плавные переходы. Оптимизировано для быстрой загрузки изображений.",
        technologies: ["HTML5", "CSS3", "Lightbox", "Masonry"],
        image: "../images/project6.jpg",
        demoUrl: "#",
        codeUrl: "#",
        features: [
            "Lightbox галерея",
            "Masonry layout",
            "Ленивая загрузка",
            "Фильтры категорий",
            "Оптимизация изображений"
        ]
    }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
    initializeFilters();
    renderProjects(projectsData);
});

// ===== ИНИЦИАЛИЗАЦИЯ ПРОЕКТОВ =====
function initializeProjects() {
    // Создаем модальные окна для каждого проекта
    createProjectModals();
    
    // Инициализируем обработчики событий
    initializeProjectHandlers();
}

// ===== ФИЛЬТРАЦИЯ ПРОЕКТОВ =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс к нажатой кнопке
            this.classList.add('active');
            
            // Получаем категорию фильтра
            const category = this.getAttribute('data-filter');
            
            // Фильтруем и отображаем проекты
            filterProjects(category);
        });
    });
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Обновляем счетчик проектов
    updateProjectsCounter(category);
}

function updateProjectsCounter(category) {
    const totalProjects = category === 'all' 
        ? projectsData.length 
        : projectsData.filter(project => project.category === category).length;
    
    const counterElement = document.querySelector('.projects-counter');
    if (counterElement) {
        counterElement.textContent = `Показано проектов: ${totalProjects}`;
    }
}

// ===== ОТОБРАЖЕНИЕ ПРОЕКТОВ =====
function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
    
    // Добавляем анимацию появления
    setTimeout(() => {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            <div class="project-overlay">
                <button class="btn btn-primary" data-modal="project-modal-${project.id}">
                    Подробнее
                </button>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// ===== МОДАЛЬНЫЕ ОКНА ПРОЕКТОВ =====
function createProjectModals() {
    const modalsContainer = document.querySelector('.modals-container') || document.body;
    
    projectsData.forEach(project => {
        const modal = createProjectModal(project);
        modalsContainer.appendChild(modal);
    });
}

function createProjectModal(project) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = `project-modal-${project.id}`;
    
    modal.innerHTML = `
        <div class="modal-content project-modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-header">
                <h2>${project.title}</h2>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="modal-body">
                <div class="project-modal-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-modal-info">
                    <h3>Описание проекта</h3>
                    <p>${project.fullDescription}</p>
                    
                    <h3>Основные возможности</h3>
                    <ul class="project-features">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    
                    <div class="project-links">
                        <a href="${project.demoUrl}" class="btn btn-primary" target="_blank">
                            <i class="icon-external-link"></i>
                            Демо
                        </a>
                        <a href="${project.codeUrl}" class="btn btn-secondary" target="_blank">
                            <i class="icon-github"></i>
                            Код
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function initializeProjectHandlers() {
    // Обработчик для кнопок "Подробнее"
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-modal]')) {
            e.preventDefault();
            const modalId = e.target.getAttribute('data-modal');
            window.AppUtils.openModal(modalId);
        }
    });
    
    // Поиск проектов
    const searchInput = document.querySelector('.projects-search');
    if (searchInput) {
        searchInput.addEventListener('input', window.AppUtils.debounce(function(e) {
            searchProjects(e.target.value);
        }, 300));
    }
    
    // Сортировка проектов
    const sortSelect = document.querySelector('.projects-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            sortProjects(e.target.value);
        });
    }
}

// ===== ПОИСК ПРОЕКТОВ =====
function searchProjects(query) {
    const filteredProjects = projectsData.filter(project => 
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query.toLowerCase()))
    );
    
    renderProjects(filteredProjects);
    
    // Показываем сообщение если ничего не найдено
    if (filteredProjects.length === 0 && query.length > 0) {
        showNoResultsMessage(query);
    }
}

function showNoResultsMessage(query) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = `
        <div class="no-results">
            <h3>Ничего не найдено</h3>
            <p>По запросу "${query}" проекты не найдены.</p>
            <button class="btn btn-primary" onclick="clearSearch()">
                Показать все проекты
            </button>
        </div>
    `;
}

function clearSearch() {
    const searchInput = document.querySelector('.projects-search');
    if (searchInput) {
        searchInput.value = '';
    }
    renderProjects(projectsData);
}

// ===== СОРТИРОВКА ПРОЕКТОВ =====
function sortProjects(sortBy) {
    let sortedProjects = [...projectsData];
    
    switch(sortBy) {
        case 'name':
            sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'category':
            sortedProjects.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'newest':
            sortedProjects.sort((a, b) => b.id - a.id);
            break;
        case 'oldest':
            sortedProjects.sort((a, b) => a.id - b.id);
            break;
        default:
            // По умолчанию сортировка по ID
            break;
    }
    
    renderProjects(sortedProjects);
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Функция для загрузки изображений с ленивой загрузкой
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Функция для добавления нового проекта (для админки)
function addProject(projectData) {
    projectsData.push({
        ...projectData,
        id: Math.max(...projectsData.map(p => p.id)) + 1
    });
    
    renderProjects(projectsData);
    window.AppUtils.showNotification('Проект успешно добавлен!', 'success');
}

// Экспорт функций для использования в других скриптах
window.ProjectsApp = {
    filterProjects,
    searchProjects,
    sortProjects,
    addProject,
    clearSearch
};