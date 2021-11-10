let nav = 0;

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];

function changeSite() {
    location.href = "../views/AddTransaction.html";
};

function openModal(date){
    console.log('open modal');
    changeSite();
}

function load(){
    const date = new Date();
    console.log(date);

    if (nav !== 0){
        date.setMonth(new Date().getMonth() + nav);
    }

    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerHTML = `${date.toLocaleDateString('en-us', {month: 'long'} )} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++){
        const daySquare = document. createElement('div');   
        daySquare.classList.add('day');

        daySquare.addEventListener('click', () => openModal(`${month+1}/${day - paddingDays}/${year}`));
        if (i > paddingDays){
            daySquare.innerHTML = i - paddingDays;
        }
        else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);
    }
}

function closeModal(){

    load();
}

function saveModal(){

    closeModal();
}

function initiateButtons(){
    console.log('initiate buttons');
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });
    // document.getElementById('saveButton').addEventListener('click', saveModal);
    // document.getElementById('cancelButton').addEventListener('click', closeModal);
}

initiateButtons()
load();