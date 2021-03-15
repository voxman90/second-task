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

dateBank.dateToDDMMYYYY = function (date) {
  let DDMMYYYY = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
  return DDMMYYYY;
}

dateBank.dateToDDMMDDMM = function (arrivalDate, departureDate) {
  const arrival = arrivalDate.getDate() + " " + (dateBank.monthToName(arrivalDate.getMonth())).substring(0, 3).toLowerCase() ;
  const departure = departureDate.getDate() + " " + (dateBank.monthToName(departureDate.getMonth())).substring(0, 3).toLowerCase();
  let DDMMDDMM = arrival + "-" + departure;
  return DDMMDDMM;
}

dateBank.initBank = function() {
  this.currentDate.setTime(Date.now());
  this.showDate = new Date(this.currentDate);
  this.showDate.setDate(1);
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

dateBank.dateToRow = function(date) {
  let firstDay = this.monthToDay(date);
  return Math.floor((date.getDate() + firstDay - 0.1)/7);
}

dateBank.dateToMonth = function(date) {
  let monthAmount = date.getYear()*12 + date.getMonth() + 1;
  return monthAmount;
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

dateBank.getTargetDate = function (targetTableCell, showDate) {
  let targetDate = new Date(showDate);
  targetDate.setDate(targetTableCell.innerHTML);
  return targetDate;
}

dateBank.initBank();

function clearCalendarTable (calendarTable) {
  let currentCell;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      k = i*7 + j;
      currentCell = calendarTable.children[i].children[j];
      currentCell.classList.remove("calendar__table-td_departure", "calendar__table-td_arrival", "calendar__table_fill");
    }
  }
}

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

function setRecentDate(calendarTable, currentDate, showDate) {
  if ((showDate.getMonth() === currentDate.getMonth()) && (showDate.getYear() === currentDate.getYear())) {
    calendarTable.children[dateBank.dateToRow(currentDate)].children[(currentDate.getDay()+6)%7].classList.add("calendar__table-td_recent-day");
  } else {
    calendarTable.children[dateBank.dateToRow(currentDate)].children[(currentDate.getDay()+6)%7].classList.remove("calendar__table-td_recent-day");
  }
}

/* function removeCalendarDate(calendarTable, targerDate, currentDate, removeClass) {
   if ((targerDate.getMonth() === currentDate.getMonth()) && (targerDate.getYear() === currentDate.getYear())) {
    calendarTable.children[dateBank.dateToRow(targerDate)].children[(targerDate.getDay()+6)%7].classList.remove(removeClass);
  }
} */

function drawTrace(calendarTable, showDate, arrivalDate, departureDate) {
  if (arrivalDate.getTime() !== 0) {
    if ((showDate.getMonth() === arrivalDate.getMonth()) && (showDate.getYear() === arrivalDate.getYear())) {
      calendarTable.children[dateBank.dateToRow(arrivalDate)].children[(arrivalDate.getDay()+6)%7].classList.add("calendar__table-td_arrival");
    } else {
      calendarTable.children[dateBank.dateToRow(arrivalDate)].children[(arrivalDate.getDay()+6)%7].classList.remove("calendar__table-td_arrival");
    }
  }
  if (departureDate.getTime() !== 0) {
    if ((showDate.getMonth() === departureDate.getMonth()) && (showDate.getYear() === departureDate.getYear())) {
      calendarTable.children[dateBank.dateToRow(departureDate)].children[(departureDate.getDay()+6)%7].classList.add("calendar__table-td_departure");
    } else {
      calendarTable.children[dateBank.dateToRow(departureDate)].children[(departureDate.getDay()+6)%7].classList.remove("calendar__table-td_departure");
    }
  } 
  if (departureDate.getTime() - arrivalDate.getTime() > 0 
    && (dateBank.dateToMonth(arrivalDate) <= dateBank.dateToMonth(showDate)) 
    && (dateBank.dateToMonth(departureDate) >= dateBank.dateToMonth(showDate))) {
    let i = dateBank.monthToDay(showDate); // [0..6]
    let end = i + dateBank.monthToDate(showDate); // [28..37]
    if ((showDate.getMonth() === departureDate.getMonth()) && (showDate.getYear() === departureDate.getYear())) {
      end = i + departureDate.getDate(); // [0..37]
    }
    if ((showDate.getMonth() === arrivalDate.getMonth()) && (showDate.getYear() === arrivalDate.getYear())) {
      i = i + arrivalDate.getDate() - 1; // [0..37]
    }
    for (; i < end; i++) {
      calendarTable.children[Math.floor((i+0.9)/7)].children[(i)%7].classList.add("calendar__table_fill");
    }
  }
}

function setTargetDate(targetTableCell, buttonClear, currentDate, showDate, arrivalDate, departureDate) {
  let targetDate = new Date(dateBank.getTargetDate(targetTableCell, showDate));
  if (targetDate.getTime() >= currentDate.getTime()) {
    if (arrivalDate.getTime() === 0) {
      arrivalDate.setTime(targetDate.getTime());
    } else if (departureDate.getTime() === 0 && targetDate.getTime() >= arrivalDate.getTime())  {
      departureDate.setTime(targetDate.getTime());
    }
    if (buttonClear.classList.contains("calendar__button-clear_hidden")) {
      buttonClear.classList.remove("calendar__button-clear_hidden");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const dateForms = document.body.querySelectorAll(".date-picker");
  for (let i = 0; i < dateForms.length; i++) {
    const dateForm = dateForms[i];
    const dateTextFieldArrival = dateForm.children[0].firstChild.children[1];
    const dateTextFieldArrivalIcon = dateTextFieldArrival.nextElementSibling;
    const dateTextFieldDeparture = dateForm.children[2].firstChild.children[1];
    const dateTextFieldDepartureIcon = dateTextFieldDeparture.nextElementSibling;
    const dateCalendar = dateForm.nextElementSibling;
    const calendarTitle = dateCalendar.children[0];
    const calendarBackward = calendarTitle.children[0];
    const calendarForward = calendarBackward.nextElementSibling;
    const calendarMonth = calendarForward.nextElementSibling;
    const calendarTable = dateCalendar.children[1].children[1];
    const buttonClear = dateCalendar.children[2].children[0];
    const buttonApply = dateCalendar.children[2].children[1];
    
    let initial =  true; 

    dateForm.addEventListener("mousedown", function (event) {
      if (dateTextFieldArrival.isSameNode(event.target) || dateTextFieldArrivalIcon.isSameNode(event.target) || 
      dateTextFieldDeparture.isSameNode(event.target) || dateTextFieldDepartureIcon.isSameNode(event.target)) {
        if (initial === true) {
          setCalendarTitle(calendarMonth, dateBank.currentDate);
          setCalendarTable(calendarTable, dateBank.getCalendarList(dateBank.currentDate), "calendar__table-td_recent-month");
          setRecentDate(calendarTable, dateBank.currentDate, dateBank.currentDate);
          initial = false;
        }
        dateCalendar.classList.toggle("calendar_hidden");
      }
    });   

    document.addEventListener("mousedown", function (event) {
      if (!containsIn(dateForm.parentNode, event.target) && !dateCalendar.classList.contains("calendar_hidden")) {
        dateCalendar.classList.add("calendar_hidden");
      }
    });

    let arrivalDate = new Date;
    arrivalDate.setTime(0);
    let departureDate = new Date;
    departureDate.setTime(0);

    dateCalendar.addEventListener("mouseup", function (event) {
      const target = event.target;
      if (calendarForward.isSameNode(target)) {
        dateBank.showDate.setMonth(dateBank.showDate.getMonth()+1);
        calendarList = dateBank.getCalendarList(dateBank.showDate);
        clearCalendarTable(calendarTable);
        setCalendarTitle(calendarMonth, dateBank.showDate);
        setCalendarTable(calendarTable, calendarList, "calendar__table-td_recent-month");
        setRecentDate(calendarTable, dateBank.currentDate, dateBank.showDate);
        drawTrace(calendarTable, dateBank.showDate, arrivalDate, departureDate);
      }
      if (calendarBackward.isSameNode(target)) {
        dateBank.showDate.setMonth(dateBank.showDate.getMonth()-1);
        calendarList = dateBank.getCalendarList(dateBank.showDate);
        clearCalendarTable(calendarTable);
        setCalendarTitle(calendarMonth, dateBank.showDate);
        setCalendarTable(calendarTable, calendarList, "calendar__table-td_recent-month");
        setRecentDate(calendarTable, dateBank.currentDate, dateBank.showDate);
        drawTrace(calendarTable, dateBank.showDate, arrivalDate, departureDate);
      }
      if (target.classList.contains("calendar__table-td_recent-month")) {
        setTargetDate(target, buttonClear, dateBank.currentDate, dateBank.showDate, arrivalDate, departureDate);
        drawTrace(calendarTable, dateBank.showDate, arrivalDate, departureDate);
      }
      if (buttonClear.isSameNode(target)) {
        arrivalDate.setTime(0);
        departureDate.setTime(0);
        clearCalendarTable(calendarTable);
        dateTextFieldArrival.value = "ДД.ММ.ГГГГ";
        dateTextFieldDeparture.value = "ДД.ММ.ГГГГ";
      }
      if (buttonApply.isSameNode(target)) {
        if ((arrivalDate.getTime() !== 0) && (departureDate.getTime() !== 0)) {
          dateTextFieldArrival.value = dateBank.dateToDDMMYYYY(arrivalDate);
          dateTextFieldDeparture.value = dateBank.dateToDDMMYYYY(departureDate);
          dateCalendar.classList.add("calendar_hidden");
        }
      }
    }); 
  }
});
