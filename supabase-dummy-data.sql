-- Dummy Data for Expense Manager
-- Auto-generated with proper relationships
-- This file inserts sample data respecting foreign key constraints

-- Insert dummy data into categories
INSERT INTO categories (name, color, icon) VALUES
    ('Food & Dining', '#ef4444', '🍔'),
    ('Transportation', '#3b82f6', '🚗'),
    ('Shopping', '#8b5cf6', '🛍️'),
    ('Bills & Utilities', '#f59e0b', '💡'),
    ('Entertainment', '#ec4899', '🎬'),
    ('Healthcare', '#10b981', '🏥'),
    ('Education', '#6366f1', '📚'),
    ('Travel', '#06b6d4', '✈️'),
    ('Other', '#6b7280', '💰')
ON CONFLICT (name) DO NOTHING;

-- Insert dummy data into expenses
-- Note: Using subquery to reference existing categories
INSERT INTO expenses (amount, description, category_id, expense_date, payment_method, notes) VALUES
    (45.50, 'Lunch at restaurant', (SELECT id FROM categories WHERE name = 'Food & Dining' LIMIT 1), CURRENT_DATE - INTERVAL '2 days', 'credit', 'Business lunch meeting'),
    (12.99, 'Uber ride to airport', (SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), CURRENT_DATE - INTERVAL '5 days', 'credit', 'Airport transfer'),
    (89.99, 'New headphones', (SELECT id FROM categories WHERE name = 'Shopping' LIMIT 1), CURRENT_DATE - INTERVAL '7 days', 'credit', 'Wireless headphones'),
    (120.00, 'Electricity bill', (SELECT id FROM categories WHERE name = 'Bills & Utilities' LIMIT 1), CURRENT_DATE - INTERVAL '10 days', 'bank', 'Monthly utility payment'),
    (25.00, 'Movie tickets', (SELECT id FROM categories WHERE name = 'Entertainment' LIMIT 1), CURRENT_DATE - INTERVAL '3 days', 'cash', 'Weekend movie'),
    (150.00, 'Doctor visit', (SELECT id FROM categories WHERE name = 'Healthcare' LIMIT 1), CURRENT_DATE - INTERVAL '14 days', 'credit', 'Annual checkup'),
    (299.99, 'Online course', (SELECT id FROM categories WHERE name = 'Education' LIMIT 1), CURRENT_DATE - INTERVAL '20 days', 'credit', 'Web development course'),
    (450.00, 'Hotel booking', (SELECT id FROM categories WHERE name = 'Travel' LIMIT 1), CURRENT_DATE - INTERVAL '30 days', 'credit', 'Weekend getaway'),
    (15.75, 'Coffee and snacks', (SELECT id FROM categories WHERE name = 'Food & Dining' LIMIT 1), CURRENT_DATE - INTERVAL '1 days', 'cash', 'Morning coffee'),
    (35.20, 'Gas station', (SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), CURRENT_DATE - INTERVAL '4 days', 'debit', 'Fuel for car'),
    (67.50, 'Grocery shopping', (SELECT id FROM categories WHERE name = 'Food & Dining' LIMIT 1), CURRENT_DATE - INTERVAL '6 days', 'debit', 'Weekly groceries'),
    (8.99, 'Streaming subscription', (SELECT id FROM categories WHERE name = 'Entertainment' LIMIT 1), CURRENT_DATE - INTERVAL '8 days', 'credit', 'Monthly subscription'),
    (200.00, 'Dental cleaning', (SELECT id FROM categories WHERE name = 'Healthcare' LIMIT 1), CURRENT_DATE - INTERVAL '12 days', 'credit', 'Regular cleaning'),
    (49.99, 'Books', (SELECT id FROM categories WHERE name = 'Education' LIMIT 1), CURRENT_DATE - INTERVAL '15 days', 'credit', 'Technical books'),
    (320.00, 'Flight tickets', (SELECT id FROM categories WHERE name = 'Travel' LIMIT 1), CURRENT_DATE - INTERVAL '25 days', 'credit', 'Business trip')
ON CONFLICT DO NOTHING;

-- Insert dummy data into budgets
INSERT INTO budgets (category_id, amount, period_start, period_end) VALUES
    ((SELECT id FROM categories WHERE name = 'Food & Dining' LIMIT 1), 500.00, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days'),
    ((SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), 300.00, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days'),
    ((SELECT id FROM categories WHERE name = 'Entertainment' LIMIT 1), 200.00, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days'),
    ((SELECT id FROM categories WHERE name = 'Shopping' LIMIT 1), 400.00, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days')
ON CONFLICT DO NOTHING;

