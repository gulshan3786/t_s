import express from "express";
import db from "./db.mjs";
import bodyParser from "body-parser";




const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const ITEMS_PER_PAGE = 30; // Adjust the number of items per page as needed

router.get(`/result`, (req, res) => {
    var page = parseInt(req.query.page) || 1;
   

   
    const offset = (page - 1) * ITEMS_PER_PAGE;
  if(page==undefined||page==1){
    const dataQuery = `
    SELECT
    result_master.studentid,
    student_master.firstname,
    result_master.examid,
    SUM(result_master.theorymarks_obt) AS theorymarks_obt,
    SUM(result_master.practicalmarks_obt) AS practicalmarks_obt
FROM
    result_master 
JOIN
    student_master ON result_master.studentid = student_master.studentid
WHERE
    result_master.studentid BETWEEN 1 AND 200
GROUP BY
    result_master.studentid, student_master.firstname, result_master.examid
ORDER BY
    result_master.studentid, result_master.examid
`;

    
    const countQuery = `
         SELECT COUNT(*) AS totalCount
         FROM (${dataQuery}) AS data`;

         
        
         db.query(countQuery, (countError, countResults) => {
            if (countError) {
                console.error('Error executing count SQL query:', countError);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            const totalCount = countResults[0].totalCount;
    
            db.query(`${dataQuery} LIMIT ${offset}, ${ITEMS_PER_PAGE}`, (error, result) => {
                if (error) {
                    console.error('Error executing data SQL query:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                if (!result || result.length === 0) {
                    // Handle the case when no results are returned
                    console.log('No results found.');
                    res.status(404).send('Not Found');
                    return;
                }
    
                // Continue with further processing...
               
          
    
                // Calculate total number of pages
                const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
                res.render('index', {
                   
                    result: result,
                    page: 1,
                    totalPages: totalPages,
                   
                });
            });
        });
  }
  else{
    const dataQuery = `
    SELECT
    result_master.studentid,
    student_master.firstname,
    result_master.examid,
    SUM(result_master.theorymarks_obt) AS theorymarks_obt,
    SUM(result_master.practicalmarks_obt) AS practicalmarks_obt
FROM
    result_master 
JOIN
    student_master ON result_master.studentid = student_master.studentid
WHERE
    result_master.studentid BETWEEN 1 AND 200
GROUP BY
    result_master.studentid, student_master.firstname, result_master.examid
ORDER BY
    result_master.studentid, result_master.examid
`;

    
    const countQuery = `
         SELECT COUNT(*) AS totalCount
         FROM (${dataQuery}) AS data`;

         
        
         db.query(countQuery, (countError, countResults) => {
            if (countError) {
                console.error('Error executing count SQL query:', countError);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            const totalCount = countResults[0].totalCount;
    
            db.query(`${dataQuery} LIMIT ${offset}, ${ITEMS_PER_PAGE}`, (error, result) => {
                if (error) {
                    console.error('Error executing data SQL query:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                if (!result || result.length === 0) {
                    // Handle the case when no results are returned
                    console.log('No results found.');
                    res.status(404).send('Not Found');
                    return;
                }
    
                // Continue with further processing...
               
          
    
                // Calculate total number of pages
                const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
                res.render('index', {
                   
                    result: result,
                    page: page,
                    totalPages: totalPages,
                   
                });
            });
        });
  }


 // Query to fetch paginated data
   
});
router.get("/report",(req,res)=>{
 var key=req.query.key;
 var sql=`select student_master.studentid,student_master.firstname,student_master.lastname,exam_master.examid,subject_master.subjectname ,result_master.theorymarks_obt,
 result_master.practicalmarks_obt
 from result_master
 inner join student_master on student_master.studentid=result_master.studentid
 inner join exam_master on exam_master.examid=result_master.examid
 inner join  subject_master on subject_master.subjectid=result_master.subjectid
 where student_master.studentid=?
 order by  subject_master.subjectname,exam_master.examid;
 `

 db.query(sql,[key],(err,result)=>{
    if(err)throw err;
    console.log(result);
    res.render("report",{
        result:result,
        key:1
    });
});

});

router.post("/search",(req,res)=>{
    var search = req.body.search; 

    var sql=`SELECT
    result_master.studentid,
    student_master.firstname,
    result_master.examid,
    SUM(result_master.theorymarks_obt) AS theorymarks_obt,
    SUM(result_master.practicalmarks_obt) AS practicalmarks_obt
FROM
    result_master 
JOIN
    student_master ON result_master.studentid = student_master.studentid
WHERE
    result_master.studentid = ${search}
GROUP BY
    result_master.studentid, student_master.firstname, result_master.examid
ORDER BY
    result_master.studentid, result_master.examid;
`
    db.query(sql,(err,result)=>{
        if(err)throw err;
        res.render('search',{result:result})
    })
})

export default router;


