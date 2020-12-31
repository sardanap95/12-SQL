const inquirer = require("inquirer");
const connection = require("./modules/Connection");
const cTable = require("console.table");
const {
  getEmployees,
  getEmployeesbyManager,
  addEmployee,
  deleteEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
} = require("./modules/Employee.js");
const {
  getDepartments,
  getDepartmentBudget,
  addDepartment,
  deleteDepartment,
} = require("./modules/Department");
const { getRoles, addRole, deleteRole } = require("./modules/Role");

let roles;
let departments;
let managers;
let employees;

function getInitData() {
  getEmployees().then((res) => (employees = res));
  getDepartments().then((res) => (departments = res));
  getRoles().then((res) => (roles = res));
  getEmployeesbyManager().then((res) => (managers = res));
}

console.log("\n--- Welcome to the Employee Tracker. ---\n");

start();

async function askRestart() {
  const { doRestart } = await inquirer.prompt({
    type: "confirm",
    name: "doRestart",
    message: "Do you want to go back to main menu?",
  });

  doRestart ? start() : process.exit();
}

async function start() {
  getInitData();
  //Prompt to ask the Main Operations like View, Delete, Update and Add
  const { mainTask } = await inquirer.prompt({
    type: "list",
    name: "mainTask",
    message: "What would you like to do today?",
    choices: ["View Data", "Add Data", "Update Data", "Delete Data"],
  });

  //Switch statement for main operations
  switch (mainTask) {
    case "View Data":
      // If View task is selected, then Prompt what to view.
      const { viewTask } = await inquirer.prompt({
        type: "list",
        name: "viewTask",
        message: "What would you like to view today?",
        choices: [
          "Department Details",
          "Role Details",
          "Employee Details",
          "Employees (By Managers)",
          "Budget of each department",
        ],
      });
      //Switch statement if View Task is selected
      switch (viewTask) {
        case "Department Details":
          console.table(departments);

          break;
        case "Role Details":
          console.table(roles);

          break;
        case "Employee Details":
          console.table(employees.sort((a, b) => (a.emp_id > b.emp_id ? 1 : -1))); //Showing All employees and sorting them

          break;
        case "Employees (By Managers)":
          let { manager_name } = await inquirer.prompt({
            type: "list",
            name: "manager_name",
            message: "Please choose the manager",
            choices: () => managers.map((m) => m.Name), //To only extract manager names
          });
          let manager_id = managers.find((m) => m.Name === manager_name)["emp_id"]; //To get id of the selected manager.
          console.log("\n--- " + manager_name + " manages following employees --- \n");
          getEmployeesbyManager(manager_id).then((res) => console.table(res));
          break;
        case "Budget of each department":
          let { dep_name } = await inquirer.prompt({
            type: "list",
            name: "dep_name",
            message: "Please choose the department",
            choices: () => departments.map((d) => d.name),
          });
          getDepartmentBudget(dep_name).then(({ totalBudget, totalEmployees }) =>
            console.log(
              `\n--- Total budget of ${dep_name} department is ${totalBudget} with ${totalEmployees} employees. ---\n`
            )
          );
          break;
      }
      setTimeout(askRestart, 2000);

      break;

    case "Add Data": {
      let { addTask } = await inquirer.prompt({
        type: "list",
        name: "addTask",
        message: "What would you like to add today?",
        choices: ["Department", "Employee", "Role"],
      });

      //Switch statement for add operations
      switch (addTask) {
        case "Employee": {
          let { first_name } = await inquirer.prompt({
            type: "input",
            name: "first_name",
            message: "Please enter first name of the employee.",
          });

          let { last_name } = await inquirer.prompt({
            type: "input",
            name: "last_name",
            message: "Please enter last name of the employee.",
          });

          let { r_title } = await inquirer.prompt({
            type: "list",
            name: "r_title",
            message: "Please choose role of the employee.",
            choices: () => roles.map((r) => r.Title),
          });

          let { m_name } = await inquirer.prompt({
            type: "list",
            name: "m_name",
            message: "Please choose manager for the employee.",
            choices: () => ["None"].concat(managers.map((r) => r.Name)), //Extra option to not select any manager.
          });

          let employeeInfo = {
            first_name,
            last_name,
            role_id: roles.filter((r) => r.Title === r_title)[0]["role_id"],
            //If No manager is selected manager ID will be null
            manager_id:
              m_name == "None" ? null : managers.filter((m) => m.Name === m_name)[0]["emp_id"],
          };

          addEmployee(employeeInfo).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- New employee added successfully. ---\n")
              : console.log("\n--- Failed to add a new employee. ---\n")
          );
          break;
        }

        case "Department": {
          let { dep_name } = await inquirer.prompt({
            type: "input",
            name: "dep_name",
            message: "Please enter the name of department.",
          });

          addDepartment(dep_name).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- New department added successfully. ---\n")
              : console.log("\n--- Failed to add a new department. ---\n")
          );

          break;
        }
        case "Role": {
          let { role_title } = await inquirer.prompt({
            type: "input",
            name: "role_title",
            message: "Please enter name of the role.",
          });
          let { role_salary } = await inquirer.prompt({
            type: "input",
            name: "role_salary",
            message: "Please enter salary amount for this role.",
            validate: (s) => (!isNaN(s) ? true : "Enter a valid amount."),
          });
          let { dep_name } = await inquirer.prompt({
            type: "list",
            name: "dep_name",
            message: "Please choose the department for this role.",
            choices: () => departments.map((d) => d.name),
          });

          const roleInfo = {
            role_title,
            role_salary: parseInt(role_salary),
            department_Id: departments.filter((d) => d.name === dep_name)[0]["department_id"],
          };

          addRole(roleInfo).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- New role added successfully. ---\n")
              : console.log("\n--- Failed to add a new role. ---\n")
          );

          break;
        }
      }
      setTimeout(askRestart, 2000);
      break;
    }

    case "Update Data": {
      const { updateTask } = await inquirer.prompt({
        type: "list",
        name: "updateTask",
        message: "What would you like to update today?",
        choices: ["Employee's manager", "Employee's role"],
      });

      let { emp_name } = await inquirer.prompt({
        type: "list",
        name: "emp_name",
        message: "Please choose the employee.",
        choices: employees.map((e) => e.Name),
      });

      //Switch statement for add operations
      switch (updateTask) {
        case "Employee's manager": {
          let { m_name } = await inquirer.prompt({
            type: "list",
            name: "m_name",
            message: "Please choose the new manager.",
            choices: ["None"].concat(managers.map((r) => r.Name)),
          });
          let empInfo = {
            emp_id: employees.filter((e) => e.Name === emp_name)[0]["emp_id"],
            manager_id:
              m_name == "None" ? null : managers.filter((m) => m.Name === m_name)[0]["emp_id"],
          };

          updateEmployeeManager(empInfo).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- Manager changed successfully. ---\n")
              : console.log("\n--- Failed to change manager. ---\n")
          );
          break;
        }
        case "Employee's role": {
          let { r_title } = await inquirer.prompt({
            type: "list",
            name: "r_title",
            message: "Please choose the new role.",
            choices: () => roles.map((r) => r.Title),
          });
          let empInfo = {
            emp_id: employees.filter((e) => e.Name === emp_name)[0]["emp_id"],
            role_id: roles.filter((m) => m.Title === r_title)[0]["role_id"],
          };
          updateEmployeeRole(empInfo).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- Role updated successfully. ---\n")
              : console.log("\n--- Failed to update the role. ---\n")
          );
          break;
        }
      }

      setTimeout(askRestart, 2000);
      break;
    }
    case "Delete Data": {
      const { deleteTask } = await inquirer.prompt({
        type: "list",
        name: "deleteTask",
        message: "What would you like to delete today?",
        choices: ["Department", "Employee", "Role"],
      });

      //Switch statement for delete operations.
      switch (deleteTask) {
        case "Employee": {
          console.log(employees.length);
          let { emp_name } = await inquirer.prompt({
            type: "list",
            name: "emp_name",
            message: "Please choose the employee to be deleted.",
            choices: employees.map((e) => e.Name),
          });

          let emp_id = employees.filter((e) => e.Name === emp_name)[0]["emp_id"];

          deleteEmployee(emp_id).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- Employee deleted successfully. ---\n")
              : console.log("\n--- Failed to delete the employee. ---\n")
          );

          break;
        }
        case "Role": {
          let { role_title } = await inquirer.prompt({
            type: "list",
            name: "role_title",
            message: "Please choose the role to be deleted.",
            choices: roles.map((r) => r.Title),
          });

          let role_id = roles.filter((e) => e.Title === role_title)[0]["role_id"];

          deleteRole(role_id).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- Role deleted successfully. ---\n")
              : console.log("\n--- Failed to delete the role. ---\n")
          );

          break;
        }
        case "Department": {
          let { dep_name } = await inquirer.prompt({
            type: "list",
            name: "dep_name",
            message: "Please choose the department to be deleted.",
            choices: departments.map((d) => d.name),
          });

          let department_id = departments.filter((d) => d.name === dep_name)[0]["department_id"];

          deleteDepartment(department_id).then(({ affectedRows }) =>
            affectedRows
              ? console.log("\n--- Department deleted successfully. ---\n")
              : console.log("\n--- Failed to delete the Department. ---\n")
          );

          break;
        }
      }

      setTimeout(askRestart, 2000);
      break;
    }
  }
}
