// import required modules
const mysql = require("mysql2");

const inquirer = require("inquirer")

// we import the connection to database
const db = require('./db/connection');



///////////////////////////////////////////////////////////////

// we need beginning prompts from inquirer


function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Please select an option.",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee", "Exit"],
        }
    ]).then(answers => {

        if (answers.options === "Exit") {
            db.end();
        }

        else if (answers.options === "View All Departments") {

        }

        else if (answers.options === "View All Roles") {

        }

        else if (answers.options === "View All Employees") {

        }

        else if ( answers.options === "Add Department") {

        }

        else if (answers.options === "Add Role") {

        }

        else if (answers.options === "Add Employee") {

        }

        else if (answers.options === "Update Employee") {

        }

    })
};


////////////////////////////////////////////////////////////////


function viewAllDepartments() {

    db.query("SELECT * FROM departments", function (err, data) {

        if (err) throw err;
        console.table(data);
        start();
    })
};

//////////////////////////////////////////////////////////////////


function viewAllRoles() {

    db.query("SELECT * FROM roles", function (err, data) {

        if (err) throw err;
        console.table(data);
        start();
    })

};


////////////////////////////////////////////////////////////////////


function viewAllEmployees() {

    db.query("SELECT * FROM employees", function (err, data) {

        if (err) throw err;
        console.table(data);
        start();
    })

};


////////////////////////////////////////////////////////////////////



function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            name: "new_department",
            message: "Enter new department name."
        }).then(answers => {
            db.query("INSERT INTO departments (name) VALUES (?)", [answers.new_department], function (err, res) {
                if (err) throw err;
                console.table(res);
                start();
        })
    })
};



//////////////////////////////////////////////////////////////////////////


function addRole() {
    inquirer.prompt(
        {
            type: "input",
            name: "new_role",
            message: "Enter a new position."
        }).then(answers => {
            db.query("INSERT INTO roles (title) VALUES (?)", [answers.new_role], function (err, res) {
                if (err) throw err;
                console.table(res);
                start();
        })
    })
};



///////////////////////////////////////////////////////////////////////////


function addEmployee() {
    inquirer.prompt(
        {   
            type: "input",
            name: "first_name",
            message: "Enter employee's first name."
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter employee's last name."
        },
        {
            type: "list",
            name: "role_id",
            message: "Choose new employee's position.",
            choices: role
        },
        {
            type: "list",
            name: "manager_id",
            message: "Choose the team member that will oversee new employee.",
            choices: manager
        }).then(answers => {
            db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?)", [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], function (err, res) {
                if (err) throw err;
                console.table(res);
                start();
        })
    })
};