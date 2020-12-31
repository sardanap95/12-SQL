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
      `select sum(salary) as totalBudget, count(emp_id) as totalEmployees
        FROM  Employees, Roles, Departments 
        WHERE Employees.role_id = Roles.role_id
        AND Roles.department_id = Departments.department_id
        AND name="${name}";`,
      (err, res) => {
        err ? reject(err) : resolve(res[0]);
      }
    );
  });
};

module.exports.addDepartment = (departmentName) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO Departments(name) values("${departmentName}");`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

module.exports.deleteDepartment = (department_id) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM Departments WHERE department_id=${department_id}`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};
