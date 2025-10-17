// ===== JAVASCRIPT ДЛЯ СТРАНИЦЫ КОНТАКТОВ =====

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeAnimations();
    initializeCopyButtons();
    initializeTooltips();
});

// ===== ИНИЦИАЛИЗАЦИЯ ФОРМЫ КОНТАКТОВ =====
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });
    
    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Автосохранение черновика
    inputs.forEach(input => {
        input.addEventListener('input', window.AppUtils.debounce(saveFormDraft, 1000));
    });
    
    // Загружаем черновик
    loadFormDraft();
    
    // Инициализируем маски для полей
    initializeInputMasks();
}

// ===== ВАЛИДАЦИЯ ФОРМЫ =====
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Очищаем предыдущие ошибки
    clearFieldError(field);
    
    switch(fieldName) {
        case 'firstName':
            if (!value) {
                errorMessage = 'Имя обязательно для заполнения';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Имя должно содержать минимум 2 символа';
                isValid = false;
            } else if (!/^[а-яёА-ЯЁa-zA-Z\s-]+$/.test(value)) {
                errorMessage = 'Имя может содержать только буквы, пробелы и дефисы';
                isValid = false;
            }
            break;
            
        case 'lastName':
            if (!value) {
                errorMessage = 'Фамилия обязательна для заполнения';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Фамилия должна содержать минимум 2 символа';
                isValid = false;
            } else if (!/^[а-яёА-ЯЁa-zA-Z\s-]+$/.test(value)) {
                errorMessage = 'Фамилия может содержать только буквы, пробелы и дефисы';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Email обязателен для заполнения';
                isValid = false;
            } else if (!window.AppUtils.validateEmail(value)) {
                errorMessage = 'Введите корректный email адрес';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (value && !window.AppUtils.validatePhone(value)) {
                errorMessage = 'Введите корректный номер телефона';
                isValid = false;
            }
            break;
            
        case 'subject':
            if (!value) {
                errorMessage = 'Тема сообщения обязательна';
                isValid = false;
            } else if (value.length < 5) {
                errorMessage = 'Тема должна содержать минимум 5 символов';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Сообщение обязательно для заполнения';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Сообщение должно содержать минимум 10 символов';
                isValid = false;
            } else if (value.length > 1000) {
                errorMessage = 'Сообщение не должно превышать 1000 символов';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Проверяем согласие с политикой конфиденциальности
    const privacyCheckbox = form.querySelector('#privacy-agreement');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        showFieldError(privacyCheckbox, 'Необходимо согласие с политикой конфиденциальности');
        isFormValid = false;
    }
    
    return isFormValid;
}

function showFieldError(field, message) {
    // Добавляем Bootstrap класс для невалидного поля
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    // Удаляем предыдущее сообщение об ошибке
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Добавляем новое сообщение об ошибке с Bootstrap классом
    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    // Удаляем Bootstrap классы ошибок
    field.classList.remove('is-invalid');
    
    // Если поле заполнено корректно, добавляем класс валидности
    if (field.value.trim() && validateFieldValue(field)) {
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
    }
    
    // Удаляем сообщение об ошибке
    const errorMessage = field.parentNode.querySelector('.invalid-feedback');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Вспомогательная функция для проверки значения поля
function validateFieldValue(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    
    switch(fieldName) {
        case 'firstName':
        case 'lastName':
            return value.length >= 2 && /^[а-яёА-ЯЁa-zA-Z\s-]+$/.test(value);
        case 'email':
            return window.AppUtils.validateEmail(value);
        case 'phone':
            return !value || window.AppUtils.validatePhone(value);
        case 'subject':
            return value.length >= 3;
        case 'message':
            return value.length >= 10;
        default:
            return true;
    }
}

// ===== ОБРАБОТКА ОТПРАВКИ ФОРМЫ =====
function handleFormSubmit(form) {
    // Показываем индикатор загрузки с Bootstrap спиннером
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Добавляем спиннер Bootstrap
    submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Отправка...
    `;
    submitButton.disabled = true;
    
    // Валидируем форму
    if (!validateForm(form)) {
        resetSubmitButton(submitButton, originalText);
        window.AppUtils.showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    // Собираем данные формы
    const formData = new FormData(form);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Симулируем отправку (в реальном проекте здесь был бы AJAX запрос)
    setTimeout(() => {
        // Сохраняем сообщение в localStorage для демонстрации
        saveMessage(contactData);
        
        // Показываем успешное уведомление
        window.AppUtils.showNotification('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
        
        // Очищаем форму и Bootstrap классы валидации
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        clearFormDraft();
        
        // Восстанавливаем кнопку
        resetSubmitButton(submitButton, originalText);
        
        // Показываем модальное окно успеха (если есть)
        showSuccessModal(contactData);
    }, 2000); // Симулируем задержку сети
}

function resetSubmitButton(button, originalContent) {
    button.innerHTML = originalContent;
    button.disabled = false;
}

function saveMessage(messageData) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(messageData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

// ===== МОДАЛЬНОЕ ОКНО УСПЕХА =====
function showSuccessModal(contactData) {
    const modal = document.createElement('div');
    modal.className = 'modal success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="success-icon">✓</div>
            <h2>Сообщение отправлено!</h2>
            <p>Спасибо, <strong>${contactData.firstName}</strong>!</p>
            <p>Ваше сообщение по теме "<em>${contactData.subject}</em>" получено.</p>
            <p>Я отвечу на адрес <strong>${contactData.email}</strong> в течение 24 часов.</p>
            <button class="btn btn-primary" onclick="window.AppUtils.closeModal(this.closest('.modal'))">
                Понятно
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.AppUtils.openModal(modal.className.split(' ')[1]);
    
    // Автоматически закрываем через 10 секунд
    setTimeout(() => {
        if (document.body.contains(modal)) {
            window.AppUtils.closeModal(modal);
            document.body.removeChild(modal);
        }
    }, 10000);
}

// ===== МАСКИ ДЛЯ ПОЛЕЙ ВВОДА =====
function initializeInputMasks() {
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('7')) {
                value = value.substring(1);
            }
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `+7 (${value}`;
                } else if (value.length <= 6) {
                    value = `+7 (${value.substring(0, 3)}) ${value.substring(3)}`;
                } else if (value.length <= 8) {
                    value = `+7 (${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
                } else {
                    value = `+7 (${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 8)}-${value.substring(8, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
}

// ===== АНИМАЦИИ =====
function initializeAnimations() {
    // Анимация появления контактных карточек
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('fade-in');
        }, index * 200);
    });
    
    // Анимация социальных ссылок
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== КНОПКИ КОПИРОВАНИЯ =====
function initializeCopyButtons() {
    // Добавляем кнопки копирования к контактной информации
    const emailElement = document.querySelector('.contact-email');
    const phoneElement = document.querySelector('.contact-phone');
    
    if (emailElement) {
        addCopyButton(emailElement, 'email');
    }
    
    if (phoneElement) {
        addCopyButton(phoneElement, 'phone');
    }
}

function addCopyButton(element, type) {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.innerHTML = '📋';
    copyButton.title = 'Копировать';
    
    copyButton.addEventListener('click', function() {
        const text = element.textContent.trim();
        copyToClipboard(text, type);
    });
    
    element.style.position = 'relative';
    element.appendChild(copyButton);
}

function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(() => {
        const message = type === 'email' ? 'Email скопирован!' : 'Телефон скопирован!';
        window.AppUtils.showNotification(message, 'success');
    }).catch(() => {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const message = type === 'email' ? 'Email скопирован!' : 'Телефон скопирован!';
        window.AppUtils.showNotification(message, 'success');
    });
}

// ===== ПОДСКАЗКИ =====
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
        }, 200);
    }
}

// ===== СОХРАНЕНИЕ И ЗАГРУЗКА ЧЕРНОВИКА =====
function saveFormDraft() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const draft = {
        firstName: form.querySelector('[name="firstName"]').value,
        lastName: form.querySelector('[name="lastName"]').value,
        email: form.querySelector('[name="email"]').value,
        phone: form.querySelector('[name="phone"]').value,
        subject: form.querySelector('[name="subject"]').value,
        message: form.querySelector('[name="message"]').value
    };
    
    localStorage.setItem('contactFormDraft', JSON.stringify(draft));
}

function loadFormDraft() {
    const savedDraft = localStorage.getItem('contactFormDraft');
    if (!savedDraft) return;
    
    const draft = JSON.parse(savedDraft);
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    Object.keys(draft).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field && draft[key]) {
            field.value = draft[key];
        }
    });
    
    // Показываем уведомление о загруженном черновике
    if (Object.values(draft).some(value => value.trim())) {
        window.AppUtils.showNotification('Черновик формы восстановлен', 'info');
    }
}

function clearFormDraft() {
    localStorage.removeItem('contactFormDraft');
}

// ===== СЧЕТЧИК СИМВОЛОВ =====
function initializeCharacterCounter() {
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (!messageTextarea) return;
    
    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    
    function updateCounter() {
        const currentLength = messageTextarea.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }
    
    messageTextarea.addEventListener('input', updateCounter);
    messageTextarea.parentNode.appendChild(counter);
    updateCounter();
}

// ===== ФУНКЦИИ ДЛЯ АДМИНИСТРИРОВАНИЯ =====
function getContactMessages() {
    return JSON.parse(localStorage.getItem('contactMessages') || '[]');
}

function clearContactMessages() {
    localStorage.removeItem('contactMessages');
    window.AppUtils.showNotification('История сообщений очищена', 'success');
}

function exportContactMessages() {
    const messages = getContactMessages();
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact-messages-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    window.AppUtils.showNotification('Сообщения экспортированы!', 'success');
}

// Инициализируем счетчик символов
document.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCounter();
});

// Экспорт функций для использования в других скриптах
window.ContactsApp = {
    validateForm,
    getContactMessages,
    clearContactMessages,
    exportContactMessages,
    copyToClipboard
};