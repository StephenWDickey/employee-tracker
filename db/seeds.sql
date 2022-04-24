-- we made a seeds.sql file so we can autopopulate our tables!
-- im gonna get info from the mockup
INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Finance'),
    ('Engineering'),
    ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Salesperson', '80000', 1),
    ('Sales Lead', '100000', 1),
    ('Accountant', '125000', 2),
    ('Account Manager', '160000', 2),
    ('Software Engineer', '120000', 3),
    ('Lead Engineer', '150000', 3),
    ('Lawyer', '190000', 4),
    ('Legal Team Lead', '250000', 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Mike', 'Chan', 1, 2),
    ('John', 'Doe', 2, NULL),
    ('Malia', 'Brown', 3, 4),
    ('Kunal', 'Singh', 4, NULL),
    ('Kevin', 'Tupik', 5, 6),
    ('Ashley', 'Rodriguez', 6, NULL),
    ('Tom', 'Allen', 7, 8),
    ('Sarah', 'Lourd', 8, NULL);


INSERT INTO managers (first_name, last_name, role_id, title, manager_id)
VALUES
    ('John', 'Doe', 2, 'Sales Lead', 2),
    ('Kunal', 'Singh', 4, 'Account Manager', 4),
    ('Ashley', 'Rodriguez', 6, 'Lead Engineer', 6),
    ('Sarah', 'Lourd', 8, 'Legal Team Lead', 8);