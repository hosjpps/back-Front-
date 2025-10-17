// ===== ФИЛЬТРАЦИЯ ПРОЕКТОВ =====

// Инициализация фильтров
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

// Фильтрация проектов по категории
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

// Обновление счетчика проектов
function updateProjectsCounter(category) {
    // Получаем данные проектов из глобальной переменной или импорта
    const projectsData = window.projectsData || [];
    
    const totalProjects = category === 'all' 
        ? projectsData.length 
        : projectsData.filter(project => project.category === category).length;
    
    const counterElement = document.querySelector('.projects-counter');
    if (counterElement) {
        counterElement.textContent = `Показано проектов: ${totalProjects}`;
    }
}

// Поиск проектов
function searchProjects(query) {
    const projectCards = document.querySelectorAll('.project-card');
    const searchQuery = query.toLowerCase().trim();
    
    if (!searchQuery) {
        // Если поиск пустой, показываем все проекты
        projectCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        return;
    }
    
    let hasResults = false;
    
    projectCards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        const technologies = card.getAttribute('data-technologies')?.toLowerCase() || '';
        
        if (title.includes(searchQuery) || 
            description.includes(searchQuery) || 
            technologies.includes(searchQuery)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            hasResults = true;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    if (!hasResults) {
        showNoResultsMessage(query);
    } else {
        hideNoResultsMessage();
    }
}

// Показать сообщение об отсутствии результатов
function showNoResultsMessage(query) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    let noResultsElement = document.querySelector('.no-results');
    if (!noResultsElement) {
        noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results text-center py-5';
        noResultsElement.innerHTML = `
            <div class="mb-3">
                <i class="fas fa-search fa-3x text-muted"></i>
            </div>
            <h4 class="text-muted">Проекты не найдены</h4>
            <p class="text-muted">По запросу "${query}" ничего не найдено. Попробуйте изменить поисковый запрос.</p>
        `;
        projectsGrid.appendChild(noResultsElement);
    }
}

// Скрыть сообщение об отсутствии результатов
function hideNoResultsMessage() {
    const noResultsElement = document.querySelector('.no-results');
    if (noResultsElement) {
        noResultsElement.remove();
    }
}

// Очистка поиска
function clearSearch() {
    const searchInput = document.querySelector('#projectSearch');
    if (searchInput) {
        searchInput.value = '';
        searchProjects('');
    }
    hideNoResultsMessage();
}

// Сортировка проектов
function sortProjects(sortBy) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    
    projectCards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                const titleA = a.querySelector('.card-title').textContent;
                const titleB = b.querySelector('.card-title').textContent;
                return titleA.localeCompare(titleB);
            case 'date':
                // Сортировка по дате (предполагаем, что есть data-date атрибут)
                const dateA = new Date(a.getAttribute('data-date') || '2023-01-01');
                const dateB = new Date(b.getAttribute('data-date') || '2023-01-01');
                return dateB - dateA;
            case 'category':
                const categoryA = a.getAttribute('data-category');
                const categoryB = b.getAttribute('data-category');
                return categoryA.localeCompare(categoryB);
            default:
                return 0;
        }
    });
    
    // Перестраиваем DOM
    projectCards.forEach(card => projectsGrid.appendChild(card));
}

// Экспорт функций для использования в других модулях
window.FiltersApp = {
    initializeFilters,
    filterProjects,
    searchProjects,
    clearSearch,
    sortProjects,
    updateProjectsCounter
};