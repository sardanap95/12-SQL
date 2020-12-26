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
