// PJ Mason Portfolio - Main JavaScript

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio site loaded');

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add active state to navigation based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-links a');
    allNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formMessages = document.getElementById('form-messages');
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoading = document.getElementById('btn-loading');

        // Real-time validation for each field
        const fields = ['name', 'email', 'subject', 'message'];
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorSpan = document.getElementById(`${fieldName}-error`);

            field.addEventListener('blur', function() {
                validateField(field, errorSpan);
            });

            field.addEventListener('input', function() {
                if (field.classList.contains('error')) {
                    validateField(field, errorSpan);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            fields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                const errorSpan = document.getElementById(`${fieldName}-error`);
                if (!validateField(field, errorSpan)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showMessage('Please correct the errors before submitting.', 'error');
                return;
            }

            // Disable submit button and show loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    fields.forEach(fieldName => {
                        document.getElementById(fieldName).classList.remove('success', 'error');
                    });
                } else {
                    showMessage('Oops! There was a problem sending your message. Please try again or contact me directly.', 'error');
                }
            } catch (error) {
                showMessage('Oops! There was a problem sending your message. Please try again or contact me directly.', 'error');
            } finally {
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });

        function validateField(field, errorSpan) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (field.id === 'email') {
                const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
                if (!emailPattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            } else if (field.id === 'name' && value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            } else if (field.id === 'subject' && value.length < 3) {
                isValid = false;
                errorMessage = 'Subject must be at least 3 characters';
            } else if (field.id === 'message' && value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }

            errorSpan.textContent = errorMessage;
            field.classList.remove('success', 'error');
            if (!isValid) {
                field.classList.add('error');
            } else if (value) {
                field.classList.add('success');
            }

            return isValid;
        }

        function showMessage(message, type) {
            formMessages.textContent = message;
            formMessages.className = `form-messages ${type}`;
            formMessages.style.display = 'block';
            formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            if (type === 'success') {
                setTimeout(() => {
                    formMessages.style.display = 'none';
                }, 10000);
            }
        }
    }
});
