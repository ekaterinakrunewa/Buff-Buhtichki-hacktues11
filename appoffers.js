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
    const storedOffers = localStorage.getItem('helpRequests');
    allOffers = storedOffers ? JSON.parse(storedOffers) : [];
    updateAreaFilter();
    applyFilters();
}

function createOfferCard(offer) {
    const card = offerTemplate.content.cloneNode(true);
    
    const typeIcon = card.querySelector('.offer__type i');
    const typeText = card.querySelector('.offer__type span');
    const area = card.querySelector('.offer__area');
    
    if (offer.help_type === 'offer') {
        typeIcon.classList.add('fa-hand-holding-heart');
        typeText.textContent = 'Offering Help';
        area.textContent = offer.area_type;
    } else {
        typeIcon.classList.add('fa-hands-helping');
        typeText.textContent = 'Requesting Help';
        area.textContent = offer.help_type;
    }
    
    const dateRange = card.querySelector('.date__range span');
    const timeRange = card.querySelector('.time__range span');
    const credits = card.querySelector('.offer__credits span');
    const description = card.querySelector('.offer__description');
    
    if (offer.help_type === 'offer') {
        dateRange.textContent = `${offer.date_start} - ${offer.date_end}`;
        timeRange.textContent = `${offer.time_from} - ${offer.time_to}`;
        credits.textContent = `${offer.credit_amount} credits/hour`;
    } else {
        dateRange.textContent = `${offer.need_date_start} - ${offer.need_date_end}`;
        timeRange.textContent = `${offer.need_time_from} - ${offer.need_time_to}`;
        credits.textContent = `${offer.credit_budget} credits/hour`;
    }
    
    description.textContent = offer.description;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    
    const contactBtn = document.createElement('a');
    contactBtn.href = `messages.html?area=${encodeURIComponent(offer.help_type === 'offer' ? offer.area_type : offer.help_type)}&type=${encodeURIComponent(offer.help_type)}&credits=${encodeURIComponent(offer.help_type === 'offer' ? offer.credit_amount : offer.credit_budget)}`;
    contactBtn.className = 'contact__btn';
    contactBtn.textContent = 'Contact';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete__btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteOffer(offer.id);
    
    buttonContainer.appendChild(contactBtn);
    buttonContainer.appendChild(deleteBtn);
    card.querySelector('.offer__card').appendChild(buttonContainer);
    
    return card;
}

function deleteOffer(id) {
    if (confirm('Are you sure you want to delete this offer?')) {
        allOffers = allOffers.filter(offer => offer.id !== id);
        localStorage.setItem('helpRequests', JSON.stringify(allOffers));
        loadOffers();
    }
}

function applyFilters() {
    const selectedType = typeFilter.value;
    const selectedArea = areaFilter.value;
    const maxCredit = parseInt(creditFilter.value);

    const filtered = allOffers.filter(offer => {
        const isOffer = offer.help_type === 'offer';
        
        if (selectedType === 'offer' && !isOffer) return false;
        if (selectedType === 'receive' && isOffer) return false;
        
        if (selectedArea !== 'all') {
            if (isOffer) {
                if (offer.area_type !== selectedArea) return false;
            } else {
                if (offer.help_type !== selectedArea) return false;
            }
        }
        
        const creditValue = isOffer ? parseInt(offer.credit_amount) : parseInt(offer.credit_budget);
        if (creditValue > maxCredit) return false;
        
        return true;
    });

    displayOffers(filtered);
}

function displayOffers(offers) {
    offersGrid.innerHTML = '';
    
    if (offers.length === 0) {
        noResults.style.display = 'flex';
        offersGrid.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        offersGrid.style.display = 'grid';
        offers.forEach(offer => offersGrid.appendChild(createOfferCard(offer)));
    }
}

function updateAreaFilter() {
    const areas = new Set();
    
    allOffers.forEach(offer => {
        if (offer.help_type === 'offer') {
            if (offer.area_type) areas.add(offer.area_type);
        } else {
            if (offer.help_type) areas.add(offer.help_type);
        }
    });
    
    areaFilter.innerHTML = '<option value="all">All Areas</option>';
    Array.from(areas).sort().forEach(area => {
        areaFilter.innerHTML += `<option value="${area}">${area}</option>`;
    });
}

function clearAllOffers() {
    if (confirm('Are you sure you want to clear all offers?')) {
        localStorage.removeItem('helpRequests');
        allOffers = [];
        applyFilters();
        updateAreaFilter();
    }
}

creditFilter.addEventListener('input', () => {
    creditValue.textContent = creditFilter.value;
    applyFilters();
});

typeFilter.addEventListener('change', applyFilters);
areaFilter.addEventListener('change', applyFilters);

clearFiltersBtn.addEventListener('click', () => {
    typeFilter.value = 'all';
    areaFilter.value = 'all';
    creditFilter.value = 500;
    creditValue.textContent = '500';
    applyFilters();
});

window.addEventListener('DOMContentLoaded', () => {
    loadOffers();
    
    const clearAllBtn = document.createElement('button');
    clearAllBtn.className = 'clear__all__btn';
    clearAllBtn.textContent = 'Clear All Offers';
    clearAllBtn.onclick = clearAllOffers;
    clearFiltersBtn.parentNode.appendChild(clearAllBtn);
});

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

const contactBtn = document.createElement('a');
const areaName = offer.help_type === 'offer' ? offer.area_type : offer.help_type;
contactBtn.href = `messages.html?area=${encodeURIComponent(areaName)}&type=${encodeURIComponent(offer.help_type)}&credits=${encodeURIComponent(offer.help_type === 'offer' ? offer.credit_amount : offer.credit_budget)}`;
contactBtn.className = 'contact__btn';
contactBtn.textContent = 'Contact';
card.querySelector('.offer__card').appendChild(contactBtn);