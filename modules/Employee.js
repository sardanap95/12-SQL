const { connection } = require("./Connection");

module.exports.getEmployeesbyManager = (manager_id = null) => {
  return new Promise((resolve, reject) => {
    //This query can either return the all managers or employees of a particular manager.
    connection.query(
      `SELECT e.emp_id AS emp_id, CONCAT_WS(' ', e.first_name, e.last_name) as Name, r.title AS Role\         
        FROM Employees e \       
        LEFT OUTER JOIN Roles r ON e.role_id = r.role_id\
        where e.manager_id ${manager_id ? "=" + manager_id : "is NULL"}`,
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
};

module.exports.getEmployees = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "select e.emp_id as emp_id, CONCAT_WS(' ', e.first_name, e.last_name) as Name,r.title as Role, \
        CASE \
          WHEN e.manager_id is NULL THEN 'No Manager' \
          ELSE CONCAT_WS(' ', m.first_name, m.last_name)  \
        END AS Manager \
        from Employees e \
        LEFT JOIN Employees m ON e.manager_id = m.emp_id  \
        LEFT OUTER JOIN Roles r ON e.role_id = r.role_id \
        ",
      (err, res) => {
        return err ? reject(err) : resolve(res);
      }
    );
  });
};

module.exports.addEmployee = (employeeInfo) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, role_id, manager_id } = employeeInfo;
    connection.query(
      `INSERT INTO Employees(first_name, last_name, role_id, manager_id)
       values( "${first_name}", "${last_name}", ${role_id},${manager_id});`,
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
};

module.exports.updateEmployeeRole = (empInfo) => {
  return new Promise((resolve, reject) => {
    const { role_id, emp_id } = empInfo;
    connection.query(
      `UPDATE Employees 
        SET role_id=${role_id}
        WHERE emp_id=${emp_id}
        `,
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
};

module.exports.updateEmployeeManager = (empInfo) => {
  return new Promise((resolve, reject) => {
    const { manager_id, emp_id } = empInfo;
    connection.query(
      `UPDATE Employees 
        SET manager_id=${manager_id}
        WHERE emp_id=${emp_id}
        `,
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
};

module.exports.deleteEmployee = (emp_id) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM Employees WHERE emp_id=${emp_id}`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};
