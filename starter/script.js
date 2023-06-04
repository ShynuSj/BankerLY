'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
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

const displayMovements = function(acc, sort = false){
  containerMovements.innerHTML= '';

  const movs = sort ?acc.movements.slice().sort((a,b) => a - b): acc.movements;
  // for(const [i,mov] of movements.entries()){
  movs.forEach(function(mov, i){
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2,'0');
    const month =`${date.getMonth()+1}`.padStart(2,'0');
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

  containerMovements.insertAdjacentHTML('afterbegin',html)
  });
};


const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov) =>acc +mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};



const calcDisplaySummary = function(acc){
  const income = acc.movements
  .filter(mov => mov >0)
  .reduce((acc,mov) => acc+mov,0);
  labelSumIn.textContent = `${income}€`;

  const outcome = acc.movements
  .filter(mov=> mov<0)
  .reduce((acc , mov)=> acc + mov,0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`

  const interest = acc.movements
  .filter(mov => mov>0)
  .map(deposits => (deposits*acc.interestRate)/100)
  .filter((int,i,arr) =>{
    return int >=1;
  })
  .reduce((acc,int) => acc+int,0);
  console.log(interest)
  labelSumInterest.textContent = `${interest.toFixed(2)}€`
}


const createUsernames = function(accs){
accs.forEach(function(acc){
  acc.username = acc.owner
  .toLowerCase().split(' ')
  .map(name => name[0])
  .join('');
});

};
createUsernames(accounts);

const updateUI = function(acc){

  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
}


let currentAccount;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.visibility = 'visible';

// day / month / year



btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount =  accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount)
  if (currentAccount?.pin === Number(inputLoginPin.value)){
      labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
      inputLoginPin.style.visibility = 'hidden';
      inputLoginUsername.style.visibility = 'hidden';
      btnLogin.style.visibility = 'hidden';
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
      containerApp.style.visibility = 'visible';
      const now = new Date();
      const day = `${now.getDate()}`.padStart(2,'0');
      const month =`${now.getMonth()+1}`.padStart(2,'0');
      const year = now.getFullYear();
      const hour = `${now.getHours()}`.padStart(2,'0');
      const minute = `${now.getMinutes()}`.padStart(2,'0');
      //const second = now.getSeconds();
      labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
      // labelWelcome.textContent = 'Log in to get started';

      updateUI(currentAccount)
  }
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";
  if (amount > 0 && receiverAcc
    && currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username){

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());




    updateUI(currentAccount);
  }
  
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount/10)){
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin){
    
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      accounts.splice(index, 1);
      inputLoginPin.style.visibility = 'visible';
      inputLoginUsername.style.visibility = 'visible';
      btnLogin.style.visibility = 'visible';
      inputLoginUsername.value = inputLoginPin.value = '';
      containerApp.style.visibility = 'hidden';
  }
})
let sorted = false;

btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
 
});
// MAXIMUM VALUE
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
   const max = movements.reduce((acc,mov)=>{
    if (acc > mov)
    return acc;
    else 
      return mov;
    
   },movements[0]);
   console.log(max);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);



// /////////////////////////////////////////////////

// const euroToUsd = 1.1;
// const movementsUsd= movements.map(function(mov){
//   return mov  * euroToUsd;
// });
// const movementsUsdArr= movements.map(mov=> mov  * euroToUsd);
//  console.log(movementsUsdArr);
// // console.log(movements)
// console.log(movementsUsd)

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov*euroToUsd);
// console.log(movementsUSDfor)

// const movementDescription = movements.map((mov,i, arr)=> `movement ${i+1}: You ${mov > 0?'deposited' : 'withdrawed'} ${Math.abs(mov)}`);
// console.log(movementDescription)

// const withdrw = movements.filter(function(mov){
// return (Math.abs(mov < 0));

// });
// console.log(withdrw)
// const balance = movements.reduce((acc,curr)=>acc + curr,0);

// console.log(balance);

// const calcAverageHumanAge = function(ages){
//   const humanAges = ages.map(age => age <= 2 ? age*2 : 16 + age *4);
//   const adults = humanAges.filter(age => age >= 18)
//   console.log(adults);

//   const avg = adults.reduce((acc,curr)=> acc+curr,0)/adults.length;
//    return avg
//   }
// const avg1 = calcAverageHumanAge([5,2,4,1,15,8,3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1 , avg2)

