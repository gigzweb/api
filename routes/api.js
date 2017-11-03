var express = require('express');
var router = express.Router();
var url = require('url');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })




//create students
router.post('/addstudent', function(req,res,next){
try{
    var reqObj = req.body;  
    console.log(reqObj);
    req.getConnection(function(err, conn){
        if(err)
        {
            console.error('SQL Connection error: ', err);
            return next(err);
        }
        else
        {
            var insertSql = "INSERT INTO student SET ?";
            var insertValues = {
            "Student_Name" : reqObj.student_name,
            "sex":reqObj.sex,
            "date_of_brith": reqObj.dob,
            "address":reqObj.address,
            "nationality":reqObj.country,
            "state":reqObj.state,
            "lga":reqObj.lga,
            "title":reqObj.title,
            "Email":reqObj.email,
            "phone":reqObj.phone
            };
            var query = conn.query(insertSql, insertValues, function (err, result){
                if(err){
                console.error('SQL error: ', err);
                return next(err);
                }
                console.log(result);
                var Student_Id = result.insertId;
                res.json({"Student_id":Student_Id});
            });
        }
        });
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});
//UPDATE STUDENT RECORD USING ID 
router.put('/updatestudent/:stuId', function(req,res,next){
try{
    
    var Student_Id = req.params.stuId;
    console.log(Student_Id);
    var reqObj = req.body;  
    console.log(reqObj);
    req.getConnection(function(err, conn){
        if(err)
        {
            console.error('SQL Connection error: ', err);
            return next(err);
        }
        else
        {
            var updateSql = "UPDATE student SET Student_Name = ?, Email  = ? , phone =? , address =? WHERE Student_Id=?";
                    var Student_Name = reqObj.stuName;
                    var Email = reqObj.email;
                    var phone = reqObj.phone;
                    var address= reqObj.address;
                    
                    var data ={"error":1, "status":""}
            var query = conn.query(updateSql, [Student_Name, Email, phone, address, Student_Id ], function (err, result , fields){
                if(err){
                console.error('SQL error: ', err);
                return next(err);
                }
                else {
                data["error"] = 0;
                data["status"] = "Student  record successfully Updated";
                console.log(data);
                }
                console.log(query.sql);
                res.json(data);
            });
        }
        });
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});



//DELETE STUDENT USING ID 

router.delete('/delete/:stuId', function(req,res,next){
try{
    var Student_Id = req.params.stuId;
    console.log(Student_Id);
    req.getConnection(function(err, conn){
        if(err)
        {
            console.error('SQL Connection error: ', err);
            return next(err);
        }
        else
        {   //var Student_Id= reqObj.stuId;
            console.log(Student_Id);
            var deleteSql = "DELETE FROM student WHERE student.Student_Id = ?";
            var data ={"error":1, "status":""}
            var query = conn.query(deleteSql, [Student_Id ], function (err, result , fields){
                if(err){
                console.error('SQL error: ', err);
                return next(err);
                }
                else {
                data["error"] = 0;
                data["status"] = "Student successfully deleted";
                }
                console.log(query.sql);
                res.json(data);
            });
        }
        });
    }
    catch(ex){
    console.error("Internal error:"+ex);
    return next(ex);
    }
});






/* Get all students data */
router.get('/get_allstudents_details', function(req, res, next) {
    try {
        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('SELECT role . Role_Name , student.Student_Id, student.Student_Name,  department.Dept_Name, Date_Format(student.DoJ,"%d-%m-%Y") AS Admission_date FROM student LEFT JOIN role ON student.Role_Id = role.Role_Id LEFT JOIN department ON student.Dept_Id = department.Dept_Id   order by student.DoJ', function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    res.json(resEmp);
                });
            }
        });
    } 
     catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
         }
});


// Get all school department
router.get('/getdepartments', function(req, res, next) {
    try {
        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('SELECT  Dept_Id , Dept_Name, Faculty  FROM department', function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    res.json(resEmp);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


router.get('/getdeptinfo', function(req, res, next) {
    try {
        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('SELECT  Dept_Id , Dept_Name, Faculty, description  FROM department', function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    res.json(resEmp);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});



//sort students by department
router.get('/getstudents_ByDept', function(req, res, next) {
    try {
       
        var query = url.parse(req.url,true).query;
        console.log(query);
        var deptId = query.deptId;
        console.log(deptId);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select student_id ,  student_name, dept_name ,  student.sex    ,student.profile_pic ,Date_Format(student.DoJ,"%d-%m-%Y") AS Admission_date from student, department  where student.dept_Id = department.dept_Id and department.dept_Id = ? order by Admission_date', [deptId],function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    res.json(resEmp);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

// get full details of student by StuId
router.get('/getstudentdetails', function(req, res, next) {
    try {
       
        var query = url.parse(req.url,true).query;
        console.log(query);
        var stuId = query.stuId;
        console.log(stuId);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select student_id ,student.Dept_Id  ,student.sex ,student.profile_pic ,Date_Format(student.date_of_brith, "%d-%m-%Y") AS DOB ,student.nationality ,student.state ,student.Email,  student.phone, student.address,  student_name, dept_name , Date_Format(student.DoJ,"%d-%m-%Y") AS Admission_date , lga ,title from student, department  where student.dept_Id = department.dept_Id and student.student_id =? order by Admission_date', [stuId],function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    res.json(resEmp);
                });
            }
        });
    } 
    catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
              }
});

// search for student by Phone or Email
router.get('/searchstudentdetails', function(req, res, next) {
    try {
       
        var query = url.parse(req.url,true).query;
        console.log(query);
        var phone = query.phone;
        var email = query.email;
        console.log(phone);
        console.log(email);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('SELECT student.Student_Id, student.Student_Name, student.Dept_Id, Date_Format(student.DoJ,"%d-%m-%Y") AS Admission_date, student.sex, student.profile_pic, Date_Format(student.date_of_brith, "%d-%m-%Y") AS DOB, student.nationality, student.state, student.Email, student.phone, student.address, department.Faculty, department.Dept_Name FROM student LEFT JOIN department ON student.Dept_Id = department.Dept_Id WHERE student.phone= ? OR student.Email= ?', [phone, email ],function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    console.log(query.sql);
                    res.json(resEmp);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


//GET COUNT OF STUDENTS IN THE SCHOOL
router.get('/totalstudents', function(req, res, next) {
    try {
        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('SELECT COUNT (Student_Id) from student', function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    console.log(query.sql);
                    res.json(resEmp);
                });
            }
        });
    } 
     catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
         }
});


//TOTAL COUNT OF DEPT

router.get('/totaldept', function(req, res, next) {
    try {
        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('SELECT COUNT (Dept_Id) from department', function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    console.log(query.sql);
                    res.json(resEmp);
                });
            }
        });
    } 
     catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
         }
});



//COUNT OF STUDENTS BY DEPT 

router.get('/studentsperdept', function(req, res, next) {
    try {
       
        var query = url.parse(req.url,true).query;
        console.log(query);
        var Dept_Id = query.DeptId;
        console.log(Dept_Id);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('SELECT COUNT (Dept_Id) from student where student.Dept_Id = ?', [Dept_Id],function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                     console.log(query.sql);
                    res.json(resEmp);
                });
            }
        });
    } 
    catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
              }
});






module.exports = router;