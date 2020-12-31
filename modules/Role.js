const { connection } = require("./Connection");
module.exports.getRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "select role_id, title as Title, salary as Salary, d.name as Department \
        from Roles r \
        left outer join Departments d on r.department_id = d.department_id",
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
  });
};
module.exports.addRole = (roleInfo) => {
  return new Promise((resolve, reject) => {
    const { role_title, role_salary, department_Id } = roleInfo;
    connection.query(
      `INSERT INTO Roles(title,salary,department_id) 
        VALUES("${role_title}",${role_salary},${department_Id});`,
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
  });
};

module.exports.deleteRole = (role_id) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM Roles WHERE role_id=${role_id}`, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};
