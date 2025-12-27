// ===== Core Application Logic =====

// Storage keys
const STORAGE_KEYS = {
    CATEGORIES: 'expense_categories',
    EXPENSES: 'expense_expenses',
    BUDGETS: 'expense_budgets'
};

// ===== Storage Functions =====
async function getStorage(key) {
    if (window.supabaseStorage && window.supabaseStorage.getStorage) {
        return await window.supabaseStorage.getStorage(key);
    }
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

async function setStorage(key, data) {
    if (window.supabaseStorage && window.supabaseStorage.setStorage) {
        await window.supabaseStorage.setStorage(key, data);
    } else {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Synchronous wrappers for backward compatibility
let storageCache = {
    categories: [],
    expenses: [],
    budgets: []
};

async function refreshCache() {
    try {
        storageCache.categories = await getStorage(STORAGE_KEYS.CATEGORIES);
        storageCache.expenses = await getStorage(STORAGE_KEYS.EXPENSES);
        storageCache.budgets = await getStorage(STORAGE_KEYS.BUDGETS);
        console.log('Cache refreshed:', {
            categories: storageCache.categories.length,
            expenses: storageCache.expenses.length,
            budgets: storageCache.budgets.length
        });
    } catch (error) {
        console.error('Error refreshing cache:', error);
    }
}

window.refreshCache = refreshCache;

function getCategories() {
    return storageCache.categories || [];
}

async function saveCategories(categories) {
    storageCache.categories = categories;
    await setStorage(STORAGE_KEYS.CATEGORIES, categories);
    await refreshCache();
}

function getExpenses() {
    return storageCache.expenses || [];
}

async function saveExpenses(expenses) {
    storageCache.expenses = expenses;
    await setStorage(STORAGE_KEYS.EXPENSES, expenses);
    await refreshCache();
}

function getBudgets() {
    return storageCache.budgets || [];
}

async function saveBudgets(budgets) {
    storageCache.budgets = budgets;
    await setStorage(STORAGE_KEYS.BUDGETS, budgets);
    await refreshCache();
}

// ===== Alert System =====
function showAlert(type, title, message, duration = 5000) {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    
    alert.innerHTML = `
        <div class="alert-content">
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        </div>
        <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(alert);

    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => alert.remove(), 300);
        }
    }, duration);
}

// ===== Utility Functions =====
function generateId() {
    if (window.supabaseStorage && window.supabaseStorage.isSupabaseAvailable && window.supabaseStorage.isSupabaseAvailable()) {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getCategoryById(id) {
    const categories = getCategories();
    return categories.find(c => c.id === id);
}

// ===== Expense Statistics =====
function calculateStats() {
    const expenses = getExpenses();
    const now = new Date();
    const thisMonth = expenses.filter(e => {
        const expenseDate = new Date(e.expenseDate);
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
    });
    
    const thisWeek = expenses.filter(e => {
        const expenseDate = new Date(e.expenseDate);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return expenseDate >= weekAgo;
    });
    
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
    const weeklyTotal = thisWeek.reduce((sum, e) => sum + e.amount, 0);
    
    return {
        total,
        monthlyTotal,
        weeklyTotal,
        totalCount: expenses.length,
        monthlyCount: thisMonth.length,
        weeklyCount: thisWeek.length
    };
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async function() {
    await refreshCache();
    
    // Set today's date as default for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
});

