
const BASE_URL = "https://open.er-api.com/v6/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate currency dropdowns
for (const select of dropdowns) {
    for (const currCode of Object.keys(countryList)) {

        const option = document.createElement("option");

        option.value = currCode;
        option.innerText = currCode;

        if (select.name === "from" && currCode === "USD") {
            option.selected = true;
        }

        if (select.name === "to" && currCode === "PKR") {
            option.selected = true;
        }

        select.append(option);
    }

    select.addEventListener("change", () => {
        updateFlag(select);
        updateExchangeRate();
    });
}

// Update flags
const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];

    const img = element.parentElement.querySelector("img");

    if (countryCode) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
};

// Exchange rate
const updateExchangeRate = async () => {

    const amount = Number(amountInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        msg.innerText = "Please enter a valid amount.";
        return;
    }

    const from = fromCurr.value;
    const to = toCurr.value;

    msg.innerText = "Fetching exchange rate...";

    try {

        const response = await fetch(`${BASE_URL}${from}`);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("Exchange rate service unavailable");
        }

        const rate = data.rates[to];

        if (!rate || !Number.isFinite(rate)) {
            throw new Error("Currency rate not found");
        }

        const finalAmount = amount * rate;

        msg.innerText =
            `${amount} ${from} = ${finalAmount.toFixed(2)} ${to}`;

    } catch (error) {

        console.error("Currency Error:", error);

        msg.innerText = error.message;

    }
};

// Button click
btn.addEventListener("click", (event) => {
    event.preventDefault();
    updateExchangeRate();
});

// Amount change
amountInput.addEventListener("input", updateExchangeRate);

// Swap currencies
const swapBtn = document.querySelector(".swap");

if (swapBtn) {
    swapBtn.addEventListener("click", (event) => {

        event.preventDefault();

        const temp = fromCurr.value;

        fromCurr.value = toCurr.value;
        toCurr.value = temp;

        updateFlag(fromCurr);
        updateFlag(toCurr);

        updateExchangeRate();
    });
}

// Initial setup
updateFlag(fromCurr);
updateFlag(toCurr);
updateExchangeRate();
