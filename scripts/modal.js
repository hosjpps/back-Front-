// ===== УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ =====

// Создание модальных окон для проектов
function createProjectModals() {
    const projectsData = window.projectsData || [];
    projectsData.forEach(project => {
        createProjectModal(project);
    });
}

// Создание отдельного модального окна для проекта
function createProjectModal(project) {
    const modalId = `projectModal${project.id}`;
    
    // Проверяем, не существует ли уже модальное окно
    if (document.getElementById(modalId)) {
        return;
    }
    
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">${project.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${project.image}" alt="${project.title}" class="img-fluid rounded mb-3">
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-primary mb-2">Описание проекта</h6>
                                <p class="mb-3">${project.fullDescription}</p>
                                
                                <h6 class="text-primary mb-2">Технологии</h6>
                                <div class="mb-3">
                                    ${project.technologies.map(tech => 
                                        `<span class="badge bg-secondary me-1 mb-1">${tech}</span>`
                                    ).join('')}
                                </div>
                                
                                <h6 class="text-primary mb-2">Особенности</h6>
                                <ul class="list-unstyled">
                                    ${project.features.map(feature => 
                                        `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a href="${project.demoUrl}" class="btn btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt me-2"></i>Демо
                        </a>
                        <a href="${project.codeUrl}" class="btn btn-outline-primary" target="_blank">
                            <i class="fab fa-github me-2"></i>Код
                        </a>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Показать модальное окно проекта
function showProjectModal(projectId) {
    const modalId = `projectModal${projectId}`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// Создание модального окна для контактной формы
function createContactModal() {
    const modalHTML = `
        <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="contactModalLabel">Связаться со мной</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="contactForm">
                            <div class="mb-3">
                                <label for="contactName" class="form-label">Имя *</label>
                                <input type="text" class="form-control" id="contactName" required>
                                <div class="invalid-feedback">
                                    Пожалуйста, введите ваше имя.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="contactEmail" class="form-label">Email *</label>
                                <input type="email" class="form-control" id="contactEmail" required>
                                <div class="invalid-feedback">
                                    Пожалуйста, введите корректный email.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="contactSubject" class="form-label">Тема</label>
                                <input type="text" class="form-control" id="contactSubject">
                            </div>
                            <div class="mb-3">
                                <label for="contactMessage" class="form-label">Сообщение *</label>
                                <textarea class="form-control" id="contactMessage" rows="4" required></textarea>
                                <div class="invalid-feedback">
                                    Пожалуйста, введите сообщение.
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="submit" form="contactForm" class="btn btn-primary">
                            <i class="fas fa-paper-plane me-2"></i>Отправить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM, если его еще нет
    if (!document.getElementById('contactModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// Показать модальное окно контактов
function showContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// Создание модального окна для изображений (лайтбокс)
function createImageModal() {
    const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content bg-transparent border-0">
                    <div class="modal-header border-0">
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img id="modalImage" src="" alt="" class="img-fluid">
                        <div id="modalImageCaption" class="text-white mt-3"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM, если его еще нет
    if (!document.getElementById('imageModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// Показать изображение в модальном окне
function showImageModal(imageSrc, caption = '') {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalImageCaption');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = caption;
        if (modalCaption) {
            modalCaption.textContent = caption;
        }
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// Инициализация всех модальных окон
function initializeModals() {
    createProjectModals();
    createContactModal();
    createImageModal();
    
    // Добавляем обработчики для изображений (лайтбокс)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('lightbox-image')) {
            e.preventDefault();
            const imageSrc = e.target.src || e.target.href;
            const caption = e.target.alt || e.target.title;
            showImageModal(imageSrc, caption);
        }
    });
}

// Закрытие модального окна по клику вне его области
function initializeModalBackdropClose() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            const modal = bootstrap.Modal.getInstance(e.target);
            if (modal) {
                modal.hide();
            }
        }
    });
}

// Экспорт функций для использования в других модулях
window.ModalApp = {
    createProjectModals,
    createProjectModal,
    showProjectModal,
    createContactModal,
    showContactModal,
    createImageModal,
    showImageModal,
    initializeModals,
    initializeModalBackdropClose
};