const inquirer = require("inquirer");
const connection = require("./modules/Connection");
const cTable = require("console.table");
const { getEmployees, getEmployeesbyManager, addEmployee } = require("./modules/Employee.js");
const { getDepartments, getDepartmentBudget } = require("./modules/Department");
const { getRoles } = require("./modules/Role");

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
getInitData();

console.log("\nWelcome to the Employee Tracker.\n");

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
          let name = departments.find((d) => d.name === dep_name)["name"];
          getDepartmentBudget(name).then(({ totalBudget }) =>
            console.log(
              "\n--- Total budget of " + name + " department is " + totalBudget + ". ---\n"
            )
          );
          break;
      }
      setTimeout(askRestart, 2000);

      break;

    case "Add Data":
      let { addTask } = await inquirer.prompt({
        type: "list",
        name: "addTask",
        message: "What would you like to add today?",
        choices: ["Department", "Employee", "Role"],
      });

      switch (addTask) {
        case "Employee":
          const { first_name } = await inquirer.prompt({
            type: "input",
            name: "first_name",
            message: "Please enter first name of the employee.",
          });

          const { last_name } = await inquirer.prompt({
            type: "input",
            name: "last_name",
            message: "Please enter last name of the employee.",
          });

          const { r_title } = await inquirer.prompt({
            type: "list",
            name: "r_title",
            message: "Please choose role of the employee.",
            choices: () => roles.map((r) => r.Title),
          });

          const { m_name } = await inquirer.prompt({
            type: "list",
            name: "m_name",
            message: "Please choose manager for the employee.",
            choices: () => ["None"].concat(managers.map((r) => r.Name)), //Extra option to not select any manager.
          });

          const employeeInfo = {
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

        case "Department":
          break;
        case "Role":
          break;
      }
      setTimeout(askRestart, 2000);
      break;
    case "Update Data":
      inquirer.prompt({
        type: "list",
        name: "addTask",
        message: "What would you like to update today?",
        choices: ["Employee's Manager", "Employee's role"],
      });
      break;
    case "Delete Data":
      inquirer.prompt({
        type: "list",
        name: "addTask",
        message: "What would you like to delete today?",
        choices: ["Department", "Employee", "Role"],
      });
      break;
  }
}
