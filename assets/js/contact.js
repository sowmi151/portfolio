/**
 * Contact Form Email Handling via EmailJS
 */

document.addEventListener('DOMContentLoaded', () => {
    // PUBLIC KEY INITIALIZATION
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
    emailjs.init("YOUR_PUBLIC_KEY");

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            formStatus.textContent = '';

            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with EmailJS Credentials
            const serviceID = 'YOUR_SERVICE_ID';
            const templateID = 'YOUR_TEMPLATE_ID';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
                    formStatus.style.color = '#10b981';
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                    }, 4000);
                }, (err) => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                    formStatus.style.color = '#ef4444';
                    formStatus.textContent = 'Failed to send message. Please try emailing directly.';
                    console.error('EmailJS Error:', err);
                });
        });
    }
});