function containsIn(supposedParent, checkedNode) {
  let isSameNodes = false;
  let ancestor = checkedNode;
  while ((ancestor !== null) && !isSameNodes) {    
    if (ancestor.isSameNode(supposedParent)) {
      isSameNodes = true;
    } else {
      ancestor = ancestor.parentNode;
    }
  }
  return isSameNodes;
}

let dateBank = {
  // создаёт массив на текущий месяц
  // создаёт массив на любой последующий месяц
  // показывает расстояние между датами
  currentDate: new Date,
  currentYear: 0,
  currentMonth: 0,
  currentDate: 0,
  currentDay: 0,
}

dateBank.initBank = function() {
  this.currentDate.setTime(Date.now());
  this.currentYear = this.currentDate.getFullYear();
  this.currentMonth = this.currentDate.getMonth();
  this.currentDate = this.currentDate.getDate();
  this.currentDate = this.currentDate.getDay();
}

dateBank.monthToDay = function(date) {
  let monthCopy = new Date(date);
  let daysNumber = 28;
  monthCopy.setDate(31);
  switch (monthCopy.getDate()) {
    case 31:
      daysNumber = 31;
      break;
    case 1: 
      daysNumber = 30;
      break;
    case 2:
      daysNumber = 29;
      break;
    default:
      break;
  }
  return daysNumber;
}

dateBank.constructMonthArray = function(date) {
  let monthArray = []
    date.
  return monthArray;
}

dateBank.initBank();

document.addEventListener("DOMContentLoaded", function () {
  const dateForms = document.body.querySelectorAll(".date-picker");
  for (let i = 0; i < dateForms.length; i++) {
    const dateForm = dateForms[i];
    const dateTextFieldDeparture = dateForm.children[0].firstChild.children[1];
    const dateTextFieldDepartureIcon = dateTextFieldDeparture.nextElementSibling;
    const dateTextFieldArrival = dateForm.children[2].firstChild.children[1];
    const dateTextFieldArrivalIcon = dateTextFieldArrival.nextElementSibling;
    const dateCalendar = dateForm.nextElementSibling;
    let initial =  true;

    dateForm.addEventListener("mousedown", function (event) {
      if (dateTextFieldDeparture.isSameNode(event.target) || dateTextFieldDepartureIcon.isSameNode(event.target) 
      || dateTextFieldArrival.isSameNode(event.target) || dateTextFieldArrivalIcon.isSameNode(event.target)) {
        if (initial === true) {
          dateCalendar.fillCalendar(currentDate);
          initial = false;
        }
        dateCalendar.classList.toggle("calendar_hidden");
      }
    });   

    dateCalendar.addEventListener("mouseup", function (event) {
    
       
    }); 
  }
});
