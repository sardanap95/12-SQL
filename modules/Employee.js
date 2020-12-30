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
        CONCAT_WS(' ', m.first_name, m.last_name) AS Manager \
        from Employees e \
        INNER JOIN Employees m ON m.emp_id = e.manager_id OR (m.manager_id is NULL and e.manager_id is NULL) \
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
