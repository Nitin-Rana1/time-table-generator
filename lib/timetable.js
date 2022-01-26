let secA = new Array(8).fill(new Array(6).fill(null));
let secB = new Array(8).fill(new Array(6).fill(null));
let secC = new Array(8).fill(new Array(6).fill(null));
let secD = new Array(8).fill(new Array(6).fill(null));
let secE = new Array(8).fill(new Array(6).fill(null));

let P = new Array(8).fill(new Array(6).fill(null));
let C = new Array(8).fill(new Array(6).fill(null));
let M = new Array(8).fill(new Array(6).fill(null));
let E = new Array(8).fill(new Array(6).fill(null));
let IP = new Array(8).fill(new Array(6).fill(null));
let PE = new Array(8).fill(new Array(6).fill(null));

let subjectsAllocated = [P, C, M, E, IP, PE];
let subjectsAllocatedA;
let subjectsAllocatedB;
let subjectsAllocatedC;
let subjectsAllocatedD;
let subjectsAllocatedE;

let count = 0;
let periodADay = 8;
let schoolingDaysAWeek = 6;

let subjects = ['P', 'C', 'M', 'Eng', 'IP', 'PE'];
let subPeriodsOriginal = [10, 10, 10, 8, 6, 4];
let subPeriodsA = [10, 10, 10, 8, 6, 4];
let subPeriodsB = [10, 10, 10, 8, 6, 4];
let subPeriodsC = [10, 10, 8, 8, 6, 6];
let subPeriodsD = [10, 8, 10, 8, 6, 6];
let subPeriodsE = [8, 10, 10, 8, 6, 6];

function generateTimeTableAll() {
  generateTimeTableA();

  generateTimeTableB();
  resetTimeTableBLoop();

  generateTimeTableC();
  resetTimeTableCLoop();

  generateTimeTableD();
  resetTimeTableDLoop();

  generateTimeTableE();
  resetTimeTableELoop();

  console.log('FINAL----------------------------');
  console.log('A', secA);
  console.log('B', secB);
  console.log('C', secC);
  console.log('D', secD);
  console.log('E', secE);
  console.log(subjectsAllocated);
}
function generateTimeTableA() {
  //Step 1: Filling regular subject, i.e. subject that take place every day
  for (let i = 0; i < subjects.length; i++) {
    if (subPeriodsA[i] <= 5) continue;
    let count = 0;
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[i][j][k] == null && secA[j][k] == null) {
          secA[j][k] = subjects[i];
          subjectsAllocated[i][j][k] = subjects[i];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[i];
          count++;
          subPeriodsA[i] -= 1;
          if (count == 6) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  let randomArray = [-10, -10, -10, -10, -10, -10];
  let c = 0;
  let index = 0;
  while (true) {
    let randomNo = Math.floor(Math.random() * subjects.length);
    if (!randomArray.includes(randomNo)) {
      randomArray[index] = randomNo;
      index++;
    }
    if (
      randomArray.includes(0) &&
      randomArray.includes(1) &&
      randomArray.includes(2) &&
      randomArray.includes(3) &&
      randomArray.includes(4) &&
      randomArray.includes(5)
    ) {
      break;
    }
    c++;
    if (c > 150) {
      console.log('breaek due to 50505050');
      break;
    }
  }
  for (let i = 0; i < subjects.length; i++) {
    let r = randomArray[i];
    if (subPeriodsA[r] == 0) {
      continue;
    }
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[r][j][k] == null && secA[j][k] == null) {
          secA[j][k] = subjects[r];
          subjectsAllocated[r][j][k] = subjects[r];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[r];
          count++;
          subPeriodsA[r] -= 1;

          if (subPeriodsA[r] == 0) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  subjectsAllocatedA = subjectsAllocated;
}
function generateTimeTableB() {
  //Step 1: Filling regular subject, i.e. subject that take place every day
  for (let i = 0; i < subjects.length; i++) {
    if (subPeriodsB[i] <= 5) continue;
    let count = 0;
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[i][j][k] == null && secB[j][k] == null) {
          secB[j][k] = subjects[i];
          subjectsAllocated[i][j][k] = subjects[i];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[i];
          count++;
          subPeriodsB[i] -= 1;
          if (count == 6) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  let randomArray = [-10, -10, -10, -10, -10, -10];
  let c = 0;
  let index = 0;
  while (true) {
    let randomNo = Math.floor(Math.random() * subjects.length);
    if (!randomArray.includes(randomNo)) {
      randomArray[index] = randomNo;
      index++;
    }
    if (
      randomArray.includes(0) &&
      randomArray.includes(1) &&
      randomArray.includes(2) &&
      randomArray.includes(3) &&
      randomArray.includes(4) &&
      randomArray.includes(5)
    ) {
      break;
    }
    c++;
    if (c > 150) {
      console.log('breaek due to 50505050');
      break;
    }
  }
  for (let i = 0; i < subjects.length; i++) {
    let r = randomArray[i];
    if (subPeriodsB[r] == 0) {
      continue;
    }
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[r][j][k] == null && secB[j][k] == null) {
          secB[j][k] = subjects[r];
          subjectsAllocated[r][j][k] = subjects[r];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[r];
          count++;
          subPeriodsB[r] -= 1;

          if (subPeriodsB[r] == 0) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  subjectsAllocatedB = subjectsAllocated;
}
function generateTimeTableC() {
  //Step 1: Filling regular subject, i.e. subject that take place every day
  for (let i = 0; i < subjects.length; i++) {
    if (subPeriodsC[i] <= 5) continue;
    let count = 0;
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[i][j][k] == null && secC[j][k] == null) {
          secC[j][k] = subjects[i];
          subjectsAllocated[i][j][k] = subjects[i];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[i];
          count++;
          subPeriodsC[i] -= 1;
          if (count == 6) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  let randomArray = [-10, -10, -10, -10, -10, -10];
  let c = 0;
  let index = 0;
  while (true) {
    let randomNo = Math.floor(Math.random() * subjects.length);
    if (!randomArray.includes(randomNo)) {
      randomArray[index] = randomNo;
      index++;
    }
    if (
      randomArray.includes(0) &&
      randomArray.includes(1) &&
      randomArray.includes(2) &&
      randomArray.includes(3) &&
      randomArray.includes(4) &&
      randomArray.includes(5)
    ) {
      break;
    }
    c++;
    if (c > 150) {
      console.log('breaek due to 50505050');
      break;
    }
  }
  for (let i = 0; i < subjects.length; i++) {
    let r = randomArray[i];
    if (subPeriodsC[r] == 0) {
      continue;
    }
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[r][j][k] == null && secC[j][k] == null) {
          secC[j][k] = subjects[r];
          subjectsAllocated[r][j][k] = subjects[r];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[r];
          count++;
          subPeriodsC[r] -= 1;

          if (subPeriodsC[r] == 0) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  subjectsAllocatedC = subjectsAllocated;
}
function generateTimeTableD() {
  //Step 1: Filling regular subject, i.e. subject that take place every day
  for (let i = 0; i < subjects.length; i++) {
    if (subPeriodsD[i] <= 5) continue;
    let count = 0;
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[i][j][k] == null && secD[j][k] == null) {
          secD[j][k] = subjects[i];
          subjectsAllocated[i][j][k] = subjects[i];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[i];
          count++;
          subPeriodsD[i] -= 1;
          if (count == 6) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  let randomArray = [-10, -10, -10, -10, -10, -10];
  let c = 0;
  let index = 0;
  while (true) {
    let randomNo = Math.floor(Math.random() * subjects.length);
    if (!randomArray.includes(randomNo)) {
      randomArray[index] = randomNo;
      index++;
    }
    if (
      randomArray.includes(0) &&
      randomArray.includes(1) &&
      randomArray.includes(2) &&
      randomArray.includes(3) &&
      randomArray.includes(4) &&
      randomArray.includes(5)
    ) {
      break;
    }
    c++;
    if (c > 150) {
      console.log('breaek due to 50505050');
      break;
    }
  }
  for (let i = 0; i < subjects.length; i++) {
    let r = randomArray[i];
    if (subPeriodsD[r] == 0) {
      continue;
    }
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[r][j][k] == null && secD[j][k] == null) {
          secD[j][k] = subjects[r];
          subjectsAllocated[r][j][k] = subjects[r];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[r];
          count++;
          subPeriodsD[r] -= 1;

          if (subPeriodsD[r] == 0) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  subjectsAllocatedD = subjectsAllocated;
}
function generateTimeTableE() {
  //Step 1: Filling regular subject, i.e. subject that take place every day
  for (let i = 0; i < subjects.length; i++) {
    if (subPeriodsE[i] <= 5) continue;
    let count = 0;
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[i][j][k] == null && secE[j][k] == null) {
          secE[j][k] = subjects[i];
          subjectsAllocated[i][j][k] = subjects[i];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[i];
          count++;
          subPeriodsE[i] -= 1;
          if (count == 6) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  let randomArray = [-10, -10, -10, -10, -10, -10];
  let c = 0;
  let index = 0;
  while (true) {
    let randomNo = Math.floor(Math.random() * subjects.length);
    if (!randomArray.includes(randomNo)) {
      randomArray[index] = randomNo;
      index++;
    }
    if (
      randomArray.includes(0) &&
      randomArray.includes(1) &&
      randomArray.includes(2) &&
      randomArray.includes(3) &&
      randomArray.includes(4) &&
      randomArray.includes(5)
    ) {
      break;
    }
    c++;
    if (c > 150) {
      console.log('breaek due to 50505050');
      break;
    }
  }
  for (let i = 0; i < subjects.length; i++) {
    let r = randomArray[i];
    if (subPeriodsE[r] == 0) {
      continue;
    }
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[r][j][k] == null && secE[j][k] == null) {
          secE[j][k] = subjects[r];
          subjectsAllocated[r][j][k] = subjects[r];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[r];
          count++;
          subPeriodsE[r] -= 1;

          if (subPeriodsE[r] == 0) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  subjectsAllocatedE = subjectsAllocated;
}
function resetTimeTableB() {
  subjectsAllocated = subjectsAllocatedA;
  generateTimeTableB();
}
function resetTimeTableC() {
  subjectsAllocated = subjectsAllocatedB;
  generateTimeTableC();
}
function resetTimeTableD() {
  subjectsAllocated = subjectsAllocatedC;
  generateTimeTableD();
}
function resetTimeTableE() {
  subjectsAllocated = subjectsAllocatedD;
  generateTimeTableE();
}
function resetTimeTableBLoop() {
  count = 0;
  while (count < 10) {
    count = 11;
    for (let i = 0; i < secB.length; i++) {
      if (secB[i].includes(null)) {
        console.log('null aaya B mai');
        resetTimeTableB();
        count -= 2;
      }
    }
    count++;
  }
}
function resetTimeTableCLoop() {
  count = 0;
  while (count < 10) {
    count = 11;
    for (let i = 0; i < secC.length; i++) {
      if (secC[i].includes(null)) {
        console.log('null aaya C mai');
        resetTimeTableC();
        count -= 2;
      }
    }
    count++;
  }
}
function resetTimeTableDLoop() {
  count = 0;
  while (count < 10) {
    count = 11;
    for (let i = 0; i < secD.length; i++) {
      if (secD[i].includes(null)) {
        console.log('null aaya D mai');
        resetTimeTableD();
        count -= 2;
      }
    }
    count++;
  }
}
function resetTimeTableELoop() {
  for (let i = 0; i <= 10; i++) {
    for (let i = 0; i < secE.length; i++) {
      if (secE[i].includes(null)) {
        console.log('null aaya E mai');
        resetTimeTableE();
        i = 10;
        continue;
      }
    }
  }
}
/*
let secA = [
  [null, null, null, null, null, null], // all period 1: mon, tue, wed, thu, fri, sat
  [null, null, null, null, null, null], // all period 2
  [null, null, null, null, null, null], // all period 3
  [null, null, null, null, null, null], // all period 4
  [null, null, null, null, null, null], // all period 5
  [null, null, null, null, null, null], // all period 6
  [null, null, null, null, null, null], // all period 7
  [null, null, null, null, null, null], // all period 8
];
let P = [
  [null, null, null, null, null, null], // all period 1: mon, tue, wed, thu, fri, sat
  [null, null, null, null, null, null], // all period 2
  [null, null, null, null, null, null], // all period 3
  [null, null, null, null, null, null], // all period 4
  [null, null, null, null, null, null], // all period 5
  [null, null, null, null, null, null], // all period 6
  [null, null, null, null, null, null], // all period 7
  [null, null, null, null, null, null], // all period 8
];
let C = [
  [null, null, null, null, null, null], // all period 1: mon, tue, wed, thu, fri, sat
  [null, null, null, null, null, null], // all period 2
  [null, null, null, null, null, null], // all period 3
  [null, null, null, null, null, null], // all period 4
  [null, null, null, null, null, null], // all period 5
  [null, null, null, null, null, null], // all period 6
  [null, null, null, null, null, null], // all period 7
  [null, null, null, null, null, null], // all period 8
];
let M = [
  [null, null, null, null, null, null], // all period 1: mon, tue, wed, thu, fri, sat
  [null, null, null, null, null, null], // all period 2
  [null, null, null, null, null, null], // all period 3
  [null, null, null, null, null, null], // all period 4
  [null, null, null, null, null, null], // all period 5
  [null, null, null, null, null, null], // all period 6
  [null, null, null, null, null, null], // all period 7
  [null, null, null, null, null, null], // all period 8
];
let E = [
  [null, null, null, null, null, null], // all period 1: mon, tue, wed, thu, fri, sat
  [null, null, null, null, null, null], // all period 2
  [null, null, null, null, null, null], // all period 3
  [null, null, null, null, null, null], // all period 4
  [null, null, null, null, null, null], // all period 5
  [null, null, null, null, null, null], // all period 6
  [null, null, null, null, null, null], // all period 7
  [null, null, null, null, null, null], // all period 8
];
let IP = [
  [null, null, null, null, null, null], // all period 1: mon, tue, wed, thu, fri, sat
  [null, null, null, null, null, null], // all period 2
  [null, null, null, null, null, null], // all period 3
  [null, null, null, null, null, null], // all period 4
  [null, null, null, null, null, null], // all period 5
  [null, null, null, null, null, null], // all period 6
  [null, null, null, null, null, null], // all period 7
  [null, null, null, null, null, null], // all period 8
];
let PE = [
  [null, null, null, null, null, null], // all period 1: mon, tue, wed, thu, fri, sat
  [null, null, null, null, null, null], // all period 2
  [null, null, null, null, null, null], // all period 3
  [null, null, null, null, null, null], // all period 4
  [null, null, null, null, null, null], // all period 5
  [null, null, null, null, null, null], // all period 6
  [null, null, null, null, null, null], // all period 7
  [null, null, null, null, null, null], // all period 8
];
let subjectsAllocated = [P, C, M, E, IP, PE];
let periodADay = 8;
let schoolingDaysAWeek = 6;
let subjects = ["P", "C", "M", "Eng", "IP", "PE"];
let subPeriodsOriginal = [10, 10, 10, 8, 6, 4];
let subPeriods = [10, 10, 10, 8, 6, 4];
let subPeriodsMinus6 = [4, 4, 4, 2, 0, 4];
function generateTimeTable() {
  let heading = document.getElementById("h");
  heading.textContent = "Generating TimeTable please wait";
  //Step 1: Filling regular subject, i.e. subject that take place every day
  for (let i = 0; i < subjects.length; i++) {
    if (subPeriods[i] <= 5) continue;
    let count = 0;
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[i][j][k] == null && secA[j][k] == null) {
          secA[j][k] = subjects[i];
          subjectsAllocated[i][j][k] = subjects[i];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[i];
          count++;
          subPeriods[i] -= 1;
          if (count == 6) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  console.log("loop1complete");
  console.log(subPeriods, "minus 6");
  for (let i = 0; i < subjects.length; i++) {
    if (subPeriodsMinus6[i] == 0) {
      console.log(subjects[i], "skipped");
      continue;
    }
    let count = 0;
    for (let j = 0; j < periodADay; j++) {
      let loopBreak = false;
      for (let k = 0; k < schoolingDaysAWeek; k++) {
        if (subjectsAllocated[i][j][k] == null && secA[j][k] == null) {
          secA[j][k] = subjects[i];
          subjectsAllocated[i][j][k] = subjects[i];
          let tableCell = document.getElementById(j.toString() + k.toString());
          tableCell.textContent = subjects[i];
          count++;
          console.log(subjects[i], " printed");
          if (count == subPeriods[i]) {
            loopBreak = true;
            break;
          }
        }
      }
      if (loopBreak) break;
    }
  }
  console.log("loop2complete");
}
*/
