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
  currentDate: new Date,
  showDate: new Date
}

dateBank.initBank = function() {
  this.currentDate.setTime(Date.now());
  this.showDate = new Date(this.currentDate);
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

dateBank.monthToName = {
  0: "Январь",
  1: "Февраль",
  2: "Март",
  3: "Апрель",
  4: "Май",
  5: "Июнь",
  6: "Июль",
  7: "Август",
  8: "Сентябрь",
  9: "Октябрь",
  10: "Ноябрь",
  11: "Декабрь"
}

dateBank.getCalendarList = function(date) {
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
  // i = sratrFrom - день недели (0-6)
  for (; i < monthCurrent + startFrom; i++) {
     calendar[i] = i - startFrom + 1;
  }
  // i = monthCurrent + startFrom
  for (; i < weekAmount*7; i++) {
     calendar[i] = i - (monthCurrent + startFrom) + 1;
  }
  calendar[i] = startFrom;
  calendar[i + 1] = monthCurrent + startFrom;
  return calendar;
} 

dateBank.dateIntervalRough = function(dateStart, dateEnd) {
  return Math.round(Math.abs(dateEnd.getTime() - dateStart.getTime()) / (24*60*60*1000)); 
}

dateBank.initBank();

// - View

function setCalendarTable (calendarTable, calendarList, classIn) {
  const listLenght = calendarList.length;
  const firstDay = calendarList[listLenght - 2];
  const lastDay = calendarList[listLenght - 1];
  const weeks = (listLenght - 2)/7;
  if (weeks === 6) {
    calendarTable.children[5].classList.remove("calendar__table-tr_hidden");
  } else {
    calendarTable.children[5].classList.add("calendar__table-tr_hidden");
  }
  let k;
  let currentCell;
  for (let i = 0; i < weeks; i++) {
    for (let j = 0; j < 7; j++) {
      k = i*7 + j;
      currentCell = calendarTable.children[i].children[j];
      currentCell.innerHTML = calendarList[k];
      if (k < firstDay || lastDay < k + 1)  {
        currentCell.classList.remove(classIn);
      } else {
        currentCell.classList.add(classIn);
      }
    }
  } 
}

function setCalendarTitle(calendarTitle, date) {
  calendarTitle.innerHTML = dateBank.monthToName[date.getMonth()] + " " + date.getFullYear();
}

function setCurrentDay(calendarTable, date) {
  //
}

document.addEventListener("DOMContentLoaded", function () {
  const dateForms = document.body.querySelectorAll(".date-picker");
  for (let i = 0; i < dateForms.length; i++) {
    const dateForm = dateForms[i];
    const dateTextFieldDeparture = dateForm.children[0].firstChild.children[1];
    const dateTextFieldDepartureIcon = dateTextFieldDeparture.nextElementSibling;
    const dateTextFieldArrival = dateForm.children[2].firstChild.children[1];
    const dateTextFieldArrivalIcon = dateTextFieldArrival.nextElementSibling;
    const dateCalendar = dateForm.nextElementSibling;
    const calendarTitle = dateCalendar.children[0];
    const calendarBackward = calendarTitle.children[0];
    const calendarForward = calendarBackward.nextElementSibling;
    const calendarMonth = calendarForward.nextElementSibling;
    const calendarTable = dateCalendar.children[1].children[1];
    let initial =  true; 

    dateForm.addEventListener("mousedown", function (event) {
      if (dateTextFieldDeparture.isSameNode(event.target) || dateTextFieldDepartureIcon.isSameNode(event.target) 
      || dateTextFieldArrival.isSameNode(event.target) || dateTextFieldArrivalIcon.isSameNode(event.target)) {
        if (initial === true) {
          setCalendarTitle(calendarMonth, dateBank.currentDate);
          setCalendarTable(calendarTable, dateBank.getCalendarList(dateBank.currentDate), "calendar__table-td_recent-month");
          initial = false;
        }
        dateCalendar.classList.toggle("calendar_hidden");
      }
    });   

    dateCalendar.addEventListener("mouseup", function (event) {
      const target = event.target;
      if (calendarForward.isSameNode(target)) {
        dateBank.showDate.setMonth(dateBank.showDate.getMonth()+1);
        calendarList = dateBank.getCalendarList(dateBank.showDate);
        setCalendarTitle(calendarMonth, dateBank.showDate);
        setCalendarTable(calendarTable, calendarList, "calendar__table-td_recent-month");
      }
      if (calendarBackward.isSameNode(target)) {
        dateBank.showDate.setMonth(dateBank.showDate.getMonth()-1);
        calendarList = dateBank.getCalendarList(dateBank.showDate);
        setCalendarTitle(calendarMonth, dateBank.showDate);
        setCalendarTable(calendarTable, calendarList, "calendar__table-td_recent-month");
      }
    }); 
  }
});
