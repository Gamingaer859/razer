document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const TARGET_PRICE = 4990;
    const COOKIE_NAME = "razerViperSavings";
    const COOKIE_DAYS = 365; // Cookie will last for 1 year

    // --- DOM ELEMENTS ---
    const currentSavingsSpan = document.getElementById('current-savings');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const savingsForm = document.getElementById('savings-form');
    const amountInput = document.getElementById('amount-input');
    const resetButton = document.getElementById('reset-button');
    const targetPriceSpan = document.getElementById('target-price');
    
    // Set target price from config
    targetPriceSpan.textContent = TARGET_PRICE.toLocaleString('th-TH');

    // --- COOKIE FUNCTIONS ---
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // --- UI UPDATE FUNCTION ---
    function updateUI(savings) {
        // Format number with commas
        currentSavingsSpan.textContent = savings.toLocaleString('th-TH');

        // Calculate and update progress bar
        let percentage = (savings / TARGET_PRICE) * 100;
        if (percentage > 100) percentage = 100; // Cap at 100%
        
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${percentage.toFixed(2)}% Complete`;

        // Change progress text color if goal is met
        if (percentage >= 100) {
            progressText.style.color = 'var(--primary-color)';
            progressText.textContent = '🎉 Goal Reached! 🎉';
        } else {
            progressText.style.color = 'var(--text-color)';
        }
    }

    // --- EVENT HANDLERS ---
    savingsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const amountToAdd = parseFloat(amountInput.value);
        if (isNaN(amountToAdd) || amountToAdd <= 0) {
            return;
        }

        let currentSavings = parseFloat(getCookie(COOKIE_NAME) || '0');
        currentSavings += amountToAdd;

        setCookie(COOKIE_NAME, currentSavings.toString(), COOKIE_DAYS);
        updateUI(currentSavings);

        amountInput.select();
    });

    resetButton.addEventListener('click', () => {
        const isConfirmed = confirm("Are you sure you want to reset your savings? This action cannot be undone.");
        if (isConfirmed) {
            deleteCookie(COOKIE_NAME);
            updateUI(0);
        }
    });

    // --- INITIAL LOAD ---
    const savedAmount = parseFloat(getCookie(COOKIE_NAME) || '0');
    updateUI(savedAmount);
});