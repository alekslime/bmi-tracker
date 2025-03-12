// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const totalStudentsEl = document.getElementById('total-students');
    const averageBmiEl = document.getElementById('average-bmi');
    const underweightCountEl = document.getElementById('underweight-count');
    const normalCountEl = document.getElementById('normal-count');
    const overweightCountEl = document.getElementById('overweight-count');
    const obeseCountEl = document.getElementById('obese-count');

    // Get students from localStorage
    let students = [];
    try {
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
            students = JSON.parse(storedStudents);
        }
    } catch (e) {
        console.error("Error loading students:", e);
        students = [];
    }

    // Calculate statistics
    function calculateStatistics() {
        // Total students
        const totalStudents = students.length;
        totalStudentsEl.textContent = totalStudents;
        
        if (totalStudents === 0) {
            averageBmiEl.textContent = 'N/A';
            underweightCountEl.textContent = '0';
            normalCountEl.textContent = '0';
            overweightCountEl.textContent = '0';
            obeseCountEl.textContent = '0';
            return;
        }
        
        // Average BMI
        const totalBmi = students.reduce((sum, student) => sum + parseFloat(student.bmi), 0);
        const averageBmi = (totalBmi / totalStudents).toFixed(1);
        averageBmiEl.textContent = averageBmi;
        
        // Count by BMI category
        let underweightCount = 0;
        let normalCount = 0;
        let overweightCount = 0;
        let obeseCount = 0;
        
        students.forEach(student => {
            const bmi = parseFloat(student.bmi);
            
            if (bmi < 18.5) {
                underweightCount++;
            } else if (bmi >= 18.5 && bmi < 25) {
                normalCount++;
            } else if (bmi >= 25 && bmi < 30) {
                overweightCount++;
            } else {
                obeseCount++;
            }
        });
        
        underweightCountEl.textContent = underweightCount;
        normalCountEl.textContent = normalCount;
        overweightCountEl.textContent = overweightCount;
        obeseCountEl.textContent = obeseCount;
    }

    // Initialize statistics
    calculateStatistics();
});