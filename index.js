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
            updateEmployee();
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
                    // the SET command allows us to enter all of our answers
                    // into the table without writing them all out 
                    db.query("INSERT INTO employees SET ?", answers, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                })
        })
    })
    
};


////////////////////////////////////////////////////////


function updateEmployee() {
    // just like before we must query our db to get data first
    // this way we can ask questions based on our data!
    db.query("SELECT * FROM employees", function (err, data) {
        if (err) throw err;
        // we use map() function to apply function to each item in array
        // and then it is making a new array
        // we want each array item to have a name equal to the employee names
        // but we want the values of each object to be equal to the
        // employee id
        let employees = data.map(employees => {
            
            return { name: `${employees.first_name} ${employees.last_name}`, value: employees.id}

        })
        // now we get roles table info so we can change employee role!
        db.query("SELECT * FROM roles", function (err, data) {
            if (err) throw err;

            let roles = data.map(roles => {
                // so now we select the title of the role
                // but it's real value is the role_id
                // this way our table can be updated correctly
                return { name: roles.title, value: roles.id }
            })

            inquirer.prompt([
                {
                    type: "list",
                    name: "employee_choices",
                    message: "Select team member to update.",
                    choices: employees
                },
                {
                    type: "list",
                    name: "new_role",
                    message: "Change team member's position.",
                    choices: roles

                }]).then(answers => {
                    

                    // we update the employees table
                    // we are changing the role_id for the employee_id that we chose
                    db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [answers.new_role, answers.employee_choices], function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start(); 
                    })
                    
                })
        })
    })
};


