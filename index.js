const mysql = require("mysql");
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { inherits } = require("util");

require("console.table");

function init() {
    const logoText = logo({ name: 'Employee Management System' }).render();
    console.log(logoText);
}

init();