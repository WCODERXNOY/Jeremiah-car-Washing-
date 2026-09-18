const sections = document.querySelectorAll('[data-section]');
const navLinks = document.querySelectorAll('.nav-link');
const bookingForm = document.querySelector('#booking-form');
const serviceSelect = document.querySelector('#service-select');
const summaryService = document.querySelector('#summary-service');
const summaryPrice = document.querySelector('#summary-price');
const summaryDetails = document.querySelector('#summary-details');
const dateInput = document.querySelector('#wash-date');

dateInput.min = new Date().toISOString().split('T')[0];

function showView(view) {
    sections.forEach(section => { section.hidden = section.dataset.section !== view; });
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.view === view));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', () => showView(link.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => showView(button.dataset.jump)));

document.querySelectorAll('.service-card').forEach(card => card.addEventListener('click', () => {
    serviceSelect.value = `${card.dataset.service}|${card.dataset.price}`;
    updateSummary();
    showView('book');
}));

function updateSummary() {
    const [service, price] = serviceSelect.value.split('|');
    summaryService.textContent = service;
    summaryPrice.textContent = `$${price}`;
    const date = dateInput.value ? new Date(`${dateInput.value}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'a date';
    summaryDetails.textContent = `${date} at ${document.querySelector('#wash-time').value}. We will have your ${document.querySelector('#car-type').value.toLowerCase()} ready for its shine.`;
}

[serviceSelect, dateInput, document.querySelector('#wash-time'), document.querySelector('#car-type')].forEach(input => input.addEventListener('input', updateSummary));
bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    updateSummary();
    const [service, price] = serviceSelect.value.split('|');
    const booking = { id: Date.now(), name: document.querySelector('#customer-name').value.trim(), car: document.querySelector('#car-type').value, service, price, date: dateInput.value, time: document.querySelector('#wash-time').value, payment: document.querySelector('#payment-method').value, status: 'Booked' };
    const orders = JSON.parse(localStorage.getItem('jeremiah-orders') || '[]');
    orders.unshift(booking);
    localStorage.setItem('jeremiah-orders', JSON.stringify(orders));
    window.location.href = 'orders.html';
});

document.querySelector('#theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('jeremiah-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});
if (localStorage.getItem('jeremiah-theme') === 'light') document.body.classList.add('light-mode');
updateSummary();
