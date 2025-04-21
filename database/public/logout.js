function setupLogout() {
    const logoutButtons = document.querySelectorAll('.logout-button');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    // Clear local storage
                    localStorage.removeItem('user');
                    
                    // Redirect to login page
                    window.location.href = '/login.html';
                } else {
                    console.error('Logout failed');
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('A network error occurred. Please try again.');
            }
        });
    });
}

// Initialize logout functionality when DOM is ready
document.addEventListener('DOMContentLoaded', setupLogout);