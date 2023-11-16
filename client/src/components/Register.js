import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css';
import axios from 'axios';
//import Dashboard from './components/Dashboard';

function Register() {
    const [employeeName, setEmployeeName] = useState('');
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [idErrorMessage, setIdErrorMessage] = useState('');
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [employeeType, setEmployeeType] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [mobileErrorMessage, setMobileErrorMessage] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [dateOfJoining, setDateOfJoining] = useState(null);
    const [designations, setDesignations] = useState([]);
    const [designation, setDesignation] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupNames, setGroupNames] = useState([]);
    const [category, setCategory] = useState('');
    const [gender, setGender] = useState('');
    const [deputedAt, setDeputedAt] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('Weak');
    const [message, setMessage] = useState('');
    //const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Fetch unique employee types when the component is mounted
        axios.get('/getUniqueEmployeeTypes') // Replace with your API route
          .then(response => {
            console.log(response.data)
            setEmployeeTypes(response.data); // Assuming the API response is an array of unique employee types
          })
          .catch(error => {
            console.error('Error fetching unique employee types:', error);
          });
    }, []);

    useEffect(() => {
        // Fetch unique employee types when the component is mounted
        axios.get('/getUniqueDesignation') // Replace with your API route
          .then(response => {
            console.log(response.data)
            setDesignations(response.data); // Assuming the API response is an array of unique employee types
          })
          .catch(error => {
            console.error('Error fetching unique designation:', error);
          });
    }, []);
    
    useEffect(() => {
        // Fetch unique employee types when the component is mounted
        axios.get('/getUniqueGroup') // Replace with your API route
          .then(response => {
            console.log(response.data)
            setGroupNames(response.data); // Assuming the API response is an array of unique employee types
          })
          .catch(error => {
            console.error('Error fetching unique group names:', error);
          });
    }, []);
    
    

    const handleRegister = () => {
        if (!employeeID || !email || !password || !employeeType || !designation || !employeeName || !mobile) {
            setMessage('Please fill out all mandatory fields.');
            return;
        }
        if (passwordStrength === 'Strong'){
            axios
            .post('/register', {employeeType, employeeName, email, mobile, employeeID, dateOfBirth, dateOfJoining, designation, groupName, category, gender, deputedAt, password })
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                setMessage(error.response.data.error);
            });
        }else{
            setMessage('Password does not meet the strength requirements.');
        }
        
    };

    const handlePasswordChange = (newPassword) => {
        // Password strength regex pattern
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (newPassword.match(passwordPattern)) {
            setPasswordStrength('Strong');
        } else if (newPassword.length >= 8) {
            setPasswordStrength('Moderate');
        } else {
            setPasswordStrength('Weak');
        }

        setPassword(newPassword);
    };

    const handleEmployeeNameChange = (e) => {
        const inputName = e.target.value;

        if (/[^a-zA-Z]/.test(inputName)) {
            setNameErrorMessage('You can only insert alphabets');
        } else {
            setNameErrorMessage('');
        }

        setEmployeeName(inputName);
    };

    const handleEmployeeIDChange = (e) => {
        const inputID = e.target.value;

        if (!/^[0-9]+$/.test(inputID)) {
            setIdErrorMessage('Employee ID should only contain integers');
        } else {
            setIdErrorMessage('');
        }

        setEmployeeID(inputID);
    };

    const handleMobileChange = (e) => {
        const inputMobile = e.target.value;

        if (!/^[0-9]{10}$/.test(inputMobile)) {
            setMobileErrorMessage('Mobile Number should be a 10-digit integer');
        } else {
            setMobileErrorMessage('');
        }

        setMobile(inputMobile);
    };

    const handleDateChange = (date) => {
        setDateOfBirth(date);
      };
    
    const handleDateJChange = (date) => {
       setDateOfJoining(date);
      };
      
    return (
        <div className="App" >
        <div className='container'>
            <h1>Register</h1>
            <div>
                    {/* Dropdown (select) element */}
                    <label>
                        Employee Type<span className="mandatory-field">*</span>:
                    </label>
                    <select
                        value={employeeType}
                        onChange={(e) => setEmployeeType(e.target.value)}
                    >
                        <option value="">Select Employee Type</option>
                        {employeeTypes.map((type) => (
                        <option key={type} value={type}> {type} </option>
                        ))}
                    </select>
            </div>
            <div>
                <label>Employee Name<span className="mandatory-field">*</span>:</label>
                <input
                    type="text"
                    placeholder="Employee Name"
                    value={employeeName}
                    onInput={handleEmployeeNameChange}
                />
                <span className="error-message">{nameErrorMessage}</span>
            </div>
            <div>
                <label>Employee ID<span className="mandatory-field">*</span>:</label>
                <input
                    type="text"
                    placeholder="Employee ID"
                    value={employeeID}
                    onInput={handleEmployeeIDChange}
                />
                <span className="error-message">{idErrorMessage}</span>
            </div>
            <div>
                <label>
                    Office Email<span className="mandatory-field">*</span>:
                </label>
                <input
                        type="text"
                        placeholder="Office Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
            </div>
            <div>
                <label>
                    Mobile Number<span className="mandatory-field">*</span>:
                </label>
                <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onInput={handleMobileChange}
                />
                <span className="error-message">{mobileErrorMessage}</span>
            </div>
            <div className="date-of-birth">
                
                <input
                    type="text"
                    placeholder="Date of Birth"
                    value={dateOfBirth ? dateOfBirth.toDateString() : ''}
                    onClick={() => setDateOfBirth(null)} // Clear the date when clicked
                />
                <DatePicker
                    selected={dateOfBirth}
                    onChange={handleDateChange}
                />
            </div>
            <div className="date-of-birth">
                
                <input
                    type="text"
                    placeholder="Date of Joining"
                    value={dateOfJoining ? dateOfJoining.toDateString() : ''}
                    onClick={() => setDateOfJoining(null)} // Clear the date when clicked
                />
                <DatePicker
                    selected={dateOfJoining}
                    onChange={handleDateJChange}
                />
            </div>
            <div>
                    {/* Dropdown (select) element */}
                    <label>
                        Designation:<span className="mandatory-field">*</span>:
                    </label>
                    <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    >
                        <option value="">Select Designation</option>
                        {designations.map((type) => (
                        <option key={type} value={type}> {type} </option>
                        ))}
                    </select>
            </div>
            <div>
                    {/* Dropdown (select) element */}
                    <label>
                        Group Name:
                    </label>
                    <select
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    >
                        <option value="">Select Group</option>
                        {groupNames.map((type) => (
                        <option key={type} value={type}> {type} </option>
                        ))}
                    </select>
            </div>
            <div>
                    {/* Dropdown (select) element */}
                    <label>
                        Category:
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        <option value="General">General</option>
                        <option value="EWS">EWS</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                    </select>
            </div>
            <div className="radio-section gender">
            <label>Gender:</label>
            <div className="radio-options">
                <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={() => setGender("Male")}
                />
                <label>Male</label>
                <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={() => setGender("Female")}
                />
                <label>Female</label>
            </div>
            </div>

            <div className="radio-section">
            <label>Deputed At:</label>
            <div className="radio-options">
                <input
                type="radio"
                name="deputedAt"
                value="1"
                checked={deputedAt === "CDAC"}
                onChange={() => setDeputedAt("CDAC")}
                />
                <label>CDAC</label>
                <input
                type="radio"
                name="deputedAt"
                value="2"
                checked={deputedAt === "At Client"}
                onChange={() => setDeputedAt("At Client")}
                />
                <label>At Client</label>
            </div>
            </div>
            <div>
                    <label>
                            Password<span className="mandatory-field">*</span>:
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                </div>
                <div>Password Strength: {passwordStrength}</div>
            <div>
                <button onClick={handleRegister}>Register</button>
            </div>
            <div>{message}</div>
            </div>
        </div>
    );
}

export default Register;
