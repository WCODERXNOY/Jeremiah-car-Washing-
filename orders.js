const ordersList = document.querySelector('#orders-list');
const SUPABASE_URL = 'https://kcsdcvumecceiqgaesqb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tVsGha-B0q5CyWmmnPzyLQ_EhZNlxol';
const ordersEndpoint = `${SUPABASE_URL}/rest/v1/orders`;
let orders = [];

function formatDate(value) {
    if (!value) return 'Date not set';
    return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function renderOrders() {
    document.querySelector('#order-count').textContent = `${orders.length} ${orders.length === 1 ? 'booking' : 'bookings'}`;
    ordersList.replaceChildren();
    if (!orders.length) {
        ordersList.innerHTML = '<div class="empty-orders"><span>✦</span><h2>No wash orders yet</h2><p>Book a wash and your appointment will appear here.</p><a class="primary-button" href="page2.html">Book a wash →</a></div>';
        return;
    }
    orders.forEach(order => {
        const card = document.createElement('article');
        card.className = 'order-card';
        card.innerHTML = `<div class="order-icon">✦</div><div class="order-main"><div class="order-top"><div><p class="eyebrow">${order.status}</p><h2>${order.service}</h2></div><strong>$${order.price}</strong></div><p class="order-customer">${order.name} · ${order.car}</p><div class="order-details"><span><b>When</b>${formatDate(order.date)}<br>${order.time}</span><span><b>Payment</b>${order.payment}</span></div><button class="cancel-order" type="button">Cancel this wash</button></div>`;
        card.querySelector('.cancel-order').addEventListener('click', () => {
            cancelOrder(order);
        });
        ordersList.append(card);
    });
}

async function loadOrders() {
    try {
        const response = await fetch(`${ordersEndpoint}?select=*&order=id.desc`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
        if (!response.ok) throw new Error('Supabase order load failed');
        orders = await response.json();
    } catch (error) {
        orders = JSON.parse(localStorage.getItem('jeremiah-orders') || '[]');
    }
    renderOrders();
}

async function cancelOrder(order) {
    try {
        const response = await fetch(`${ordersEndpoint}?id=eq.${encodeURIComponent(order.id)}`, { method: 'DELETE', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
        if (!response.ok) throw new Error('Supabase order cancellation failed');
        orders = orders.filter(item => item.id !== order.id);
    } catch (error) {
        orders = orders.filter(item => item.id !== order.id);
        localStorage.setItem('jeremiah-orders', JSON.stringify(orders));
    }
    renderOrders();
}

loadOrders();
