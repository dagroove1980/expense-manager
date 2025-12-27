// ===== Supabase Client Setup =====

// Initialize Supabase client
// These will be set via environment variables in Vercel
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

console.log('Supabase initialization check:');
console.log('SUPABASE_URL:', SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'EMPTY');
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 30)}...` : 'EMPTY');

let supabaseClient = null;

// Check if placeholders weren't replaced (build issue)
const hasPlaceholders = SUPABASE_URL.includes('%VITE_') || SUPABASE_ANON_KEY.includes('%VITE_');

// Initialize Supabase if credentials are available
if (SUPABASE_URL && SUPABASE_ANON_KEY && !hasPlaceholders) {
    // Load Supabase client library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function() {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized successfully');
            
            // Set a flag that Supabase is ready
            window.supabaseReady = true;
            
            // Trigger refresh cache after Supabase is ready
            if (window.refreshCache) {
                window.refreshCache().then(() => {
                    console.log('Cache refreshed after Supabase init');
                    // Reload expenses if on expenses page
                    if (typeof loadExpenses === 'function') {
                        loadExpenses();
                    }
                    // Reload categories if on categories page
                    if (typeof loadCategories === 'function') {
                        loadCategories();
                    }
                }).catch(error => {
                    console.error('Error refreshing cache after Supabase init:', error);
                });
            }
            
            // Migrate localStorage data to Supabase on first load
            migrateLocalStorageToSupabase();
        } catch (error) {
            console.error('Error initializing Supabase client:', error);
            window.supabaseReady = false;
        }
    };
    script.onerror = function() {
        console.error('Failed to load Supabase script');
        window.supabaseReady = false;
    };
    document.head.appendChild(script);
} else {
    if (hasPlaceholders) {
        console.error('ERROR: Environment variable placeholders not replaced!');
        console.error('This means the build script did not run correctly.');
    } else {
        console.warn('Supabase credentials not found. Falling back to localStorage.');
    }
}

// ===== Storage Functions with Supabase Fallback =====

async function getStorage(key) {
    if (supabaseClient) {
        try {
            const tableName = getTableName(key);
            console.log(`Fetching ${key} from Supabase table: ${tableName}`);
            
            const { data, error } = await supabaseClient
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Supabase error fetching', key, ':', error);
                return getLocalStorage(key);
            }
            
            console.log(`Fetched ${data ? data.length : 0} records from ${tableName}`);
            const transformed = await transformFromSupabase(data || [], key);
            return transformed;
        } catch (error) {
            console.error('Error fetching from Supabase:', error);
            return getLocalStorage(key);
        }
    }
    return getLocalStorage(key);
}

async function setStorage(key, data) {
    if (supabaseClient) {
        try {
            const tableName = getTableName(key);
            const transformed = transformToSupabase(data, key);
            
            // Delete all existing records and insert new ones
            await supabaseClient.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
            
            if (transformed.length > 0) {
                const { error } = await supabaseClient
                    .from(tableName)
                    .insert(transformed);
                
                if (error) {
                    console.error('Supabase insert error:', error);
                    setLocalStorage(key, data);
                }
            }
        } catch (error) {
            console.error('Error saving to Supabase:', error);
            setLocalStorage(key, data);
        }
    } else {
        setLocalStorage(key, data);
    }
}

// ===== Helper Functions =====

function getTableName(key) {
    const mapping = {
        'expense_categories': 'categories',
        'expense_expenses': 'expenses',
        'expense_budgets': 'budgets'
    };
    return mapping[key] || key;
}

function transformToSupabase(data, key) {
    if (key === 'expense_categories') {
        return data.map(item => ({
            id: item.id || undefined,
            name: item.name,
            color: item.color || '#6366f1',
            icon: item.icon || '💰'
        }));
    } else if (key === 'expense_expenses') {
        return data.map(item => ({
            id: item.id || undefined,
            amount: item.amount,
            description: item.description,
            category_id: item.categoryId || null,
            expense_date: item.expenseDate,
            payment_method: item.paymentMethod || 'cash',
            notes: item.notes || null,
            receipt_url: item.receiptUrl || null
        }));
    } else if (key === 'expense_budgets') {
        return data.map(item => ({
            id: item.id || undefined,
            category_id: item.categoryId || null,
            amount: item.amount,
            period_start: item.periodStart,
            period_end: item.periodEnd
        }));
    }
    return data;
}

async function transformFromSupabase(data, key) {
    if (key === 'expense_categories') {
        return data.map(item => ({
            id: item.id,
            name: item.name,
            color: item.color,
            icon: item.icon,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }));
    } else if (key === 'expense_expenses') {
        return data.map(item => ({
            id: item.id,
            amount: parseFloat(item.amount),
            description: item.description,
            categoryId: item.category_id,
            expenseDate: item.expense_date,
            paymentMethod: item.payment_method,
            notes: item.notes,
            receiptUrl: item.receipt_url,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }));
    } else if (key === 'expense_budgets') {
        return data.map(item => ({
            id: item.id,
            categoryId: item.category_id,
            amount: parseFloat(item.amount),
            periodStart: item.period_start,
            periodEnd: item.period_end,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }));
    }
    return data;
}

// ===== LocalStorage Fallback =====

function getLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ===== Migration Function =====

async function migrateLocalStorageToSupabase() {
    if (!supabaseClient) return;
    
    // Check if migration already done
    if (localStorage.getItem('supabase_migrated') === 'true') return;
    
    try {
        const categories = getLocalStorage('expense_categories');
        const expenses = getLocalStorage('expense_expenses');
        const budgets = getLocalStorage('expense_budgets');
        
        if (categories.length > 0 || expenses.length > 0 || budgets.length > 0) {
            console.log('Migrating localStorage data to Supabase...');
            
            // Migrate categories
            if (categories.length > 0) {
                const transformed = transformToSupabase(categories, 'expense_categories');
                await supabaseClient.from('categories').insert(transformed);
            }
            
            // Migrate expenses
            if (expenses.length > 0) {
                const transformed = transformToSupabase(expenses, 'expense_expenses');
                await supabaseClient.from('expenses').insert(transformed);
            }
            
            // Migrate budgets
            if (budgets.length > 0) {
                const transformed = transformToSupabase(budgets, 'expense_budgets');
                await supabaseClient.from('budgets').insert(transformed);
            }
            
            localStorage.setItem('supabase_migrated', 'true');
            console.log('Migration completed successfully!');
            if (window.showAlert) {
                showAlert('success', 'Data Migrated', 'Your local data has been migrated to the cloud.');
            }
        }
    } catch (error) {
        console.error('Migration error:', error);
    }
}

// Export for use in other files
window.supabaseStorage = {
    getStorage,
    setStorage,
    migrateLocalStorageToSupabase,
    isSupabaseAvailable: () => supabaseClient !== null
};

