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

document.addEventListener('DOMContentLoaded', setupLogout);