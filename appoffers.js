const offersGrid = document.querySelector('#offersGrid');
const offerTemplate = document.querySelector('#offerTemplate');
const noResults = document.querySelector('#noResults');
const typeFilter = document.querySelector('#typeFilter');
const areaFilter = document.querySelector('#areaFilter');
const creditFilter = document.querySelector('#creditFilter');
const creditValue = document.querySelector('#creditValue');
const clearFiltersBtn = document.querySelector('#clearFilters');

let allOffers = [];

function loadOffers() {
    const storedOffers = JSON.parse(localStorage.getItem('helpRequests') || '[]');
    allOffers = storedOffers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    applyFilters();
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatTime(timeStr) {
    return timeStr.slice(0, 5);
}

function createOfferCard(offer) {
    const card = offerTemplate.content.cloneNode(true);
    const typeIcon = card.querySelector('.offer__type i');
    const typeText = card.querySelector('.offer__type span');
    
    if (offer.help_type === 'offer') {
        typeIcon.classList.add('fa-hand-holding-heart');
        typeText.textContent = 'Offering Help';
    } else {
        typeIcon.classList.add('fa-hands-helping');
        typeText.textContent = 'Requesting Help';
    }

    const area = card.querySelector('.offer__area');
    area.textContent = offer.area_type || offer.help_type;

    const dateRange = card.querySelector('.date__range span');
    const startDate = offer.help_type === 'offer' ? offer.date_start : offer.need_date_start;
    const endDate = offer.help_type === 'offer' ? offer.date_end : offer.need_date_end;
    dateRange.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;

    const timeRange = card.querySelector('.time__range span');
    const startTime = offer.help_type === 'offer' ? offer.time_from : offer.need_time_from;
    const endTime = offer.help_type === 'offer' ? offer.time_to : offer.need_time_to;
    timeRange.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    const credits = card.querySelector('.offer__credits span');
    const creditAmount = offer.help_type === 'offer' ? offer.credit_amount : offer.credit_budget;
    credits.textContent = `${creditAmount} credits/hour`;

    const description = card.querySelector('.offer__description');
    description.textContent = offer.description;

    const contactBtn = card.querySelector('.contact__btn');
    contactBtn.addEventListener('click', () => handleContact(offer));

    return card;
}

function handleContact(offer) {
    alert(`Contact functionality will be implemented here for offer ID: ${offer.id}`);
}

function applyFilters() {
    const typeValue = typeFilter.value;
    const areaValue = areaFilter.value;
    const maxCredits = parseInt(creditFilter.value);

    const filteredOffers = allOffers.filter(offer => {
        const matchesType = typeValue === 'all' || offer.help_type === typeValue;
        const matchesArea = areaValue === 'all' || 
                          (offer.area_type === areaValue || offer.help_type === areaValue);
        const credits = parseInt(offer.help_type === 'offer' ? 
                               offer.credit_amount : 
                               offer.credit_budget);
        const matchesCredits = credits <= maxCredits;

        return matchesType && matchesArea && matchesCredits;
    });

    displayOffers(filteredOffers);
}

function displayOffers(offers) {
    offersGrid.innerHTML = '';
    
    if (offers.length === 0) {
        noResults.style.display = 'flex';
        offersGrid.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        offersGrid.style.display = 'grid';
        offers.forEach(offer => {
            offersGrid.appendChild(createOfferCard(offer));
        });
    }
}

function resetFilters() {
    typeFilter.value = 'all';
    areaFilter.value = 'all';
    creditFilter.value = 500;
    creditValue.textContent = '500';
    applyFilters();
}

function populateAreaFilter() {
    const areas = new Set(allOffers.map(offer => offer.area_type || offer.help_type));
    const fragment = document.createDocumentFragment();
    
    fragment.appendChild(new Option('All Areas', 'all'));
    areas.forEach(area => {
        if (area) {
            fragment.appendChild(new Option(area, area));
        }
    });
    
    areaFilter.innerHTML = '';
    areaFilter.appendChild(fragment);
}

typeFilter.addEventListener('change', applyFilters);
areaFilter.addEventListener('change', applyFilters);
creditFilter.addEventListener('input', () => {
    creditValue.textContent = creditFilter.value;
    applyFilters();
});
clearFiltersBtn.addEventListener('click', resetFilters);

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

window.addEventListener('DOMContentLoaded', () => {
    loadOffers();
    populateAreaFilter();
});

window.addEventListener('storage', (e) => {
    if (e.key === 'helpRequests') {
        loadOffers();
        populateAreaFilter();
    }
});