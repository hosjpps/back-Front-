// ===== ВАЛИДАЦИЯ ФОРМ =====

// Основная функция валидации формы
function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Валидация отдельного поля
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Очищаем предыдущие ошибки
    clearFieldError(field);
    
    // Проверка обязательных полей
    if (isRequired && !value) {
        showFieldError(field, 'Это поле обязательно для заполнения');
        return false;
    }
    
    // Если поле пустое и не обязательное, считаем валидным
    if (!value && !isRequired) {
        return true;
    }
    
    // Валидация по типу поля
    switch (fieldType) {
        case 'email':
            return validateEmail(field, value);
        case 'tel':
            return validatePhone(field, value);
        case 'url':
            return validateUrl(field, value);
        case 'number':
            return validateNumber(field, value);
        default:
            return validateText(field, value);
    }
}

// Валидация email
function validateEmail(field, value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
        showFieldError(field, 'Введите корректный email адрес');
        return false;
    }
    
    return true;
}

// Валидация телефона
function validatePhone(field, value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        showFieldError(field, 'Введите корректный номер телефона');
        return false;
    }
    
    return true;
}

// Валидация URL
function validateUrl(field, value) {
    try {
        new URL(value);
        return true;
    } catch {
        showFieldError(field, 'Введите корректный URL');
        return false;
    }
}

// Валидация числовых полей
function validateNumber(field, value) {
    const min = field.getAttribute('min');
    const max = field.getAttribute('max');
    const num = parseFloat(value);
    
    if (isNaN(num)) {
        showFieldError(field, 'Введите корректное число');
        return false;
    }
    
    if (min !== null && num < parseFloat(min)) {
        showFieldError(field, `Значение должно быть не менее ${min}`);
        return false;
    }
    
    if (max !== null && num > parseFloat(max)) {
        showFieldError(field, `Значение должно быть не более ${max}`);
        return false;
    }
    
    return true;
}

// Валидация текстовых полей
function validateText(field, value) {
    const minLength = field.getAttribute('minlength');
    const maxLength = field.getAttribute('maxlength');
    
    if (minLength && value.length < parseInt(minLength)) {
        showFieldError(field, `Минимальная длина: ${minLength} символов`);
        return false;
    }
    
    if (maxLength && value.length > parseInt(maxLength)) {
        showFieldError(field, `Максимальная длина: ${maxLength} символов`);
        return false;
    }
    
    return true;
}

// Показать ошибку поля
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    // Найти или создать элемент для отображения ошибки
    let errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// Очистить ошибку поля
function clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    
    const errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Показать успешную валидацию поля
function showFieldSuccess(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    const errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Инициализация валидации в реальном времени
function initializeRealTimeValidation() {
    document.addEventListener('input', function(e) {
        const field = e.target;
        if (field.matches('input, textarea, select')) {
            // Валидируем поле с небольшой задержкой
            clearTimeout(field.validationTimeout);
            field.validationTimeout = setTimeout(() => {
                if (validateField(field)) {
                    showFieldSuccess(field);
                }
            }, 500);
        }
    });
    
    document.addEventListener('blur', function(e) {
        const field = e.target;
        if (field.matches('input, textarea, select')) {
            if (validateField(field)) {
                showFieldSuccess(field);
            }
        }
    });
}

// Инициализация валидации форм
function initializeFormValidation() {
    // Валидация при отправке формы
    document.addEventListener('submit', function(e) {
        const form = e.target;
        
        if (form.matches('form')) {
            e.preventDefault();
            
            if (validateForm(form)) {
                handleFormSubmit(form);
            } else {
                // Прокрутить к первому полю с ошибкой
                const firstError = form.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        }
    });
    
    // Инициализация валидации в реальном времени
    initializeRealTimeValidation();
}

// Обработка отправки формы
function handleFormSubmit(form) {
    const formId = form.id;
    const formData = new FormData(form);
    
    // Показать индикатор загрузки
    showFormLoading(form);
    
    // Имитация отправки формы
    setTimeout(() => {
        hideFormLoading(form);
        
        switch (formId) {
            case 'contactForm':
                handleContactFormSubmit(formData);
                break;
            case 'diaryForm':
                handleDiaryFormSubmit(formData);
                break;
            default:
                showFormSuccess(form, 'Форма успешно отправлена!');
        }
        
        // Очистить форму после успешной отправки
        form.reset();
        clearFormValidation(form);
    }, 1500);
}

// Обработка отправки контактной формы
function handleContactFormSubmit(formData) {
    const name = formData.get('contactName') || formData.get('name');
    const email = formData.get('contactEmail') || formData.get('email');
    const message = formData.get('contactMessage') || formData.get('message');
    
    console.log('Контактная форма отправлена:', { name, email, message });
    
    // Показать уведомление об успехе
    showNotification('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
    
    // Закрыть модальное окно, если форма в модальном окне
    const modal = document.querySelector('#contactModal');
    if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        }
    }
}

// Обработка отправки формы дневника
function handleDiaryFormSubmit(formData) {
    const date = formData.get('date');
    const topic = formData.get('topic');
    const content = formData.get('content');
    
    console.log('Запись в дневник добавлена:', { date, topic, content });
    
    // Показать уведомление об успехе
    showNotification('Запись успешно добавлена в дневник!', 'success');
    
    // Обновить отображение дневника, если функция доступна
    if (typeof updateDiaryDisplay === 'function') {
        updateDiaryDisplay();
    }
}

// Показать индикатор загрузки формы
function showFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Отправка...';
    }
}

// Скрыть индикатор загрузки формы
function hideFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        // Восстановить оригинальный текст кнопки
        const originalText = submitBtn.dataset.originalText || 'Отправить';
        submitBtn.innerHTML = originalText;
    }
}

// Показать сообщение об успехе
function showFormSuccess(form, message) {
    showNotification(message, 'success');
}

// Очистить валидацию формы
function clearFormValidation(form) {
    const fields = form.querySelectorAll('.is-valid, .is-invalid');
    fields.forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });
    
    const errorElements = form.querySelectorAll('.invalid-feedback');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создать элемент уведомления
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически удалить уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Экспорт функций для использования в других модулях
window.FormValidation = {
    validateForm,
    validateField,
    initializeFormValidation,
    showNotification,
    clearFormValidation
};