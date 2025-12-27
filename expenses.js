// ===== Expense Management Functions =====

let allExpenses = [];
let filteredExpenses = [];

async function loadExpenses() {
    await refreshCache();
    allExpenses = getExpenses();
    filteredExpenses = [...allExpenses];
    renderExpenses();
    updateStats();
    loadCategoryOptions();
}

function renderExpenses() {
    const container = document.getElementById('expenses-container');
    if (!container) return;

    if (filteredExpenses.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📝</div>
                <h3>No expenses yet</h3>
                <p>Click "Add Expense" to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredExpenses.map(expense => {
        const category = getCategoryById(expense.categoryId);
        const categoryStyle = category ? `background: ${category.color}20; color: ${category.color};` : '';
        const categoryIcon = category ? category.icon : '💰';
        const categoryName = category ? category.name : 'Uncategorized';

        return `
            <div class="expense-card">
                <div class="expense-header">
                    <div>
                        <div class="expense-amount">${formatCurrency(expense.amount)}</div>
                        <span class="expense-category" style="${categoryStyle}">
                            <span>${categoryIcon}</span>
                            <span>${categoryName}</span>
                        </span>
                    </div>
                </div>
                <div class="expense-description">${escapeHtml(expense.description)}</div>
                <div class="expense-meta">
                    <span>📅 ${formatDate(expense.expenseDate)}</span>
                    <span>💳 ${expense.paymentMethod || 'cash'}</span>
                </div>
                ${expense.notes ? `<div style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">${escapeHtml(expense.notes)}</div>` : ''}
                <div class="expense-actions">
                    <button onclick="editExpense('${expense.id}')" style="flex: 1;">Edit</button>
                    <button onclick="deleteExpense('${expense.id}')" class="btn-danger" style="flex: 1;">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterExpenses() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    filteredExpenses = allExpenses.filter(expense => {
        const category = getCategoryById(expense.categoryId);
        const categoryName = category ? category.name.toLowerCase() : '';
        return expense.description.toLowerCase().includes(searchTerm) ||
               categoryName.includes(searchTerm) ||
               expense.notes?.toLowerCase().includes(searchTerm);
    });
    renderExpenses();
}

function updateStats() {
    const stats = calculateStats();
    const totalEl = document.getElementById('total-stat');
    const monthlyEl = document.getElementById('monthly-stat');
    const weeklyEl = document.getElementById('weekly-stat');
    
    if (totalEl) totalEl.textContent = formatCurrency(stats.total);
    if (monthlyEl) monthlyEl.textContent = formatCurrency(stats.monthlyTotal);
    if (weeklyEl) weeklyEl.textContent = formatCurrency(stats.weeklyTotal);
}

function openAddExpenseModal() {
    document.getElementById('expense-modal').classList.add('active');
    document.getElementById('modal-title').textContent = 'Add Expense';
    document.getElementById('expense-form').reset();
    document.getElementById('expense-id').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
}

function closeExpenseModal() {
    document.getElementById('expense-modal').classList.remove('active');
}

function editExpense(id) {
    const expense = allExpenses.find(e => e.id === id);
    if (!expense) return;

    document.getElementById('expense-modal').classList.add('active');
    document.getElementById('modal-title').textContent = 'Edit Expense';
    document.getElementById('expense-id').value = expense.id;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-description').value = expense.description;
    document.getElementById('expense-category').value = expense.categoryId || '';
    document.getElementById('expense-date').value = expense.expenseDate;
    document.getElementById('expense-payment').value = expense.paymentMethod || 'cash';
    document.getElementById('expense-notes').value = expense.notes || '';
}

async function saveExpense(event) {
    event.preventDefault();
    
    const id = document.getElementById('expense-id').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const description = document.getElementById('expense-description').value.trim();
    const categoryId = document.getElementById('expense-category').value || null;
    const expenseDate = document.getElementById('expense-date').value;
    const paymentMethod = document.getElementById('expense-payment').value;
    const notes = document.getElementById('expense-notes').value.trim() || null;

    const expenses = getExpenses();
    
    if (id) {
        // Edit existing
        const index = expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            expenses[index] = {
                ...expenses[index],
                amount,
                description,
                categoryId,
                expenseDate,
                paymentMethod,
                notes
            };
            showAlert('success', 'Expense Updated', 'Your expense has been updated successfully.');
        }
    } else {
        // Add new
        const newExpense = {
            id: generateId(),
            amount,
            description,
            categoryId,
            expenseDate,
            paymentMethod,
            notes
        };
        expenses.push(newExpense);
        showAlert('success', 'Expense Added', 'Your expense has been added successfully.');
    }

    await saveExpenses(expenses);
    closeExpenseModal();
    loadExpenses();
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    const expenses = getExpenses().filter(e => e.id !== id);
    await saveExpenses(expenses);
    showAlert('success', 'Expense Deleted', 'The expense has been deleted.');
    loadExpenses();
}

function loadCategoryOptions() {
    const select = document.getElementById('expense-category');
    if (!select) return;

    const categories = getCategories();
    select.innerHTML = '<option value="">Select a category</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Supabase to be ready
    if (window.supabaseReady) {
        loadExpenses();
    } else {
        setTimeout(loadExpenses, 1000);
    }
});

// Make functions globally available
window.loadExpenses = loadExpenses;
window.openAddExpenseModal = openAddExpenseModal;
window.closeExpenseModal = closeExpenseModal;
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.filterExpenses = filterExpenses;

