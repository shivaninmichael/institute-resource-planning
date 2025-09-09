-- Check existing users in the database
SELECT 
    id,
    email,
    first_name,
    last_name,
    is_admin,
    is_faculty,
    is_student,
    is_parent,
    active,
    created_at
FROM users 
ORDER BY created_at;
