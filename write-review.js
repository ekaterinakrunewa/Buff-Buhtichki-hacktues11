const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const reviewForm = document.getElementById('review-form');
const stars = document.querySelectorAll('.star__rating i');
const ratingInput = document.getElementById('rating');
const reviewTextarea = document.getElementById('review');
const charCount = document.querySelector('.char__count');
const successMessage = document.getElementById('success-message');

const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

menu.addEventListener('click', mobileMenu);

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const rating = star.getAttribute('data-rating');
        updateStars(rating, 'hover');
    });

    star.addEventListener('mouseout', () => {
        const currentRating = ratingInput.value || 0;
        updateStars(currentRating, 'hover');
    });

    star.addEventListener('click', () => {
        const rating = star.getAttribute('data-rating');
        ratingInput.value = rating;
        updateStars(rating, 'selected');
    });
});

const updateStars = (rating, action) => {
    stars.forEach(star => {
        const starRating = star.getAttribute('data-rating');
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
};

reviewTextarea.addEventListener('input', () => {
    const length = reviewTextarea.value.length;
    charCount.textContent = `${length}/500`;
    
    if (length > 500) {
        reviewTextarea.value = reviewTextarea.value.substring(0, 500);
        charCount.textContent = '500/500';
    }
});

reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!ratingInput.value) {
        alert('Please select a rating');
        return;
    }

    const formData = {
        name: document.getElementById('name').value,
        rating: parseInt(ratingInput.value),
        type: document.getElementById('type').value,
        review: reviewTextarea.value,
        date: new Date().toISOString()
    };

    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(formData);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    reviewForm.style.display = 'none';
    successMessage.style.display = 'block';
});

document.addEventListener('DOMContentLoaded', () => {
    reviewForm.reset();
    ratingInput.value = '';
    updateStars(0, 'selected');
    charCount.textContent = '0/500';
});