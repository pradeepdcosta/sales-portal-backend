// Authentication functions
function logout() {
    console.log('Logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/start';
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth script loaded');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
        window.location.href = '/start';
        return;
    }

    // Update user name display
    const user = JSON.parse(userData);
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName} (${user.role})`;
    }

    // Set up logout event listener
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        console.log('Found logout button');
        logoutButton.addEventListener('click', logout);
    } else {
        console.log('No logout button found');
    }
}); 