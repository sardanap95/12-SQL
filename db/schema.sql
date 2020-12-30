DROP DATABASE IF EXISTS emp_tracker;

CREATE DATABASE emp_tracker;

USE emp_tracker;

CREATE TABLE Employees(
    emp_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(30),
    last_name varchar(30),
    role_id int NOT NULL,
    manager_id int ,
    PRIMARY KEY (emp_id)    
);

CREATE TABLE Roles(
    role_id int NOT NULL AUTO_INCREMENT,
    title varchar(30),
    salary DECIMAL,
    department_id int NOT NULL,    
    PRIMARY KEY(role_id)    
);

CREATE TABLE Departments(
    department_id int NOT NULL AUTO_INCREMENT,
    name varchar(30),
    PRIMARY KEY(department_id)
);

INSERT INTO Employees VALUES(100, "Pushpi", "Sardana", 201, null);
INSERT INTO Employees VALUES(101, "Joe", "Rogan", 200, 100);
INSERT INTO Employees VALUES(102, "Vishal", "Jain", 200, 100);
INSERT INTO Employees VALUES(103, "Rahul", "Mehta", 203, null );
INSERT INTO Employees VALUES(104, "Rohit", "Jain", 202, 103);
INSERT INTO Employees VALUES(105, "Zarin", "Khan", 202, 103);



INSERT INTO Roles VALUES(200, "Marketer",1000, 100);
INSERT INTO Roles VALUES(201, "Marketing Manager",10000, 100);
INSERT INTO Roles VALUES(202, "Sales Rep",2000, 101);
INSERT INTO Roles VALUES(203, "Sales Manager",20000, 101);


INSERT INTO Departments VALUES(100, "Marketing");
INSERT INTO Departments VALUES(101, "Sales");


