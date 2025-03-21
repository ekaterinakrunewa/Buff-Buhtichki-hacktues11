const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const reviewsList = document.getElementById('reviews-list');
const noReviews = document.getElementById('no-reviews');
const filterType = document.getElementById('filter-type');
const filterRating = document.getElementById('filter-rating');

const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

menu.addEventListener('click', mobileMenu);

const createStarRating = (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
};

const createReviewCard = (review) => {
    const initials = review.name.split(' ').map(n => n[0]).join('');
    return `
        <div class="review__card">
            <div class="review__header">
                <div class="review__user">
                    <div class="user__avatar">${initials}</div>
                    <div class="user__info">
                        <h3>${review.name}</h3>
                        <span class="review__date">${review.date}</span>
                    </div>
                </div>
                <div class="review__stars">
                    ${createStarRating(review.rating)}
                </div>
            </div>
            <p class="review__content">${review.review}</p>
            <span class="review__type">${review.type}</span>
        </div>
    `;
};

const loadAndDisplayReviews = () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const selectedType = filterType.value;
    const selectedRating = filterRating.value;

    let filteredReviews = reviews;

    if (selectedType !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.type.toLowerCase() === selectedType.toLowerCase());
    }

    if (selectedRating !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(selectedRating));
    }

    if (filteredReviews.length === 0) {
        reviewsList.innerHTML = '';
        noReviews.style.display = 'block';
    } else {
        noReviews.style.display = 'none';
        reviewsList.innerHTML = filteredReviews
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(review => createReviewCard(review))
            .join('');
    }
};

filterType.addEventListener('change', loadAndDisplayReviews);
filterRating.addEventListener('change', loadAndDisplayReviews);

document.addEventListener('DOMContentLoaded', loadAndDisplayReviews);