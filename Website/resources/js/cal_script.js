let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");










let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
    // console.log('showCalendar');
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    //making transaction day current day
    document.getElementById("year_trans").value = year;
    document.getElementById("month_trans").value = month;
    number_of_days();
    document.getElementById("date_trans").value = today.getDate();


    // creating all cells
    let date = 1;
    let currDate = new Date(year, month, date);
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = document.createElement("td");
                cell.classList.add("no-gutters");


                let cont = document.createElement("div");
                cont.classList.add("container");
                let getTrans = get_transactions(currDate.toJSON());
                cont.appendChild(getTrans);


                cell.appendChild(cont);


                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                } // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);

                cell.appendChild(cont);


                date++;
                currDate.setDate(date);
                currDate.setMonth(month);
                currDate.setFullYear(year);

            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

    fetch('/cal/premium')
    .then(response => response.json())
    .then(data => {
        //console.log(data.rows[0][0].premium);
        if(data.rows[0][0].premium){
            document.getElementById("analysis").innerText="Here is the analysis of your spending habits. You can view the daily, weekly, or monthly patterns of how you spend your money etc.";
            removeAllChildNodes(document.getElementById("container"));
            drawChart();
        }
        else{
            document.getElementById("analysis").innerText="To see analysis of your spending here switch to a premium account."
        }
    })
    // removeAllChildNodes(document.getElementById("container"));
    // drawChart();
};


function get_transactions(curr) {
    //console.log('get_transactions');
    let tbl = document.createElement("table");

    fetch('/cal/transaction', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
  
      })
        .then(response => response.json())
        .then(data => {

            let transactions = data.rows[0];
        

            let thead = document.createElement("tr");
            let nh = document.createElement("th");
            let ph = document.createElement("th");
            let dh = document.createElement("th");
            let nameh = document.createTextNode("Name");
            let priceh = document.createTextNode("Price");
            let deleteh = document.createTextNode("Delete");
            nh.appendChild(nameh);
            ph.appendChild(priceh);
            dh.appendChild(deleteh);
            thead.appendChild(nh);
            thead.appendChild(ph);
            thead.appendChild(dh);
            tbl.appendChild(thead);

            for(let i=0; i<transactions.length; i++){
                if(curr.slice(0,10)==transactions[i].dot.slice(0,10)){
                    // console.log("hi");
                    let tr=document.createElement("tr");
                    tr.classList.add(transactions[i].category);
                    let rn = document.createElement("td");
                    let rp = document.createElement("td");

                    let rd = document.createElement("td");
                    rd.innerHTML = `<form action='/cal/delete/${transactions[i].id}' method="POST" name='T${transactions[i].id}' id='T${transactions[i].id}'>
                    <button class="btn btn-danger" type="submit">
                        -
                    </button>
                </form>`;


                    let rname = document.createTextNode(transactions[i].description);
                    let rprice = document.createTextNode(transactions[i].price);
                    rn.appendChild(rname);
                    rp.appendChild(rprice);
                    tr.appendChild(rn);
                    tr.appendChild(rp);

                    tr.appendChild(rd);

                    tbl.appendChild(tr);
                }
            }
        });
    return tbl;
}

function number_of_days() {

    let sel = document.getElementById("date_trans");
    let v = sel.value;
    sel.innerHTML = "";
    let y = document.getElementById("year_trans").value;
    let m = document.getElementById("month_trans").value;
    let days = 32 - new Date(y, m, 32).getDate();
    let d = 1;
    for (d = 1; d <= days; d++) {

        let opt = document.createElement("option");
        opt.value = d;
        let t = document.createTextNode(d);
        opt.appendChild(t);
        sel.appendChild(opt);
    }
    if (v <= days) {
        sel.value = v;
    }
}


function check_fields() {
    let desc = document.getElementById("desc").value;
    let price = document.getElementById("price").value;
    let ad = document.getElementById("add_trans");
    if (desc == "" || price == "") {
        ad.disabled = true;
    }
    else {
        ad.disabled = false;
    }
}

// creates the analysis piechart
function drawChart(){

    var otherSum = 0;
    var foodSum = 0;
    var clothSum = 0;
    var enterSum = 0;

    fetch('/cal/transaction')
    .then(response => response.json())
    .then(data => {
        let transactions = data.rows[0];
        for (let i=0; i<transactions.length; i++) {
            var checkMonth = parseInt(transactions[i].dot.substring(5, 7)) - 1;
            var checkCategory = transactions[i].category;
            var checkPrice = transactions[i].price;
            // console.log(currentMonth);
            // console.log(checkCategory);
            // console.log(checkMonth);
            if (checkMonth === currentMonth) {
                if (checkCategory === "Other") {
                    otherSum = otherSum + checkPrice;
                } else if (checkCategory == "Food") {
                    foodSum += checkPrice;
                } else if (checkCategory == "Clothing") {
                    clothSum += checkPrice;
                } else if (checkCategory == "Entertainment") {
                    enterSum += checkPrice;
                } else {
                    console.log('Error: category not accounted for');
                }
            }
        }
        // console.log('other:'+otherSum);
        // console.log('food:'+foodSum);
        // console.log('cloth:'+clothSum);
        // console.log('enter:'+enterSum);
        var data = [
            { x: "Other", value: otherSum },
            { x: "Food", value: foodSum },
            { x: "Clothing", value: clothSum },
            { x: "Entertainment", value: enterSum }
        ];
    
        // create the chart
        var chart = anychart.pie();
    
        // set the chart title
        chart.title("Budget Analysis for " + document.getElementById("monthAndYear").textContent);
    
        // add the data
        chart.data(data);
    
        // display the chart in the container
        chart.container('container');
        chart.draw();
    });
}

function removeAllChildNodes(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }

}