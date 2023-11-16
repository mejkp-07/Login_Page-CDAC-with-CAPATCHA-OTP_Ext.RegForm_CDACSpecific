// Dashboard.js
import React, { useEffect, useState } from 'react';

function Dashboard() {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeID, setEmployeeID] = useState();
    const [emailID, setEmailID] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('employeeName');
        setEmployeeName(name);
        const ID = localStorage.getItem('employeeID');
        setEmployeeID(ID);
        const email = localStorage.getItem('emailID');
        setEmailID(email);
    }, []);

    return (
        <div className="App">
            <div className="container">
                <h1>Welcome {employeeName}</h1>
                <h2>ID - {employeeID}</h2>
                <h2>Mail - {emailID}</h2>
            </div>
        </div>
    );
}

export default Dashboard;

