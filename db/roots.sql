USE employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineer'),
    ('Finance'),
    ('Legal')

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 10000, 1),
    ('Salesperson', 1000, 1),
    ('Lead Engineer', 20000, 2),
    ('Software Engineer', 2000, 2),
    ('Account Manager', 30000, 3),
    ('Accountant', 3000, 3),
    ('Legal Team Lead', 40000, 4),
    ('Lawyer', 4000, 4)

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Doe', 2, 1),
    ('Johnny', 'Doe', 3, NULL),
    ('Jen', 'Doe', 4, 3),
    ('James', 'Doe', 5, NULL),
    ('Jose', 'Doe', 6, 5),
    ('Jake', 'Doe', 7, NULL),
    ('Jim', 'Doe', 8, 7)