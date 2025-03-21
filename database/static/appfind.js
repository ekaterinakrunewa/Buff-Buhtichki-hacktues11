const form = document.querySelector('.help__form');
const steps = document.querySelectorAll('.form__step');
const progressSteps = document.querySelectorAll('.step');
const nextButtons = document.querySelectorAll('.next__btn');
const prevButtons = document.querySelectorAll('.prev__btn');
const choiceCards = document.querySelectorAll('.choice__card');
const textarea = document.querySelector('#description');
const charCount = document.querySelector('.char__count');
const creditRange = document.querySelector('#credit_amount');
const creditBudget = document.querySelector('#credit_budget');
const offerRangeValue = document.querySelector('.offer__options .range__value');
const needRangeValue = document.querySelector('.need__options .range__value');
const offerOptions = document.querySelector('.offer__options');
const needOptions = document.querySelector('.need__options');

let currentStep = 0;

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

creditRange.addEventListener('input', () => {
    offerRangeValue.textContent = `${creditRange.value} credits/hour`;
});

creditBudget.addEventListener('input', () => {
    needRangeValue.textContent = `${creditBudget.value} credits/hour`;
});

choiceCards.forEach(card => {
    card.addEventListener('click', () => {
        choiceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;
        nextButtons[currentStep].disabled = false;

        if (radio.value === 'offer') {
            offerOptions.style.display = 'block';
            needOptions.style.display = 'none';
        } else {
            offerOptions.style.display = 'none';
            needOptions.style.display = 'block';
        }
    });
});

nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            steps[currentStep].classList.remove('active');
            progressSteps[currentStep].classList.remove('active');
            currentStep++;
            steps[currentStep].classList.add('active');
            progressSteps[currentStep].classList.add('active');
        }
    });
});

prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        progressSteps[currentStep].classList.remove('active');
        currentStep--;
        steps[currentStep].classList.add('active');
        progressSteps[currentStep].classList.add('active');
    });
});

textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length}/600`;
});

function validateStep(step) {
    const helpType = document.querySelector('input[name="help_type"]:checked')?.value;
    
    switch(step) {
        case 0:
            return helpType !== undefined;
        case 1:
            if (helpType === 'offer') {
                return document.querySelector('#area_type').value !== '' && 
                       document.querySelector('#date_start').value !== '' &&
                       document.querySelector('#date_end').value !== '' &&
                       document.querySelector('#time_from').value !== '' && 
                       document.querySelector('#time_to').value !== '';
            } else {
                return document.querySelector('#help_type').value !== '' && 
                       document.querySelector('#need_date_start').value !== '' &&
                       document.querySelector('#need_date_end').value !== '' &&
                       document.querySelector('#need_time_from').value !== '' && 
                       document.querySelector('#need_time_to').value !== '';
            }
        case 2:
            return textarea.value.trim() !== '';
        default:
            return true;
    }
}

function validateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
}

function saveFormData() {
    const helpType = document.querySelector('input[name="help_type"]:checked').value;
    
    const entry = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        help_type: helpType
    };

    if (helpType === 'offer') {
        entry.credit_amount = document.querySelector('#credit_amount').value;
        entry.date_start = document.querySelector('#date_start').value;
        entry.date_end = document.querySelector('#date_end').value;
        entry.time_from = document.querySelector('#time_from').value;
        entry.time_to = document.querySelector('#time_to').value;
        entry.area_type = document.querySelector('#area_type').value;
    } else {
        entry.credit_budget = document.querySelector('#credit_budget').value;
        entry.need_date_start = document.querySelector('#need_date_start').value;
        entry.need_date_end = document.querySelector('#need_date_end').value;
        entry.need_time_from = document.querySelector('#need_time_from').value;
        entry.need_time_to = document.querySelector('#need_time_to').value;
        entry.help_type = document.querySelector('#help_type').value;
    }

    entry.description = document.querySelector('#description').value;

    let existingData = [];
    try {
        existingData = JSON.parse(localStorage.getItem('helpRequests')) || [];
    } catch (e) {
        existingData = [];
    }

    if (!Array.isArray(existingData)) {
        existingData = [];
    }

    existingData.push(entry);
    localStorage.setItem('helpRequests', JSON.stringify(existingData));
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
        const helpType = document.querySelector('input[name="help_type"]:checked').value;
        const startDate = helpType === 'offer' ? 
            document.querySelector('#date_start').value : 
            document.querySelector('#need_date_start').value;
        const endDate = helpType === 'offer' ? 
            document.querySelector('#date_end').value : 
            document.querySelector('#need_date_end').value;

        if (!validateDates(startDate, endDate)) {
            alert('End date must be after start date');
            return;
        }

        saveFormData();
        alert('Form submitted successfully!');
        window.location.href = 'offers.html';
    }
});

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

const today = new Date().toISOString().split('T')[0];
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
    input.min = today;
});