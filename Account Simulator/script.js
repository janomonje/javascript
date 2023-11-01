'use strict';

// Account simulator

// Data
const account1 = {
  owner: 'John Smith',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Displaying the movements of money
const displayingMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  // implementing sort button
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                     <div class="movements__value">${mov.toFixed(2)}€</div>
                    </div>                    
                </div>
                `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (account) {
  // calculating incomes
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  // calculating outcomes
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${outcomes.toFixed(2)}€`;

  // Calculating interest
  // It only adds interest when the insterest > 1
  const interests = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((interest, index, array) => {
      console.log(array);
      return interest >= 1;
    })
    .reduce((interest, acc) => acc + interest, 0);
  labelSumInterest.textContent = `${interests.toFixed(2)}€`;
};

// I have created a user using the initial of the owner property of every account!
const createUserName = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

const updateUI = function (account) {
  // Display MOvements
  displayingMovements(account.movements);
  // Display balance
  calcDisplayBalance(account);
  // Display summary
  calcDisplaySummary(account);
};

// Event handler
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  // prevents form from submitting
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);
  // optional chaining
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;

    // Updating UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === +currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    // Clearing fields
    inputCloseUsername.value = inputClosePin.value = '';

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 && // amount must be bigger than zero
    receiverAccount && // receiver account must exist
    currentAccount.balance >= amount && // sender's balance has to be bigger or equal to the transfered money
    receiverAccount?.username !== currentAccount.username // the sender cannot transfer money to himself
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Updating UI
    updateUI(currentAccount);
  }
});

// Loan request
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add the movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// sorting transaction by value
let sorted = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayingMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// I have calculated the amount of transaction per account
const countingTransactions = accs => {
  accs.forEach(function (acc) {
    acc.numberOfTransaction = acc.movements.length;
  });
};
countingTransactions(accounts);

////////////////////////////////////////////////
// 1. Calculating total deposit of money in the bank

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// 2. number of deposits bigger or equal to 1000

const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposit1000);

const sameWithReduce = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (counter, currValue) => (currValue >= 1000 ? counter + 1 : counter),
    0
  );
console.log(sameWithReduce);

// 3. Creating an object
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce((sum, mov) => {(mov > 0 ? sum.deposits += mov : sum.withdrawals += mov);
return sum;},
{deposits: 0, withdrawals: 0});

console.log(sums);

