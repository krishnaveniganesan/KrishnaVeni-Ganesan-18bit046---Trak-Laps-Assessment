require('dotenv').config()

// const mongoose = require('mongoose');
const express = require('express')
const path = require('path');
const app = express();
var ejs = require('ejs');
const bodyParser = require('body-parser');
const db  = require('./db')

// const { Db } = require('mongodb');
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended :false}))

app.get('/employees/all', (req, res) => {
    console.log('hey')
    db.getAllEmployees()
    .then((result) => {
        console.log(result)
        let data = {userData:result};
        res.render('employee',data);
    }).catch((err) =>{
        res.send(err)
    })
})

app.get('/departments/all', (req, res) => {
    db.getAllDepartments()
    .then((result) => {
        console.log(result)
        let data = {userData:result};
        res.render('department',data);
    }).catch((err) =>{
        res.send(err)
    })
})
app.get('/home', (req, res) => {
        res.render('home');
})
app.get('/employee/create', (req, res) => {
    res.render('create_employee');
})
app.post('/employee/create', (req, res) => {
    console.log(req.body)
    db.createEmp(req.body)
    .then((empRes) =>{
        console.log(empRes)
        res.redirect('/employees/all');
    }).catch((err) =>{
        res.send(err)
    })
})
app.get('/department/create', (req, res) => {
    res.render('create_department');
})
app.post('/department/create', (req, res) => {
    console.log(req.body)
    db.createDept(req.body)
    .then((empRes) =>{
        console.log(empRes)
        res.redirect('/departments/all');
    }).catch((err) =>{
        res.send(err)
    })
})
app.get('/department/:departmentId', (req, res) => {
    console.log(req.params.departmentId)
    db.getDeptRelatedEmp(req.params.departmentId)
    .then((result) => {
        console.log(result)
        let data = {userData:result, deptId:req.params.departmentId };
        res.render('department_detail',data);
    }).catch((err) =>{
        res.send(err)
    })
    
})

app.get('/department/:departmentId/add/employee', (req, res) => {
    console.log(req.params, req.query)
    db.getDeptUnRelatedEmp(req.params.departmentId)
    .then((result) =>{
        let data = {newEmpData:result};
        res.render('department_select_employee', data);
    }).catch((err) =>{
        res.send(err)
    })
})
app.post('/department/:departmentId/add/employee', (req, res) => {
    db.createemployeeDepartment( req.params.departmentId, req.body.checkboxName)
    .then(() =>{
        res.redirect(`/departments/${req.params.departmentId}`);
    }).catch((err) =>{
        res.send(err)
    })
})
 

app.listen(3000, (err, res) =>{
    if(!err){
        console.log('App listen 3000');
    }
})