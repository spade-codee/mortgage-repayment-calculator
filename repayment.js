const form = document.querySelector('.calculator-form')
const mortgageAmount = document.getElementById('mortgage-amount')
const mortgageTerm = document.getElementById('mortgage-term')
const intrestRate = document.getElementById('intrest-rate')
const clearAllButton = document.getElementById('clear-all')
const resultsSection = document.getElementById('results-section')
const monthlyPaymentElement = document.getElementById('monthly-payment')
const totaLPaymentElement = document.getElementById('.total-payment .amount')

// this is for the form validation
// i am gonna be declaring a function 
function validateForm() {
    let isValid = true;
    const errors = []
}

// this is to clear any existing error message 
document.querySelectorAll('.error-message').forEach(error=> error.remove())

// validating the mortgage amount
if (!mortgageAmount.vali || mortgageAmount.value <= 0) {
    isValid = false;
    addErrorMessage(mortgageAmount, 'Please enter a valid/correct mortgage term');
    errors.push('Mortgage amount is required')
}

// validating intrest rate
if (!mortgageTerm.value || mortgageTerm.value <= 0) {
    isValid = false;
    addErrorMessage(mortgageTerm, 'Please enter a valid term');
    errors.push('Mortgage term is required');
}

// Validate interest rate
if (!interestRate.value || interestRate.value <= 0) {
    isValid = false;
    addErrorMessage(interestRate, 'Please enter a valid interest rate');
    errors.push('Interest rate is required');
}

// Announce errors to screen readers if any
if (errors.length > 0) {
    announceToScreenReader(`Form has ${errors.length} errors: ${errors.join(', ')}`);
}

return isValid;


// Step 3: Error message handling
function addErrorMessage(inputElement, message) {
const errorDiv = document.createElement('div');
errorDiv.className = 'error-message';
errorDiv.textContent = message;
errorDiv.setAttribute('role', 'alert');
inputElement.parentElement.appendChild(errorDiv);

// Add error styling to input
inputElement.parentElement.classList.add('error');
}

// Step 4: Calculate mortgage payments
function calculateMortgage(amount, years, rate) {
// Convert interest rate to monthly decimal
const monthlyRate = (rate / 100) / 12;

// Convert years to months
const numberOfPayments = years * 12;

// Calculate monthly payment using mortgage formula
const monthlyPayment = amount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

// Calculate total payment
const totalPayment = monthlyPayment * numberOfPayments;

return {
    monthly: monthlyPayment,
    total: totalPayment
};
}

// Step 5: Format currency
function formatCurrency(amount) {
return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
}).format(amount);
}

// Step 6: Update results display
function updateResults(monthlyPayment, totalPayment) {
monthlyPaymentElement.textContent = formatCurrency(monthlyPayment);
totalPaymentElement.textContent = formatCurrency(totalPayment);

// Announce results to screen readers
announceToScreenReader(
    `Your monthly repayment would be ${formatCurrency(monthlyPayment)} ` +
    `and total repayment would be ${formatCurrency(totalPayment)}`
);
}

// Step 7: Screen reader announcements
function announceToScreenReader(message) {
const announcer = document.createElement('div');
announcer.setAttribute('role', 'status');
announcer.setAttribute('aria-live', 'polite');
announcer.className = 'sr-only';
announcer.textContent = message;
document.body.appendChild(announcer);

// Remove after announcement
setTimeout(() => {
    announcer.remove();
}, 1000);
}

// Step 8: Form submission handler
form.addEventListener('submit', (e) => {
e.preventDefault();

if (validateForm()) {
    const amount = parseFloat(mortgageAmount.value);
    const years = parseFloat(mortgageTerm.value);
    const rate = parseFloat(interestRate.value);
    
    const results = calculateMortgage(amount, years, rate);
    updateResults(results.monthly, results.total);
    
    // Show results section
    resultsSection.classList.remove('hidden');
}
});

// Step 9: Clear form handler
clearAllButton.addEventListener('click', () => {
// Reset form
form.reset();

// Clear any error messages
document.querySelectorAll('.error-message').forEach(error => error.remove());
document.querySelectorAll('.error').forEach(element => {
    element.classList.remove('error');
});

// Hide results
resultsSection.classList.add('hidden');

// Focus on first input
mortgageAmount.focus();

// Announce to screen readers
announceToScreenReader('Form has been cleared');
});

// Step 10: Input validation and formatting
function setupInputValidation(input, min = 0) {
input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
        value = value.replace(/\.$/, '');
    }
    
    // Update input value
    e.target.value = value;
    
    // Remove error styling if value is valid
    if (parseFloat(value) > min) {
        e.target.parentElement.classList.remove('error');
        e.target.parentElement.querySelector('.error-message')?.remove();
    }
});
}

// Initialize input validation
setupInputValidation(mortgageAmount);
setupInputValidation(mortgageTerm);
setupInputValidation(interestRate);