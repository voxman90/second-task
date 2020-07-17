const colorPurple = ['#BC9CFF', '#8BA4F9'];
const colorGreen = ['#6FCF97', '#66D2EA'];

// create linear-gradient element for SVG
function createLinearGradient(colorFirst, colorSecond, uniqueId) {
  // create Defs tag
  let elementDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  // create linearGradient tag and add attributes
  let elementLinearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  elementLinearGradient.setAttribute('id', uniqueId);
  elementLinearGradient.setAttribute('gradientTransform', 'rotate(90)');

  // create first stop tag and add attributes
  let elementStopFirst = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  elementStopFirst.setAttribute('offset', "0%");
  elementStopFirst.setAttribute('stop-color', colorFirst);

  // create second stop tag and add attributes
  let elementStopSecond = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  elementStopSecond.setAttribute('offset', "100%");
  elementStopSecond.setAttribute('stop-color', colorSecond);

  /* building a hierarchy of tags
    * defs
    * | linearGradient
    * | | stop
    * | | stop
    */
  elementLinearGradient.appendChild(elementStopFirst);
  elementLinearGradient.appendChild(elementStopSecond);   
  elementDefs.appendChild(elementLinearGradient);
  return elementDefs;
}

document.addEventListener("DOMContentLoaded", function() { 
  // collect all logo in document
  let elementList = document.querySelectorAll(".logo_color-change");

  for (let element of elementList) {
    // create random Id
    let randomString = Math.random().toString(36).substr(2, 10);

    // change Circle
    let logoCircle = element.querySelector(".logo__circle");
    logoCircle.appendChild(createLinearGradient(colorPurple[0], colorPurple[1], randomString+"0"));
    logoCircle.firstChild.setAttribute("fill", "url(#"+randomString+"0)");
    logoCircle.firstChild.setAttribute("fill-opacity", "1");

    // change LeftBranch
    let logoLeftBranch = element.querySelector(".logo__left-branch");
    logoLeftBranch.appendChild(createLinearGradient(colorPurple[0], colorPurple[1], randomString+"1"));
    logoLeftBranch.firstChild.setAttribute("fill", "url(#"+randomString+"1)");
    logoLeftBranch.firstChild.setAttribute("fill-opacity", "1");

    // change RightBranch
    let logoRightBranch = element.querySelector(".logo__right-branch");
    logoRightBranch.appendChild(createLinearGradient(colorGreen[0], colorGreen[1], randomString+"2"));
    logoRightBranch.firstChild.setAttribute("fill", "url(#"+randomString+"2)");
    logoRightBranch.firstChild.setAttribute("fill-opacity", "1");
  };
});