(async function checkAuth() {
    try {
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            // If not authenticated, redirect to login
            window.location.href = '/login.html';
            return;
        }

        const userData = await response.json();
        
        // Optionally store user data in localStorage for easy access across pages
        localStorage.setItem('user', JSON.stringify(userData.user));
        
        // Optionally update UI elements with user info
        const userNameElements = document.querySelectorAll('.user-name');
        if (userNameElements.length && userData.user) {
            const fullName = `${userData.user.first_name} ${userData.user.last_name}`;
            userNameElements.forEach(el => el.textContent = fullName);
        }
        
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login.html';
    }
})();