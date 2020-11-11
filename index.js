var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employeeDB"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("Welcome to the Employee Tracker");
    start()
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
  
function viewAllEmployees() {
    let query = "SELECT e.id, e.first_name, e.last_name, department.name AS department, role.title, role.salary, m.first_name AS manager_first_name,  m.last_name AS manager_last_name from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id=role.id INNER JOIN department ON department.id=role.department_id";
    connection.query(query, function (err, res) {
      if (err) throw err;
      console.table(res);
      start()
    });
}
