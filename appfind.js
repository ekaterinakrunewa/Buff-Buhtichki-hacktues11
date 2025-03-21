const form = document.querySelector('.help__form');
const steps = document.querySelectorAll('.form__step');
const progressSteps = document.querySelectorAll('.step');
const nextButtons = document.querySelectorAll('.next__btn');
const prevButtons = document.querySelectorAll('.prev__btn');
const choiceCards = document.querySelectorAll('.choice__card');
const textarea = document.querySelector('#description');
const charCount = document.querySelector('.char__count');
const creditRange = document.querySelector('#credit_amount');
const rangeValue = document.querySelector('.range__value');

let currentStep = 0;

creditRange.addEventListener('input', () => {
    rangeValue.textContent = `${creditRange.value} credits`;
});

choiceCards.forEach(card => {
    card.addEventListener('click', () => {
        choiceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;
        nextButtons[currentStep].disabled = false;
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
    const remaining = textarea.maxLength - textarea.value.length;
    charCount.textContent = `${textarea.value.length}/600`;
});

function validateStep(step) {
    switch(step) {
        case 0:
            return document.querySelector('input[name="help_type"]:checked') !== null;
        case 1:
            return document.querySelector('#area_type').value !== '' && 
                   document.querySelector('#time_from').value !== '' && 
                   document.querySelector('#time_to').value !== '';
        case 2:
            return textarea.value.trim() !== '' && 
                   document.querySelector('input[name="urgency"]:checked') !== null;
        default:
            return true;
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
        alert('Form submitted successfully!');
    }
});

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});