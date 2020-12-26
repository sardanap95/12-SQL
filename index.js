const inquirer = require("inquirer");
const connection = require("./modules/Connection");
const cTable = require("console.table");
const { getEmployees, getEmployeesbyManager } = require("./modules/Employee.js");
const { getDepartments } = require("./modules/Department");
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

console.log("Welcome to the Employee Tracker.");

inquirer
  .prompt({
    type: "list",
    name: "mainTask",
    message: "What would you like to do today?",
    choices: ["View Data", "Add Data", "Update Data", "Delete Data"],
  })
  .then(({ mainTask }) => {
    switch (mainTask) {
      case "View Data":
        inquirer
          .prompt({
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
          })
          .then(({ viewTask }) => {
            switch (viewTask) {
              case "Department Details":
                console.table(departments);
                break;
              case "Role Details":
                console.table(roles);
                break;
              case "Employee Details":
                console.table(employees.sort((a, b) => (a.ID > b.ID ? 1 : -1))); //Showing All employees and sorting them
                break;
              case "Employees (By Managers)":
                inquirer
                  .prompt({
                    type: "list",
                    name: "manager_name",
                    message: "Please choose the manager",
                    choices: () => managers.map((m) => m.Name), //To only extract manager names
                  })
                  .then(({ manager_name }) => {
                    const { ID } = managers.find((m) => m.Name === manager_name); //To get id of the selected manager.
                    getEmployeesbyManager((manager_id = ID)).then((res) => console.table(res));
                  });

                break;
              case "Budget of each department":
                inquirer
                  .prompt({
                    type: "list",
                    name: "dep_name",
                    message: "Please choose the department",
                    choices: () => departments.map((d) => d.name),
                  })
                  .then(({ dep_name }) => {
                    const { ID } = departments.find((d) => d.name === dep_name);
                  });

                break;
            }
          });
        break;
      case "Add Data":
        inquirer
          .prompt({
            type: "list",
            name: "addTask",
            message: "What would you like to add today?",
            choices: ["Department", "Employee", "Role"],
          })
          .then(({ addTask }) => {
            switch (addTask) {
            }
          });

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
  });
