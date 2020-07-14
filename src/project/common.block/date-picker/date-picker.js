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
  // создаёт массив на любой последующий месяц
  // показывает расстояние между датами
  currentDate: new Date
}

dateBank.initBank = function() {
  this.currentDate.setTime(Date.now());
}

dateBank.monthToDate = function(date) {
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

dateBank.monthToDay = function(date) {
  let monthCopy = new Date(date);
  let daysName = 0;
  monthCopy.setDate(1);
  daysName = monthCopy.getDay();
  return (daysName + 6) % 7;
}

dateBank.monthToRow = function(date) {
  const monthDate = this.monthToDate(date);
  const monthDay = this.monthToDay(date);
  let rowAmount = 5;
  const summ = monthDate + monthDay;
  if (summ > 35) {
    rowAmount = 6;
  }
  return rowAmount;
}

dateBank.constructCalendarList = function(date) {
  let dateCopy = new Date(date);
  dateCopy.setMonth(date.getMonth() -1);
  let monthPrev = dateBank.monthToDate(dateCopy);
  let monthCurrent = dateBank.monthToDate(date);
  let weekAmount = dateBank.monthToRow(date);
  let startFrom = dateBank.monthToDay(date);
  let i = 0;
  let calendar = [];
  for (; i < startFrom; i++) {
     calendar[i] = monthPrev - startFrom + (i + 1);
  }
  console.log(i);
  // i = sratrFrom - день недели (0-6)
  for (; i < monthCurrent + startFrom; i++) {
     calendar[i] = i - startFrom + 1;
  }
  console.log(i);
  // i = monthCurrent + startFrom
  for (; i < weekAmount*7; i++) {
     calendar[i] = i - (monthCurrent + startFrom) + 1;
  }
  console.log(i);
  return calendar;
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
