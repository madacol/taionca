exports.up = pgm => pgm.sql`
    WITH new_permissions as(
        INSERT INTO permissions 
            (name) VALUES
            ('inv_odt_expenses_create'),('inv_odt_expenses_read'),('inv_odt_expenses_update'),('inv_odt_expenses_delete'),
            ('admin_expenses_create'),('admin_expenses_read'),('admin_expenses_update'),('admin_expenses_delete'),
            ('general_expenses_create'),('general_expenses_read'),('general_expenses_update'),('general_expenses_delete'),
            ('odt_create'),('odt_read'),('odt_update'),('odt_delete'),
            ('exchange_currency_create'),('exchange_currency_read'),('exchange_currency_update'),('exchange_currency_delete'),
            ('inv_purchases_create'),('inv_purchases_read'),('inv_purchases_update'),('inv_purchases_delete'),
            ('stocks_create'),('stocks_read'),('stocks_update'),('stocks_delete'),
            ('storages_create'),('storages_read'),('storages_update'),('storages_delete'),('president')
        RETURNING permission_id
    )
    INSERT INTO join_roles_permissions (role_id, permission_id)
    SELECT role_id, permission_id
    FROM roles, new_permissions
    WHERE roles.name = 'master'
    ;
    
    `;
exports.down = pgm => pgm.sql`
    DELETE FROM permissions WHERE name IN (
        'inv_odt_expenses_create','inv_odt_expenses_read','inv_odt_expenses_update','inv_odt_expenses_delete',
        'admin_expenses_create','admin_expenses_read','admin_expenses_update','admin_expenses_delete',
        'general_expenses_create','general_expenses_read','general_expenses_update','general_expenses_delete',
        'odt_create','odt_read','odt_update','odt_delete',
        'exchange_currency_create','exchange_currency_read','exchange_currency_update','exchange_currency_delete',
        'inv_purchases_create','inv_purchases_read','inv_purchases_update','inv_purchases_delete',
        'stocks_create','stocks_read','stocks_update','stocks_delete',
        'storages_create','storages_read','storages_update','storages_delete', 'president'
    );
    
    `;