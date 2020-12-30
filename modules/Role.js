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
module.exports.setRole = () => {};
