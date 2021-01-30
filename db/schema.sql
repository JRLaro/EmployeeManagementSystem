DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees; -- creates the data

USE employees; -- insures that specific db is being used

CREATE TABLE department ( -- creates table w/additional content
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (-- creates table w/additional content
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DEC UNSIGNED NOT NULL,
    department_id INT
);

CREATE TABLE employees (-- creates table w/additional content
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    manager_id INT UNSIGNED
);

-- possible INNER JOIN -- 
SELECT employee.role_id, role.id
FROM employee
INNER JOIN role ON employee.role_id = role.id;

