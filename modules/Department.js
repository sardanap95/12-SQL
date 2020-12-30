const { connection } = require("./Connection");
module.exports.getDepartments = () => {
  return new Promise((resolve, reject) => {
    connection.query("select * from Departments", (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

module.exports.getDepartmentBudget = (name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select sum(salary) as totalBudget from  Employees, Roles, Departments 
        where Employees.role_id = Roles.role_id
        AND Roles.department_id = Departments.department_id
        AND name="${name}";`,
      (err, res) => {
        err ? reject(err) : resolve(res[0]);
      }
    );
  });
};

module.exports.setDepartment = () => {};
