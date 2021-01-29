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
                addDept();
                break;
            case "Add Role":
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
    var query = "SELECT * FROM employee";
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

// viewDepartments()