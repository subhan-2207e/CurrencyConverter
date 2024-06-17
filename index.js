import inquirer from 'inquirer';
import axios from 'axios';
// Function to fetch exchange rates
const fetchExchangeRates = async () => {
    // Replace with your actual API endpoint or method of getting exchange rates
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    return response.data.rates;
};
const main = async () => {
    const exchangeRates = await fetchExchangeRates();
    const currencies = Object.keys(exchangeRates);
    const userAnswer = await inquirer.prompt([
        {
            name: 'fromCurrency',
            type: 'list',
            message: 'Select the currency to convert from:',
            choices: currencies
        },
        {
            name: 'toCurrency',
            type: 'list',
            message: 'Select the currency to convert into:',
            choices: currencies
        },
        {
            name: 'amount',
            type: 'input',
            message: 'Enter the amount to convert:',
            validate: (value) => {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a valid number';
            },
            filter: Number
        }
    ]);
    const fromCurrencyRate = exchangeRates[userAnswer.fromCurrency];
    const toCurrencyRate = exchangeRates[userAnswer.toCurrency];
    const amount = userAnswer.amount;
    // Formula for currency conversion
    const baseAmount = amount / fromCurrencyRate;
    const convertedAmount = baseAmount * toCurrencyRate;
    console.log(`Converted amount = ${convertedAmount.toFixed(2)} ${userAnswer.toCurrency}`);
};
main().catch((error) => {
    console.error('Error fetching exchange rates:', error);
});
