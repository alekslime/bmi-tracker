// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const studentForm = document.getElementById('student-form');
    const studentList = document.getElementById('student-list');
    const noDataMessage = document.getElementById('no-data-message');
    const studentTable = document.getElementById('student-table');

    // Student data array
    let students = [];
    
    // Load students from localStorage
    function loadStudents() {
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
            try {
                students = JSON.parse(storedStudents);
            } catch (e) {
                console.error("Error parsing stored students:", e);
                students = [];
            }
        }
    }

    // Initialize the table
    function initTable() {
        loadStudents();
        if (students.length > 0) {
            noDataMessage.style.display = 'none';
            studentTable.style.display = 'table';
            renderStudentTable();
        } else {
            noDataMessage.style.display = 'block';
            studentTable.style.display = 'none';
        }
    }

    // Calculate BMI
    function calculateBMI(weight, height) {
        // Convert height from cm to m
        const heightInMeters = height / 100;
        // BMI formula: weight (kg) / (height (m))^2
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Get BMI status
    function getBMIStatus(bmi) {
        bmi = parseFloat(bmi);
        if (bmi < 18.5) return { status: 'Underweight', class: 'underweight' };
        if (bmi >= 18.5 && bmi < 25) return { status: 'Normal', class: 'normal' };
        if (bmi >= 25 && bmi < 30) return { status: 'Overweight', class: 'overweight' };
        return { status: 'Obese', class: 'obese' };
    }

    // Add new student
    function addStudent(name, weight, height) {
        const bmi = calculateBMI(weight, height);
        const bmiStatus = getBMIStatus(bmi);
        
        const student = {
            id: Date.now(),
            name,
            weight,
            height,
            bmi,
            status: bmiStatus.status
        };
        
        students.push(student);
        saveStudents();
        renderStudentTable();
        noDataMessage.style.display = 'none';
        studentTable.style.display = 'table';
        
        // Show success message
        showMessage('Student added successfully!', 'success');
    }

    // Save students to localStorage
    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Render student table
    function renderStudentTable() {
        studentList.innerHTML = '';
        
        students.forEach(student => {
            const bmiStatus = getBMIStatus(student.bmi);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.weight}</td>
                <td>${student.height}</td>
                <td>${student.bmi}</td>
                <td class="${bmiStatus.class}">${bmiStatus.status}</td>
                <td>
                    <button class="btn btn-danger delete-btn" data-id="${student.id}">
                        Delete
                    </button>
                </td>
            `;
            
            studentList.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteStudent(id);
            });
        });
    }

    // Delete student
    function deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            students = students.filter(student => student.id !== id);
            saveStudents();
            renderStudentTable();
            
            if (students.length === 0) {
                noDataMessage.style.display = 'block';
                studentTable.style.display = 'none';
            }
            
            // Show success message
            showMessage('Student deleted successfully!', 'success');
        }
    }

    // Show message
    function showMessage(message, type = 'info') {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.padding = '10px';
        messageDiv.style.margin = '10px 0';
        messageDiv.style.borderRadius = '4px';
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        } else {
            messageDiv.style.backgroundColor = '#cce5ff';
            messageDiv.style.color = '#004085';
            messageDiv.style.border = '1px solid #b8daff';
        }
        
        document.querySelector('.container').insertBefore(messageDiv, document.querySelector('main'));
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Event listeners
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const weightInput = document.getElementById('weight');
            const heightInput = document.getElementById('height');
            
            const name = nameInput.value.trim();
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value);
            
            if (name && !isNaN(weight) && !isNaN(height)) {
                addStudent(name, weight, height);
                studentForm.reset();
            } else {
                showMessage('Please fill all fields correctly', 'error');
            }
        });
    }

    // Initialize the table on page load
    initTable();
});