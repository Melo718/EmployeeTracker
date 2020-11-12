var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employeeDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("The Employee Tracker")
  console.log("")

  start();
});


function start() {
  inquirer
    .prompt({
      name: "userSelection",
      type: "list",
      message: "Would you like to do? (Use arrow keys)",
      choices: ["View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "View All Departments",
        "View All Roles",
        "Add an Employee",
        "Add a Department",
        "Add a Role",
        "Update Employee Role",
        "Exit",
      ]

    })
    .then(function (answer) {
      if (answer.userSelection === "View All Employees") {
        viewAllEmployees();
      } else if (answer.userSelection === "View All Employees by Department") {
        viewEmpByDepartment();
      } else if (answer.userSelection === "View All Employees by Manager") {
        viewEmpByManager();
      } else if (answer.userSelection === "View All Departments") {
        viewAllDepartments();
      } else if (answer.userSelection === "View All Roles") {
        viewAllRoles();
      } else if (answer.userSelection === "Add an Employee") {
        addEmployee();
      } else if (answer.userSelection === "Add a Department") {
        addDepartment();
      } else if (answer.userSelection === "Add a Role") {
        addRole();
      } else if (answer.userSelection === "Update Employee Role") {
        updateEmployee();
      }
      else if (answer.userSelection === "Exit") {
        connection.end();
      }
    });
}

function viewAllEmployees() {
  let query = "SELECT e.id, e.first_name, e.last_name, department.name AS department, role.title, role.salary, m.first_name AS manager_first_name,  m.last_name AS manager_last_name from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id=role.id INNER JOIN department ON department.id=role.department_id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}


function viewEmpByManager() {
  inquirer
    .prompt([
      {
        name: "managerFirstname",
        type: "input",
        message: "What is the managers first name?"
      },
      {
        name: "managerLastname",
        type: "input",
        message: "What is the managers last name?"

      }
    ])
    .then(function (answer) {
      console.log(answer.managerFirst + " " & answer.managerLast);
      let query = "SELECT e.id, e.first_name, e.last_name, department.name AS department, role.title, role.salary, m.first_name AS manager_first_name,  m.last_name AS manager_last_name from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id=role.id INNER JOIN department ON department.id=role.department_id WHERE m.first_name=? AND m.last_name=?";
      connection.query(query, [answer.managerFirst, answer.managerLast], function (err, res) {
        if (err) throw err;
        console.table(res);
        start()

      });
    });
}

function viewEmpByDepartment() {
  connection.query("SELECT * FROM department", (err, res) => {
    const departments = res.map(depart => { return { name: depart.name, value: depart.id } })

    inquirer
      .prompt(
        {
          name: "department",
          type: "list",
          message: "Enter Department: ",
          choices: department
        }
      )
      .then(function (answer) {
        console.log(answer.department);
        let query = "SELECT e.id, e.first_name, e.last_name, department.name AS department, role.title, role.salary, m.first_name AS manager_first_name,  m.last_name AS manager_last_name from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id=role.id INNER JOIN department ON department.id=role.department_id WHERE department.id=?";
        connection.query(query, answer.department, function (err, res) {
          if (err) throw err;
          console.table(res);
          start()
        });

      });

  })
}



function addEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const managerList = res.map(employee => {
      return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
    })
    connection.query("SELECT * FROM role_id", (err, res) => {

      const roleList = res.map(role_id => { return { name: role_id.title, value: role.id } })

      inquirer
        .prompt([
          {
            name: "first-name",
            type: "input",
            message: "What is the employee's first name?"
          },
          {
            name: "last-name",
            type: "input",
            message: "What is the employee's last name?"
          },
          {
            name: "role-id",
            type: "list",
            message: "What is the employee's role?",
            choices: [
                "Developer",
                "Back-end",
                "Front-end",
                "Full-Stack",
                "java",
                "sql",
            ]
          },
          {
            name: "manager-id",
            type: "list",
            message: "Who is your employee's manager?",
            choices: [
                "Camilo",
                "Pat",
                "Allison",
                "Dallis",
                "Felicia",
                "Paul",

            ]
          },          
        ])
        .then(function (answer) {
          connection.query(
            "INSERT INTO employee SET ?;",
            answer,
            function (err) {
              if (err) throw err;
              console.log("success!");
              start();
            }
          );
        });
    })
  })

}


function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}


function viewAllRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}

function addRole() {
  let query = "SELECT * FROM department;"
  connection.query(query, function (err, res) {
    if (err) throw err;
    const departmentList = res.map(department => {

      return { name: department.name, value: department.id }
    })

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the new job title: "
        },
        {
          name: "salary",
          type: "input",
          message: "Enter your salary: "
        },
        {
          name: "department_id",
          type: "list",
          message: "Select a department:",
          choices: departmentList

        }
      ])
      .then(function (answer) {

        connection.query(`INSERT INTO role SET ?`, answer, function (error, results) {
          if (error) throw error;
          console.log("success");
          start()
        });
      });
  });
}

function addDepartment() {
 
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What department would you like to add? "
        },
                
      ])
      .then(function (answer) {
        connection.query(`INSERT INTO department SET ?`, answer, function (error, results) {
          if (error) throw error;
          console.log("success");
          start()
        });
      });

}

function updateEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const employeeList = res.map(employee => {
      return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
    })
    connection.query("SELECT * FROM role", (err, res) => {

      const roleList = res.map(role => { return { name: role.title, value: role.id } })

      inquirer
        .prompt([
          {
            name: "id",
            type: "list",
            message: "Which employee would you like to update?",
            choices: employeeList
          },
          {
            name: "role_id",
            type: "list",
            message: "What is the employee's role?",
            choices: roleList
          },          
        ])
        .then(function (answer) {

          console.log(answer)
          connection.query(
            "UPDATE employee SET role_id=? WHERE id=?;",
          [answer.role_id, answer.id],
            function (err) {
              if (err) throw err;
              console.log("The record was created successfully!");
              start();
            }
          );
        });
    })
  })

}