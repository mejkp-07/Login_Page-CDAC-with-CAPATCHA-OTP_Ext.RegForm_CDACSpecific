const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const axios = require('axios')

const app = express();
const port = process.env.PORT || 5000;

const pool = new pg.Pool({
    connectionString: 'postgresql://pms:Pms123@devEgovPMS.dcservices.in:5432/PMS_12072023',
});

app.use(cors());
app.use(bodyParser.json());

const SITE_SECRET = '6Ld9tWAoAAAAAJ14Ojt1n-zBddtIxrBw-Xq8-5Tb'

app.post("/verify", async (request, response) => {
    const { captchaValue } = request.body;
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SITE_SECRET}&response=${captchaValue}`
    );
    //console.log(data)
    response.send(data);
  });

// Register a new user
app.post('/register', async (req, res) => {
    const {employeeType, employeeName, employeeID, email, mobile, dateOfBirth, dateOfJoining, designation, groupName, category, gender, deputedAt, password } = req.body;
    //console.log(designation)
    const hashedPassword = await bcrypt.hash(password, 10);
    let numDeputedAt = 0
    if (deputedAt === "At Client") {
        numDeputedAt = 2
    }else{
        numDeputedAt = 1
    }  
    //const deputedAtAsInteger = parseInt(deputedAt, 10); 
    const result = await pool.query('SELECT num_emp_type_id FROM pms.pms_employee_type_master WHERE str_emp_type_name = $1 AND num_isvalid = 1',[employeeType]);
    const result1 = await pool.query('SELECT num_designation_id FROM pms.pms_designation_master WHERE designation_name = $1',[designation]);
    const result2 = await pool.query('SELECT group_id FROM pms.pms_group_master WHERE str_group_name = $1',[groupName]);
    //console.log(result)
    const EmployeeTypeId = result.rows[0].num_emp_type_id;
    //console.log(result2)
    const DesignationId = result1.rows[0].num_designation_id;
    const GroupId = result2.rows[0].group_id;
    //console.log(EmployeeTypeId)
    pool.query(
        'INSERT INTO pms.pms_employee_master (num_emp_type_id, emp_id, str_emp_name, dt_emp_dob, str_mobile_number, str_office_email, dt_joining, num_designation_id, group_id_fk, password, str_emp_gender, str_emp_category, num_deputed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [EmployeeTypeId, employeeID, employeeName, dateOfBirth, mobile, email, dateOfJoining, DesignationId, GroupId, hashedPassword, gender, category, numDeputedAt],
        (error, results) => {
            if (error) {
                if(error.code = 23505){
                    res.status(400).json({ error: 'Entry already exists' });
                }else{
                    res.status(400).json({ error: 'User registration failed.' });
                }
                //console.error(error.code);
                
            } else {
                res.status(201).json({ message: 'User registered successfully.' });
            }
        }
    );
});

// Login and generate a JWT token
app.post('/login', async (req, res) => {
    const { employeeID, password } = req.body;

    pool.query('SELECT * FROM pms.pms_employee_master WHERE emp_id = $1', [employeeID], async (error, results) => {
        if (error || results.rows.length === 0) {
            res.status(401).json({ error: 'Authentication failed.' });
        } else {
            const user = results.rows[0];
            const userName = user.str_emp_name
            const empID = user.emp_id
            const emailID = user.str_office_email
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ userId: user.id }, 'your_secret_key_here', { expiresIn: '1h' });
                res.status(200).json({ token, userName, empID, emailID});
            } else {
                res.status(401).json({ error: 'Authentication failed.' });
            }
        }
    });
});

app.get('/getUniqueEmployeeTypes', async (req, res) => {
    try {
        // Use the pool connection to query the database for unique employee types
        pool.query('SELECT DISTINCT str_emp_type_name FROM pms.pms_employee_type_master', (error, results) => {
            if (error) {
                console.error('Error fetching unique employee types:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                const uniqueEmployeeTypes = results.rows.map((row) => row.str_emp_type_name);
                res.json(uniqueEmployeeTypes);
            }
        });
    } catch (error) {
        console.error('Error fetching unique employee types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getUniqueDesignation', async (req, res) => {
    try {
        // Use the pool connection to query the database for unique employee types
        pool.query('SELECT DISTINCT designation_name FROM pms.pms_designation_master', (error, results) => {
            if (error) {
                console.error('Error fetching unique designation:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                const uniqueDesignation = results.rows.map((row) => row.designation_name);
                res.json(uniqueDesignation);
            }
        });
    } catch (error) {
        console.error('Error fetching unique employee types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getUniqueGroup', async (req, res) => {
    try {
        // Use the pool connection to query the database for unique employee types
        pool.query('SELECT DISTINCT str_group_name FROM pms.pms_group_master', (error, results) => {
            if (error) {
                console.error('Error fetching unique group:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                const uniqueGroup = results.rows.map((row) => row.str_group_name);
                res.json(uniqueGroup);
            }
        });
    } catch (error) {
        console.error('Error fetching unique employee types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
