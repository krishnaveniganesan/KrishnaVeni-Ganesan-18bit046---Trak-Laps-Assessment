// const request = require('request');
const config = require('./config');
const pgp = require('pg-promise')();
console.log(config.DATABASE_URL)
const db = pgp(config.DATABASE_URL);
var h = pgp.helpers;

db.connect()
    .then(obj => {
        obj.done();
        console.log('Database connected');
    })
    .catch(error => {
        console.log('Error On Database Connection', error.message || error);
    });

const getAllEmployees = () =>{
    return db.any('SELECT * FROM employees')
}

const getAllDepartments = () => {
    return db.any('SELECT * FROM departments')
}

const createEmp = (data) =>{
    return db.any('Insert into employees (emp_name, email, phone, address, date_of_birth)values($1,$2,$3,$4,$5)',[data.name,data.email, data.phone,data.address, data.dob])
}

const createDept = ( data) =>{
    return db.any('Insert into departments (dept_name) values($1)', [data.name]);
}

const getDeptRelatedEmp = (deptId) =>{
    return db.any('SELECT * FROM employees where employee_id in (select employee_id from employee_departments where department_id =$1)', [deptId]);

}
const getDeptUnRelatedEmp = (deptId) =>{
    return db.any('SELECT * FROM employees where employee_id not in (select employee_id from employee_departments where department_id =$1)', [deptId]);

}
const createemployeeDepartment = (deptId, orgData) =>{

    // const user_ids = [1,2,3,4,5]

    let promises = [];
    let empObj = {};
    orgData.forEach((emp) => {
    
        promises.push({ employee_id : emp, department_id : deptId})
    })

    return Promise.all(promises)
    .then((result) => {
        console.log('all resolved ', result)
        const cs = new pgp.helpers.ColumnSet(['employee_id', 'department_id'], {table: 'employee_departments'});
    var sqlConflict = " ON CONFLICT ON CONSTRAINT" +
    " employee_departments_pkey" +
    " DO UPDATE SET employee_id = excluded.employee_id, department_id =excluded.employee_id "; 
    
        console.log(sqlConflict)
        var query = h.insert(result, cs) + sqlConflict;
        return db.none(query)
    })
    
    }
module.exports = {
    getAllDepartments,
    getAllEmployees,
    createEmp,
    createDept,
    getDeptRelatedEmp,
    getDeptUnRelatedEmp,
    createemployeeDepartment
}