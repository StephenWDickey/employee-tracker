// import required modules
const mysql = require("mysql2");

const inquirer = require("inquirer")

// we import the connection to database
const db = require('./db/connection');



///////////////////////////////////////////////////////////////

// we need beginning prompts from inquirer


const start = () => {
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
            viewAllDepartments();
        }

        else if (answers.options === "View All Roles") {
            viewAllRoles();
        }

        else if (answers.options === "View All Employees") {
            viewAllEmployees();
        }

        else if ( answers.options === "Add Department") {
            addDepartment();
        }

        else if (answers.options === "Add Role") {
            addRole();
        }

        else if (answers.options === "Add Employee") {
            addEmployee();
        }

        else if (answers.options === "Update Employee") {

        }

    })
};

// call our function to begin
start();


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

    // we will query the db then put inquirer prompts 
    // within so there are options that we already know
    db.query("SELECT * FROM roles", function (err, data) {

        if(err) throw err;

        // we generate a new array using map()
        // it will return an array of objects with
        // keys of the role title, and values of the role id
        let role = data.map(role => {

            return {name: role.title, value: role.id}

        })

        db.query("SELECT * FROM employees", function (err, data) {

            if (err) throw err;

            // the map() function will generate a new array
            // each item in the array will have this function acted on it
            // in this case, each item in the array will be an object
            // the key will be first and last name, the value will be
            // the employee's id
            let manager = data.map(manager => {
                return { name: `${manager.first_name} ${manager.last_name}`, value: manager.id }
            })
            inquirer.prompt([
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
                    message: "Choose the team member that will oversee the new employee.",
                    choices: manager
                }]).then(answers => {
                    // the SET command allows us to enter 
                    db.query("INSERT INTO employees SET ?", answers, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                })
        })
    })
    
}


/////////////////////////////////////////////


