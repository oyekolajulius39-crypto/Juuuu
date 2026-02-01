// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const successMessage = document.getElementById('successMessage');

    // Form fields
    const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    // Validation rules
    const validators = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s'-]+$/,
            errorMessages: {
                required: 'First name is required',
                minLength: 'First name must be at least 2 characters',
                pattern: 'Please enter a valid first name'
            }
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s'-]+$/,
            errorMessages: {
                required: 'Last name is required',
                minLength: 'Last name must be at least 2 characters',
                pattern: 'Please enter a valid last name'
            }
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessages: {
                required: 'Email address is required',
                pattern: 'Please enter a valid email address'
            }
        },
        phone: {
            required: false,
            pattern: /^[\d\s\-\+\(\)]+$/,
            errorMessages: {
                pattern: 'Please enter a valid phone number'
            }
        },
        subject: {
            required: true,
            errorMessages: {
                required: 'Please select a subject'
            }
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            errorMessages: {
                required: 'Message is required',
                minLength: 'Message must be at least 10 characters',
                maxLength: 'Message must not exceed 1000 characters'
            }
        }
    };

    // Validate single field
    function validateField(fieldName) {
        const field = fields[fieldName];
        const rules = validators[fieldName];
        const errorElement = document.getElementById(`${fieldName}Error`);
        const value = field.value.trim();

        // Clear previous error
        field.classList.remove('error');
        errorElement.style.display = 'none';
        errorElement.textContent = '';

        // Required validation
        if (rules.required && !value) {
            showError(field, errorElement, rules.errorMessages.required);
            return false;
        }

        // Skip other validations if field is optional and empty
        if (!rules.required && !value) {
            return true;
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            showError(field, errorElement, rules.errorMessages.minLength);
            return false;
        }

        // Max length validation
        if (rules.maxLength && value.length > rules.maxLength) {
            showError(field, errorElement, rules.errorMessages.maxLength);
            return false;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            showError(field, errorElement, rules.errorMessages.pattern);
            return false;
        }

        return true;
    }

    // Show error message
    function showError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;

        for (let fieldName in validators) {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        }

        return isValid;
    }

    // Add real-time validation on blur
    Object.keys(fields).forEach(fieldName => {
        fields[fieldName].addEventListener('blur', function() {
            validateField(fieldName);
        });

        // Remove error on input
        fields[fieldName].addEventListener('input', function() {
            if (this.classList.contains('error')) {
                const errorElement = document.getElementById(`${fieldName}Error`);
                this.classList.remove('error');
                errorElement.style.display = 'none';
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide previous success message
        successMessage.style.display = 'none';

        // Validate form
        if (!validateForm()) {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Collect form data
        const formData = {
            firstName: fields.firstName.value.trim(),
            lastName: fields.lastName.value.trim(),
            email: fields.email.value.trim(),
            phone: fields.phone.value.trim(),
            subject: fields.subject.value,
            message: fields.message.value.trim(),
            newsletter: document.getElementById('newsletter').checked,
            timestamp: new Date().toISOString()
        };

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            console.log('Form submitted:', formData);

            // Show success message
            successMessage.style.display = 'flex';
            
            // Reset form
            form.reset();

            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        }, 2000); // Simulated 2-second delay
    });

    // Add smooth animations on input focus
    Object.values(fields).forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Character counter for message field
    const messageField = fields.message;
    const messageGroup = messageField.parentElement;
    
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.cssText = 'text-align: right; font-size: 12px; color: #6b7280; margin-top: 4px;';
    messageGroup.appendChild(charCounter);

    function updateCharCounter() {
        const length = messageField.value.length;
        const maxLength = validators.message.maxLength;
        charCounter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            charCounter.style.color = '#ef4444';
        } else if (length > maxLength * 0.7) {
            charCounter.style.color = '#f59e0b';
        } else {
            charCounter.style.color = '#6b7280';
        }
    }

    messageField.addEventListener('input', updateCharCounter);
    updateCharCounter();

    // Prevent form submission on Enter key (except in textarea)
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // Auto-format phone number (US format)
    fields.phone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        e.target.value = value;
    });

    console.log('Contact form initialized successfully!');
});