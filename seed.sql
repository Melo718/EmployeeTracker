USE employeeDB;

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Camilo","Alvarez", 2, null),("allison", "johnson",1, null),("pat","collins", 3, null),("dallis", "barnes", 1, null), ("felicia", "spencer", 2, null),("paul", "harnish", 1, null);

INSERT INTO role_id (title, salary, department_id)
VALUES ('Sales Lead', 50000000, 1), ('Lead Engineer', 800, 2), ('Software Engineer', 1000000000, 2), ('Accountant', 5786278672, 3);

INSERT INTO department (name)
VALUES (1, 'Sales'), (2, 'Engineering'), (3, 'Finance'), (4, 'Legal');

