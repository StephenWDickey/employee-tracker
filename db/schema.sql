-- when we source this file and a table already exists we will delete it
-- then we create a new table with correct info

-- employees table must come first because it relies on all the other tables
DROP TABLE IF EXISTS managers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;




CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);


CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INTEGER,

    -- CONSTRAINT is called fk_roles
    -- the FOREIGN KEY is attached to the department_id column
    -- REFERENCES refers to the table it is referencing, with column in ()
    -- so we get id from departments table for dept_id
    CONSTRAINT fk_roles FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
    
);



CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,

    CONSTRAINT fk_employeeRole FOREIGN KEY (role_id) REFERENCES roles(id)
    
    
);


CREATE TABLE managers (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    title VARCHAR(30) NOT NULL,
    manager_id INTEGER NOT NULL,

    CONSTRAINT fk_managerRole FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_managerId FOREIGN KEY (manager_id) REFERENCES employees(id)
    
    
);










