const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const connection = require('./db/connection');


// require('console.table');

init();

function init() {
    //adds the logo
    const logoText = logo({ name: "Employee Management System" }).render();
    console.log(logoText);
    loadMainMenu();
}
// starts the prompts
function loadMainMenu() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Roles", "Update Employee", "Update Department", "Update Role", "Actually...NVM"]
    }).then((answers) => { // OPTION and OUTCOME
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
            case "Update Employee":
                updateEmployee();
                break;
            case "Update Role":
                updateRole();
                break;
            case "Update Department":
                updateDept();
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
    var query = "SELECT first_name, last_name FROM employee";
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
function addEmployee() {
    connection.query("SELECT * FROM role", function (err, answers) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the First Name of your Employee?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the Last Name of your Employee?"
            },
            {
                name: "role",
                type: "list",
                // add list of roles
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
                type: "input",
                message: "Who is the Manager of your Employee?",
            },
        ]).then((response) => {
            var chosenItem;
            for (var i = 0; i < answers.length; i++) {
                if (answers[i].title === response.role) {
                    chosenItem = answers[i].id;
                }
            }
            connection.query(
                "INSERT INTO employee SET ?", // this takes in the obj below ""
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: chosenItem,
                    manager_id: response.manager
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your Employee was successfully added");
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
            "INSERT INTO department SET ?", // this takes in the obj below ""
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
                message: "What is the name of the Role you would like to add?"

            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is the salary of this specific Role?"

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
                    console.log("Your Role was successfully added");
                    loadMainMenu();
                }
            );
        });

    });
}

// JOSE YOU NEED TO WORK ON ADD ROLE (as it is not reflecting the array of current Department. ---> essentially you need to just emulate addEmployees - Role section....Good luck.