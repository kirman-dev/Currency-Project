document.addEventListener('DOMContentLoaded', async () => {
    const rightButtons = document.querySelectorAll('.right-buttons>button');
    const leftButtons = document.querySelectorAll('.left-buttons>button');
    const leftFooterWrapper = document.querySelector('.left-footer-wrapper');
    const rightFooterWrapper = document.querySelector('.right-footer-wrapper');
    const leftInput = document.querySelector('.left-input');
    const rightInput = document.querySelector('.right-input');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const hamburgerWrapper = document.querySelector('.hamburger-wrapper');
    const API_KEY = "283e071f09d0cb41e39b3a86";
    const errorWrapper = document.querySelector('.error-wrapper');
    let leftRate, rightRate;
    let activeInput = "left";


    function updateDependentInput() {
        if (activeInput === "left" && leftInput.value !== "") {
            const calculatedValue = (leftInput.value * leftRate).toFixed(5);
            if (!isNaN(calculatedValue)) {
                rightInput.value = calculatedValue;
            }
        } else if (activeInput === "right" && rightInput.value !== "") {
            const calculatedValue = (rightInput.value * rightRate).toFixed(5);
            if (!isNaN(calculatedValue)) {
                leftInput.value = calculatedValue;
            }
        }
    }


    leftButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            button.classList.add('active');
            leftButtons.forEach((btn) => {
                if (btn !== button) btn.classList.remove('active');
            });
            await updateFooters();
            updateDependentInput();
        });
    });


    rightButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            button.classList.add('active');
            rightButtons.forEach((btn) => {
                if (btn !== button) btn.classList.remove('active');
            });

            await updateFooters();
            updateDependentInput();
        });
    });


    leftInput.addEventListener('input', (e) => {
        activeInput = "left";
        if (e.target.value.includes(',')) {
            e.target.value = e.target.value.replace(',', '.');
        }
        const calculatedValue = (e.target.value * leftRate).toFixed(5);
        if (!isNaN(calculatedValue)) {
            rightInput.value = calculatedValue;
        } else {
            rightInput.value = "";
        }
    });


    rightInput.addEventListener('input', (e) => {
        activeInput = "right";
        if (e.target.value.includes(',')) {
            e.target.value = e.target.value.replace(',', '.');
        }
        console.log(e.target.value);
        const calculatedValue = (e.target.value * rightRate).toFixed(5);
        if (!isNaN(calculatedValue)) {
            leftInput.value = calculatedValue;
        } else {
            leftInput.value = "";
        }
    });

    async function updateFooters() {
        const leftActive = document.querySelector('.left-buttons > button.active');
        const rightActive = document.querySelector('.right-buttons > button.active');
        if (leftActive && rightActive) {
            const leftCurrency = leftActive.textContent.trim();
            const rightCurrency = rightActive.textContent.trim();

            if (leftCurrency !== rightCurrency) {
                const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${leftCurrency}/${rightCurrency}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.result === "success") {
                        leftRate = Number(data.conversion_rate);
                        rightRate = 1 / leftRate;
                        leftFooterWrapper.innerText = `1 ${leftCurrency} = ${leftRate.toFixed(5)} ${rightCurrency}`;
                        rightFooterWrapper.innerText = `1 ${rightCurrency} = ${rightRate.toFixed(5)} ${leftCurrency}`;
                    } else {
                        console.error('Conversion error:', data['error-type']);
                        leftFooterWrapper.innerText = 'Error fetching data';
                        rightFooterWrapper.innerText = '';
                    }
                } catch (err) {
                    console.error('Network error:', err);
                    leftFooterWrapper.innerText = 'Error fetching data';
                    rightFooterWrapper.innerText = '';
                }
            } else {
                leftRate = 1;
                rightRate = 1;
                leftFooterWrapper.innerText = `1 ${leftCurrency} = 1 ${rightCurrency}`;
                rightFooterWrapper.innerText = `1 ${rightCurrency} = 1 ${leftCurrency}`;
            }
        }
    }

    hamburgerButton.addEventListener('click', () => {
        hamburgerWrapper.classList.toggle('activee');
    });

    function updateNetworkStatus() {
        if (!navigator.onLine) {
            errorWrapper.style.display = 'block';
        } else {
            errorWrapper.style.display = 'none';
        }
    }

    updateNetworkStatus();
    await updateFooters();
});