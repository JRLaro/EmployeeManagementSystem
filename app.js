// dependencies
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const connection = require('./db/connection');

// emsLogo -> displays the logo 
emsLogo();
function emsLogo() {
    //adds the logo
    const logoText = logo({ name: "Employee Management System" }).render();
    console.log(logoText);
    loadMainMenu();
}
///////////////////////////// loadMainMenu starts the prompts
function loadMainMenu() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Roles","Update Role", "Actually...NVM"]
        //////////////////////////////// OPTION and OUTCOME
    }).then((answers) => {
        switch (answers.choices) {
            case "View Employees":
                viewEmployee();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Roles":
                addRole();
                break;
            case "Update Role":
                updateRole();
                break;
            case "Actually...NVM":
                connection.end();
                break;
            default:
                connection.end();
                break;
        }
    });
}
///////////////////////////////////////// VIEW EMPLOYEES////////////////////
function viewEmployee() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, answers) {
        if (err) throw err;
        console.table(answers);
        loadMainMenu();
    });
};
///////////////////////////////////////// VIEW DEPARTMENT////////////////////
function viewDepartments() {
    var query = "SELECT name FROM department";
    connection.query(query, function (err, answers) {
        if (err) throw err;
        console.table(answers);
        loadMainMenu();
    });
};
///////////////////////////////////////// VIEW ROLE////////////////////
function viewRole() {
    var query = "SELECT title FROM role";
    connection.query(query, function (err, answers) {
        if (err) throw err;
        console.table(answers);
        loadMainMenu();
    });
};
///////////////////////////////////////// ADD EMPLOYEES////////////////////
var managerData = [];
function addEmployee() {
    connection.query("SELECT * FROM role", function (err, answers) {
        if (err) throw err;
        connection.query("SELECT * FROM employee", function (err, employeeData) {
            if (err) throw err;
            managerData = employeeData
        })
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the First Name of your Employee?",
                validate: function (firstName) {
                    if (!(firstName) === false) {
                        return true;
                    } else {
                        console.log('*Please enter a valid First Name!*');
                        return false;
                    }
                }
            },
            { 
                name: "lastName",
                type: "input",
                message: "What is the Last Name of your Employee?",
                validate: function (firstName) {
                    if (!(firstName) === false) {
                        return true;
                    } else {
                        console.log('*Please enter a valid Last Name!*');
                        return false;
                    }
                }
            },
            {
                name: "role",
                type: "list",
                choices: function () {
                    var roleArray = [];
                    for (var i = 0; i < answers.length; i++) {
                        roleArray.push(answers[i].title);
                    }
                    return roleArray;
                },
                message: "What is the Role of your Employee?",
            },
            {
                name: "manager",
                type: "list",
                message: "Who is the Manager of your Employee?",
                choices: function () {
                    var employeeArray = [];
                    for (var i = 0; i < managerData.length; i++) {
                        employeeArray.push(managerData[i].first_name + " " + managerData[i].last_name);
                    }
                    return employeeArray;
                },
            },
        ]).then((response) => {
            var chosenRole;
            for (var i = 0; i < answers.length; i++) {
                if (answers[i].title === response.role) {
                    chosenRole = answers[i].id;
                }
            }
            var chosenManager;
            for (var i = 0; i < managerData.length; i++) {
                if ((managerData[i].first_name + " " + managerData[i].last_name) === answers.manager) {
                    chosenManager = answers[i].manager_id;
                }
            }
            connection.query(
                "INSERT INTO employee SET ?", // this takes in the obj below ""
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: chosenRole,
                    manager_id: chosenManager
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your Employee was successfully added!");
                    loadMainMenu();
                }
            );
        });
    });
}
///////////////////////////////////////// ADD DEPARTMENT////////////////////

function addDepartment() {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "What is the name of the Department you would like to add?"
        },
    ]).then((answers) => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answers.deptName
            },
            function (err) {
                if (err) throw err;
                console.log("Your Department was successfully added");
                loadMainMenu();
            }
        );
    });
};
///////////////////////////////////////// ADD ROLE////////////////////
function addRole() {
    connection.query("SELECT * FROM department", function (err, answers) {
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "What is the name of the Role you would like to add?",
                validate: function (value) {
                    if (!(value) === false) {
                        return true;
                    } else {
                        console.log('*Please enter a valid Role!*');
                        return false;
                    }
                }
            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is the salary of this specific Role?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        console.log(' *Please enter a valid number!*');
                        return false;
                    }
                }
            },
            {
                name: "deptId",
                type: "list",
                message: "What is the Department of this Role?",
                choices: function () {
                    var deptArray = [];
                    for (var i = 0; i < answers.length; i++) {
                        deptArray.push(answers[i].name);
                    }
                    return deptArray;
                },
            },
        ]).then((response) => {
            var chosenDeptId;
            for (var i = 0; i < answers.length; i++) {
                if (answers[i].name === response.deptId) {
                    chosenDeptId = answers[i].id;
                }
            }
            connection.query(
                "INSERT INTO role SET ?", // this takes in the obj below ""
                {
                    title: response.roleTitle,
                    salary: response.roleSalary,
                    department_id: chosenDeptId
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your Role was successfully added!");
                    loadMainMenu();
                }
            );
        });
    });
};
/////////////////////////////////////////////////////UPDATE ROLE

var dataRole = [];
// Function for updating the employee roles
function updateRole() {
  // query the database for all items in employees
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    connection.query("SELECT * FROM role", function (err, data) {
      if (err) throw err;
      dataRole = data;
    });
    // once you have the items, prompt the user for which employee's role they'd like upgrade
    inquirer
      .prompt([
        {
          name: "updateRole",
          type: "list",
          message: "Which employee would you like to do a role change on?",
          choices: function () {
            var empRolesArray = [];
            for (var i = 0; i < results.length; i++) {
              empRolesArray.push(
                results[i].first_name + " " + results[i].last_name
              );
            }
            return empRolesArray;
          },
        },
        {
          name: "roleChange",
          type: "list",
          message: "What you wou like their new role to be?",
          choices: function () {
            var empRolesArray = [];
            for (var i = 0; i < dataRole.length; i++) {
              empRolesArray.push(dataRole[i].title);
            }
            return empRolesArray;
          },
        },
      ])
      .then(function (answer) {
        var roleId;
        for (var i = 0; i < dataRole.length; i++) {
          if (dataRole[i].title === answer.roleChange) {
            roleId = dataRole[i].id;
          }
        }
        var chosenName;
        for (var i = 0; i < results.length; i++) {
          if (
            results[i].first_name + " " + results[i].last_name ===
            answer.updateRole
          ) {
            chosenName = results[i].id;
          }
        }
        // Update role ID
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [roleId, chosenName],
          function (error) {
            if (error) throw err;
            console.log(
              `Congratulations on successfully changing ${answer.updateRole}'s Role!"`
            );
            loadMainMenu();
          }
        );
      });
  });
}