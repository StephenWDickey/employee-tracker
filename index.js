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
            choices: ["View All Departments", "View Department Budgets", "View All Roles", "View All Employees", "View Team Members By Manager", "View Team Members By Department", "Add Department", "Add Role", "Add Employee", "Update Employee", "Update Manager", "Remove a Department", "Remove a Position", "Remove a Team Member", "Exit"],
        }
    ]).then(answers => {

        if (answers.options === "Exit") {
            db.end();
        }

        else if (answers.options === "View All Departments") {
            viewAllDepartments();
        }

        else if (answers.options === "View Department Budgets") {
            viewDepartmentBudgets();
        }

        else if (answers.options === "View All Roles") {
            viewAllRoles();
        }

        else if (answers.options === "View All Employees") {
            viewAllEmployees();
        }

        else if (answers.options === "View Team Members By Manager") {

            viewEmployeesByManager();
        }

        else if (answers.options === "View Team Members By Department") {

            viewEmployeesByDept();
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

        else if (answers.options === "Update Manager") {
            updateManager();
        }

        else if (answers.options === "Remove a Department") {
            removeDepartment();
        }

        else if (answers.options === "Remove a Position") {
            removeRole();
        }

        else if (answers.options === "Remove a Team Member") {
            removeEmployee();
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
            message: "Enter new department name. Enter nothing to return to main menu."
        }).then(answers => {
            if (answers.new_department === '') {
                start();
            }
            else {
                db.query("INSERT INTO departments (name) VALUES (?)", [answers.new_department], function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            }
    })
};



//////////////////////////////////////////////////////////////////////////


function addRole() {
    
    db.query("SELECT * FROM departments", function (err, data) {
        
        if (err) throw err;

        let departments = data.map(departments => {

            return { name : departments.name, value: departments.id };
        })
    

        inquirer.prompt([
            {
                type: "input",
                name: "new_role",
                message: "Enter a new position. Enter nothing to return to main menu."

            },
            {
                type: "input",
                name: "salary",
                message: "Enter salary for this position.",
                when: (answers) => answers.new_role !== ""
            },
            {
                type: "list",
                name: "dept_choices",
                message: "Which department does this position fall under?",
                choices: departments,
                when: (answers) => answers.new_role !== ""

            }]).then(answers => {
                if (answers.new_role === "") {
                    start();    
                }

                else {
                    db.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [answers.new_role, answers.salary, answers.dept_choices], function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                })
            }
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

            let nullValue = { name: 'No manager', value: 0 };
            manager.push(nullValue);

            inquirer.prompt([
                {   
                    type: "input",
                    name: "first_name",
                    message: "Enter employee's first name. Enter nothing to return to main menu."
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter employee's last name.",
                    when: (answers) => answers.first_name != ""
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Choose new employee's position.",
                    choices: role,
                    when: (answers) => answers.first_name != ""
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Choose the team member that will oversee the new employee.",
                    choices: manager,
                    when: (answers) => answers.first_name != ""

                }]).then(answers => {

                    if (answers.first_name === "") {
                        start();
                    }
                    
                    
                    else {
                        // the SET command allows us to enter all of our answers
                        // into the table without writing them all out 
                        db.query("INSERT INTO employees SET ?", answers, function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start();
                        })
                    }
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
            
            let nullValue = { name: 'Return to main menu.', value: 100 };
            employees.push(nullValue);
            
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
                    choices: roles,
                    // we are only asking this question if user
                    // does not select return to main menu
                    when: (answers) => answers.employee_choices != 100

                }]).then(answers => {
                    
                    if (answers.employee_choices === 100) {
                        start();
                    }
                        
                    // we update the employees table
                    // we are changing the role_id for the employee_id that we chose
                    // remember our answers reference the NAME OF THE PROMPT
                    // NOT the choices
                    else {
                        db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [answers.new_role, answers.employee_choices], function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start(); 
                        })
                    }
                    
                })
        })
    })
};



//////////////////////////////////////////////////////////////


function viewEmployeesByManager() {

    db.query("SELECT * FROM managers", function (err, data) {

        if (err) throw err;

        // the map() function will generate a new array
        // each item in the array will have this function acted on it
        // in this case, each item in the array will be an object
        // the key will be first and last name, the value will be
        // the manager's id
        let managers = data.map(managers => {
            return { name: `${managers.first_name} ${managers.last_name}, ${managers.title}`, value: managers.manager_id }
        })
        
        let nullValue = { name: 'Return to main menu.', value: 100 };
        managers.push(nullValue);
        
        inquirer.prompt([
            {
                type: "list",
                name: "manager_choices",
                message: "Select manager to view team.",
                choices: managers

            }]).then(answers => {

                if (answers.manager_choices === 100) {
                    start();
                }
                
                // use AND in WHERE statement to have more than one condition
                else{
                    db.query(`SELECT employees.first_name, employees.last_name, roles.title FROM employees, roles WHERE employees.manager_id = ? AND employees.role_id = roles.id`, answers.manager_choices, function (err, res) {
                    
                        if (err) throw err;
                        console.table(res);
                        start();

                    })
                }
            })
    })

}; 



////////////////////////////////////////////////////////////////////////


function viewEmployeesByDept() {

    db.query("SELECT * FROM departments", function (err, data) {

        if (err) throw err;

        // the map() function will generate a new array
        // each item in the array will have this function acted on it
        // in this case, each item in the array will be an object
        // the key will be dept name, the value will be
        // the department's id
        let departments = data.map(departments => {
            return { name: `${departments.name}`, value: departments.id }
        })

        let nullValue = { name: 'Return to main menu.', value: 100 };
        departments.push(nullValue);

        
        inquirer.prompt([
            {
                type: "list",
                name: "department_choices",
                message: "Select a department to view team.",
                choices: departments

            }]).then(answers => {

                if (answers.department_choices === 100) {
                    start();
                }

                // use AND in WHERE statement to have more than one condition
                else { 
                    db.query(`SELECT employees.first_name, employees.last_name, roles.title FROM employees, roles WHERE roles.department_id = ? AND employees.role_id = roles.id`, answers.department_choices, function (err, res) {

                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
            })
    })

}; 



//////////////////////////////////////////////////////////


function updateManager() {

    db.query("SELECT * FROM employees", function (err, data) {

        if (err) throw err;

        // the map() function will generate a new array
        // each item in the array will have this function acted on it
        // in this case, each item in the array will be an object
        // the key will be dept name, the value will be
        // the department's id
        let employees = data.map(employees => {
            return { name: `${employees.first_name} ${employees.last_name}`, value: employees.manager_id }
        })

        db.query("SELECT * FROM managers", function (err, data) {
            
            let managers = data.map(managers => {
                return { name: `${managers.first_name} ${managers.last_name}, ${managers.title}`, value: managers.manager_id}
            })

            let nullValue = { name: 'No Manager', value: null };
            managers.push(nullValue);

            let nullValue2 = { name: 'Return to main menu.', value: 100 };
            employees.push(nullValue2);

            inquirer.prompt([
                {
                    type: "list",
                    name: "employee_choices",
                    message: "Update supervisor for which team member?.",
                    choices: employees

                },
                {
                    type: "list",
                    name: "manager_choices",
                    message: "Select a new manager.",
                    choices: managers,
                    // here we are saying we will ask this question if
                    // the user did not select return to main menu
                    when: (answers) => answers.employee_choices != 100

                }]).then(answers => {

                    if (answers.manager_choices === "No Manager") {
                        db.query(`UPDATE employees SET manager_id = ?`, null, function (err, data) {
                            if (err) throw err;
                            console.table(data);
                            start();
                        })
                    }

                    else if (answers.employee_choices === 100) {
                        start();
                    }
                    
                    else { 
                        // use AND in WHERE statement to have more than one condition
                        db.query(`UPDATE employees SET manager_id = ? WHERE id = ?`, [answers.manager_choices, answers.employee_choices], function (err, res) {

                            if (err) throw err;
                            console.table(res);
                            start();
                        })
                    }
                })
            })        
    })  

}; 



//////////////////////////////////////////////////////////////


function viewDepartmentBudgets () {
    db.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;

        let departments = data.map(departments => {
            
            return { name: departments.name, value: departments.id }
        })

        let nullValue = { name: 'Return to main menu.', value: 100 };
        departments.push(nullValue);
        
        inquirer.prompt([
            {
                type: "list",
                name: "department_choices",
                message: "Select department to view budget.",
                choices: departments

            }]).then(answers => {

                if (answers.department_choices === 100) {
                    start();
                }
            
                else {
                    db.query("SELECT SUM(roles.salary) AS budget FROM roles WHERE roles.department_id = ?", answers.department_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
            
            
        
        })
    })
};


/////////////////////////////////////////////////////////////////////////


function removeDepartment () {
    db.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;

        let departments = data.map(departments => {
            
            return { name: departments.name, value: departments.id }
        })

        let nullValue = { name: 'Return to main menu.', value: 100 };
        departments.push(nullValue);

        inquirer.prompt([
            {
                type: "list",
                name: "department_choices",
                message: "Select department to remove.",
                choices: departments

            }]).then(answers => {

                if (answers.department_choices === 100 ) {
                    start();
                }
                else {
                    db.query("DELETE from departments WHERE departments.id = ?", answers.department_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
            
        
        })
    })
};



///////////////////////////////////////////////////////////////////////////



function removeRole () {
    db.query("SELECT * FROM roles", function (err, data) {
        if (err) throw err;

        let roles = data.map(roles => {
            
            return { name: roles.title, value: roles.id }
        })

        let nullValue = { name: 'Return to main menu.', value: 100 };
        roles.push(nullValue);

        inquirer.prompt([
            {
                type: "list",
                name: "role_choices",
                message: "Select a position to remove.",
                choices: roles

            }]).then(answers => {
                if (answers.role_choices === 100 ) {
                    start();
                }
                else {
                    db.query("DELETE from roles WHERE roles.id = ?", answers.role_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
            
        
        })
    })
};


//////////////////////////////////////////////////////////////////////////////////


function removeEmployee () {
    db.query("SELECT * FROM employees", function (err, data) {
        if (err) throw err;

        let employees = data.map(employees => {
            
            return { name: `${employees.first_name} ${employees.last_name}`, value: employees.id }
        })

        let nullValue = { name: 'Return to main menu.', value: 100 };
        employees.push(nullValue);

        inquirer.prompt([
            {
                type: "list",
                name: "employee_choices",
                message: "Select a team member to remove from database.",
                choices: employees

            }]).then(answers => {
                if (answers.employee_choices === 100) {
                    start();
                }

                else {
                    db.query("DELETE from employees WHERE employees.id = ?", answers.employee_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
            
        
        })
    })
};