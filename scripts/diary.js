// ===== JAVASCRIPT ДЛЯ СТРАНИЦЫ ДНЕВНИКА =====

// Данные курсов и записей
let coursesData = [
    {
        id: 1,
        name: "Веб-разработка",
        progress: 75,
        totalLessons: 40,
        completedLessons: 30,
        color: "#007bff"
    },
    {
        id: 2,
        name: "JavaScript",
        progress: 60,
        totalLessons: 35,
        completedLessons: 21,
        color: "#28a745"
    },
    {
        id: 3,
        name: "React",
        progress: 40,
        totalLessons: 25,
        completedLessons: 10,
        color: "#17a2b8"
    },
    {
        id: 4,
        name: "Базы данных",
        progress: 25,
        totalLessons: 30,
        completedLessons: 7,
        color: "#ffc107"
    }
];

let diaryEntries = [
    {
        id: 1,
        date: "2024-01-15",
        title: "Изучение CSS Grid",
        content: "Сегодня изучал CSS Grid Layout. Очень мощный инструмент для создания сложных макетов. Практиковался на создании адаптивной галереи изображений.",
        tags: ["CSS", "Grid", "Layout"],
        status: "completed",
        course: "Веб-разработка",
        timeSpent: 120
    },
    {
        id: 2,
        date: "2024-01-14",
        title: "JavaScript ES6+ функции",
        content: "Разбирал стрелочные функции, деструктуризацию и spread оператор. Написал несколько практических примеров для лучшего понимания.",
        tags: ["JavaScript", "ES6", "Functions"],
        status: "completed",
        course: "JavaScript",
        timeSpent: 90
    },
    {
        id: 3,
        date: "2024-01-13",
        title: "Компоненты React",
        content: "Изучал создание функциональных компонентов и использование хуков useState и useEffect. Создал простое приложение счетчик.",
        tags: ["React", "Components", "Hooks"],
        status: "in-progress",
        course: "React",
        timeSpent: 150
    },
    {
        id: 4,
        date: "2024-01-12",
        title: "SQL запросы",
        content: "Практиковался в написании сложных SQL запросов с JOIN операциями. Работал с базой данных интернет-магазина.",
        tags: ["SQL", "Database", "JOIN"],
        status: "completed",
        course: "Базы данных",
        timeSpent: 105
    }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeDiary();
    renderProgressBars();
    renderDiaryEntries();
    initializeForm();
    initializeFilters();
    loadFromLocalStorage();
});

// ===== ИНИЦИАЛИЗАЦИЯ ДНЕВНИКА =====
function initializeDiary() {
    // Обновляем статистику
    updateStatistics();
    
    // Инициализируем обработчики событий
    initializeDiaryHandlers();
    
    // Загружаем данные из localStorage
    loadFromLocalStorage();
}

// ===== ОТОБРАЖЕНИЕ ПРОГРЕСС-БАРОВ =====
function renderProgressBars() {
    const progressContainer = document.querySelector('.progress-courses');
    if (!progressContainer) return;
    
    progressContainer.innerHTML = '';
    
    coursesData.forEach(course => {
        const courseElement = createCourseProgressElement(course);
        progressContainer.appendChild(courseElement);
    });
}

function createCourseProgressElement(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-item';
    
    courseDiv.innerHTML = `
        <div class="course-header">
            <h3 class="course-name">${course.name}</h3>
            <span class="course-percentage">${course.progress}%</span>
        </div>
        <div class="course-progress-bar">
            <div class="course-progress" 
                 data-width="${course.progress}" 
                 style="background-color: ${course.color}">
            </div>
        </div>
        <div class="course-stats">
            <span class="lessons-completed">${course.completedLessons}/${course.totalLessons} уроков</span>
            <button class="btn btn-sm btn-outline-primary update-progress-btn" 
                    data-course-id="${course.id}">
                Обновить прогресс
            </button>
        </div>
    `;
    
    return courseDiv;
}

// ===== ОТОБРАЖЕНИЕ ЗАПИСЕЙ ДНЕВНИКА =====
function renderDiaryEntries(entries = diaryEntries) {
    const entriesContainer = document.querySelector('.diary-entries');
    if (!entriesContainer) return;
    
    entriesContainer.innerHTML = '';
    
    if (entries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="no-entries">
                <h3>Записей пока нет</h3>
                <p>Добавьте первую запись в свой учебный дневник!</p>
            </div>
        `;
        return;
    }
    
    // Сортируем записи по дате (новые сначала)
    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedEntries.forEach(entry => {
        const entryElement = createDiaryEntryElement(entry);
        entriesContainer.appendChild(entryElement);
    });
}

function createDiaryEntryElement(entry) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-item';
    entryDiv.setAttribute('data-entry-id', entry.id);
    
    const statusClass = entry.status === 'completed' ? 'status-completed' : 'status-in-progress';
    const statusText = entry.status === 'completed' ? 'Завершено' : 'В процессе';
    
    entryDiv.innerHTML = `
        <div class="entry-header">
            <div class="entry-date">${window.AppUtils.formatDate(entry.date)}</div>
            <div class="entry-status ${statusClass}">${statusText}</div>
        </div>
        <h3 class="entry-title">${entry.title}</h3>
        <p class="entry-content">${entry.content}</p>
        <div class="entry-meta">
            <div class="entry-tags">
                ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="entry-info">
                <span class="entry-course">${entry.course}</span>
                <span class="entry-time">${entry.timeSpent} мин</span>
            </div>
        </div>
        <div class="entry-actions">
            <button class="btn btn-sm btn-outline-primary edit-entry-btn" data-entry-id="${entry.id}">
                Редактировать
            </button>
            <button class="btn btn-sm btn-outline-danger delete-entry-btn" data-entry-id="${entry.id}">
                Удалить
            </button>
        </div>
    `;
    
    return entryDiv;
}

// ===== ФОРМА ДОБАВЛЕНИЯ ЗАПИСИ =====
function initializeForm() {
    const form = document.querySelector('.diary-form');
    if (!form) return;
    
    // Заполняем селект курсов
    const courseSelect = form.querySelector('#entry-course');
    if (courseSelect) {
        courseSelect.innerHTML = '<option value="">Выберите курс</option>';
        coursesData.forEach(course => {
            const option = document.createElement('option');
            option.value = course.name;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    }
    
    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });
    
    // Автосохранение черновика
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', window.AppUtils.debounce(saveDraft, 1000));
    });
    
    // Загружаем черновик
    loadDraft();
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    
    const entry = {
        id: Date.now(), // Простой способ генерации ID
        date: formData.get('date') || new Date().toISOString().split('T')[0],
        title: formData.get('title').trim(),
        content: formData.get('content').trim(),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        status: formData.get('status'),
        course: formData.get('course'),
        timeSpent: parseInt(formData.get('timeSpent')) || 0
    };
    
    // Валидация
    if (!validateEntry(entry)) {
        return;
    }
    
    // Добавляем запись
    diaryEntries.push(entry);
    
    // Обновляем отображение
    renderDiaryEntries();
    updateStatistics();
    
    // Сохраняем в localStorage
    saveToLocalStorage();
    
    // Очищаем форму
    form.reset();
    clearDraft();
    
    // Показываем уведомление
    window.AppUtils.showNotification('Запись успешно добавлена!', 'success');
    
    // Прокручиваем к новой записи
    setTimeout(() => {
        const newEntry = document.querySelector(`[data-entry-id="${entry.id}"]`);
        if (newEntry) {
            newEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newEntry.classList.add('highlight');
            setTimeout(() => newEntry.classList.remove('highlight'), 2000);
        }
    }, 100);
}

function validateEntry(entry) {
    if (!entry.title) {
        window.AppUtils.showNotification('Заголовок обязателен для заполнения', 'error');
        return false;
    }
    
    if (!entry.content) {
        window.AppUtils.showNotification('Содержание обязательно для заполнения', 'error');
        return false;
    }
    
    if (!entry.course) {
        window.AppUtils.showNotification('Выберите курс', 'error');
        return false;
    }
    
    if (entry.timeSpent < 0) {
        window.AppUtils.showNotification('Время изучения не может быть отрицательным', 'error');
        return false;
    }
    
    return true;
}

// ===== ФИЛЬТРАЦИЯ И ПОИСК =====
function initializeFilters() {
    // Фильтр по статусу
    const statusFilter = document.querySelector('.status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterEntries();
        });
    }
    
    // Фильтр по курсу
    const courseFilter = document.querySelector('.course-filter');
    if (courseFilter) {
        // Заполняем опции курсов
        courseFilter.innerHTML = '<option value="">Все курсы</option>';
        coursesData.forEach(course => {
            const option = document.createElement('option');
            option.value = course.name;
            option.textContent = course.name;
            courseFilter.appendChild(option);
        });
        
        courseFilter.addEventListener('change', function() {
            filterEntries();
        });
    }
    
    // Поиск
    const searchInput = document.querySelector('.diary-search');
    if (searchInput) {
        searchInput.addEventListener('input', window.AppUtils.debounce(function() {
            filterEntries();
        }, 300));
    }
}

function filterEntries() {
    const statusFilter = document.querySelector('.status-filter')?.value || '';
    const courseFilter = document.querySelector('.course-filter')?.value || '';
    const searchQuery = document.querySelector('.diary-search')?.value.toLowerCase() || '';
    
    let filteredEntries = diaryEntries.filter(entry => {
        const matchesStatus = !statusFilter || entry.status === statusFilter;
        const matchesCourse = !courseFilter || entry.course === courseFilter;
        const matchesSearch = !searchQuery || 
            entry.title.toLowerCase().includes(searchQuery) ||
            entry.content.toLowerCase().includes(searchQuery) ||
            entry.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        
        return matchesStatus && matchesCourse && matchesSearch;
    });
    
    renderDiaryEntries(filteredEntries);
}

// ===== РЕДАКТИРОВАНИЕ И УДАЛЕНИЕ =====
function initializeDiaryHandlers() {
    // Обработчики для кнопок редактирования и удаления
    document.addEventListener('click', function(e) {
        if (e.target.matches('.edit-entry-btn')) {
            const entryId = parseInt(e.target.getAttribute('data-entry-id'));
            editEntry(entryId);
        }
        
        if (e.target.matches('.delete-entry-btn')) {
            const entryId = parseInt(e.target.getAttribute('data-entry-id'));
            deleteEntry(entryId);
        }
        
        if (e.target.matches('.update-progress-btn')) {
            const courseId = parseInt(e.target.getAttribute('data-course-id'));
            updateCourseProgress(courseId);
        }
    });
}

function editEntry(entryId) {
    const entry = diaryEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    // Заполняем форму данными записи
    const form = document.querySelector('.diary-form');
    if (!form) return;
    
    form.querySelector('#entry-date').value = entry.date;
    form.querySelector('#entry-title').value = entry.title;
    form.querySelector('#entry-content').value = entry.content;
    form.querySelector('#entry-tags').value = entry.tags.join(', ');
    form.querySelector('#entry-status').value = entry.status;
    form.querySelector('#entry-course').value = entry.course;
    form.querySelector('#entry-time').value = entry.timeSpent;
    
    // Удаляем старую запись
    diaryEntries = diaryEntries.filter(e => e.id !== entryId);
    renderDiaryEntries();
    
    // Прокручиваем к форме
    form.scrollIntoView({ behavior: 'smooth' });
    
    window.AppUtils.showNotification('Запись загружена для редактирования', 'info');
}

function deleteEntry(entryId) {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
        return;
    }
    
    diaryEntries = diaryEntries.filter(e => e.id !== entryId);
    renderDiaryEntries();
    updateStatistics();
    saveToLocalStorage();
    
    window.AppUtils.showNotification('Запись удалена', 'success');
}

// ===== ОБНОВЛЕНИЕ ПРОГРЕССА КУРСА =====
function updateCourseProgress(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    const newProgress = prompt(`Введите новый прогресс для курса "${course.name}" (0-100):`, course.progress);
    
    if (newProgress === null) return; // Отмена
    
    const progress = parseInt(newProgress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
        window.AppUtils.showNotification('Введите корректное значение от 0 до 100', 'error');
        return;
    }
    
    course.progress = progress;
    course.completedLessons = Math.round((progress / 100) * course.totalLessons);
    
    renderProgressBars();
    updateStatistics();
    saveToLocalStorage();
    
    window.AppUtils.showNotification('Прогресс обновлен!', 'success');
}

// ===== СТАТИСТИКА =====
function updateStatistics() {
    const totalEntries = diaryEntries.length;
    const completedEntries = diaryEntries.filter(e => e.status === 'completed').length;
    const totalTimeSpent = diaryEntries.reduce((sum, e) => sum + e.timeSpent, 0);
    const averageProgress = coursesData.reduce((sum, c) => sum + c.progress, 0) / coursesData.length;
    
    // Обновляем элементы статистики
    updateStatElement('.total-entries', totalEntries);
    updateStatElement('.completed-entries', completedEntries);
    updateStatElement('.total-time', `${Math.round(totalTimeSpent / 60)} ч`);
    updateStatElement('.average-progress', `${Math.round(averageProgress)}%`);
}

function updateStatElement(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

// ===== СОХРАНЕНИЕ И ЗАГРУЗКА ДАННЫХ =====
function saveToLocalStorage() {
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    localStorage.setItem('coursesData', JSON.stringify(coursesData));
}

function loadFromLocalStorage() {
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
        diaryEntries = JSON.parse(savedEntries);
    }
    
    const savedCourses = localStorage.getItem('coursesData');
    if (savedCourses) {
        coursesData = JSON.parse(savedCourses);
    }
}

function saveDraft() {
    const form = document.querySelector('.diary-form');
    if (!form) return;
    
    const draft = {
        title: form.querySelector('#entry-title').value,
        content: form.querySelector('#entry-content').value,
        tags: form.querySelector('#entry-tags').value,
        course: form.querySelector('#entry-course').value,
        timeSpent: form.querySelector('#entry-time').value
    };
    
    localStorage.setItem('diaryDraft', JSON.stringify(draft));
}

function loadDraft() {
    const savedDraft = localStorage.getItem('diaryDraft');
    if (!savedDraft) return;
    
    const draft = JSON.parse(savedDraft);
    const form = document.querySelector('.diary-form');
    if (!form) return;
    
    form.querySelector('#entry-title').value = draft.title || '';
    form.querySelector('#entry-content').value = draft.content || '';
    form.querySelector('#entry-tags').value = draft.tags || '';
    form.querySelector('#entry-course').value = draft.course || '';
    form.querySelector('#entry-time').value = draft.timeSpent || '';
}

function clearDraft() {
    localStorage.removeItem('diaryDraft');
}

// ===== ЭКСПОРТ ДАННЫХ =====
function exportDiary() {
    const dataStr = JSON.stringify({
        entries: diaryEntries,
        courses: coursesData,
        exportDate: new Date().toISOString()
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `diary-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    window.AppUtils.showNotification('Дневник экспортирован!', 'success');
}

// Экспорт функций для использования в других скриптах
window.DiaryApp = {
    addEntry: handleFormSubmit,
    editEntry,
    deleteEntry,
    filterEntries,
    updateCourseProgress,
    exportDiary,
    updateStatistics
};