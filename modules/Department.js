const { connection } = require("./Connection");
module.exports.getDepartments = () => {
  return new Promise((resolve, reject) => {
    connection.query("select * from Departments", (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};
module.exports.setDepartment = () => {};
