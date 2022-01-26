import type { NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const handleAddSubject = () => {
    setSubjects([...subjects, subject]);
  };
  const [cName, setCName] = useState("");
  const [sections, setSections] = useState<number>();

  const [periodsADay, setPeriodsADay] = useState<number>();
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [subPeriodsInWeek, setSubPeriodsInWeek] = useState<string[]>([]);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  interface OneSectionData {
    className: string;
    section: string;
    subsPeriodsInWeek: Array<number>;
  }
  interface CommonData {
    subjects: string[];
    periodsADay: number;
    weekDays: string[];
  }
  const handleSee = () => {
    const options = selectRef.current!.options;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setWeekdays(selected);
    setSubPeriodsInWeek(new Array(subjects.length));
  };
  const handlePeriodNo = (index: number, value: string) => {
    subPeriodsInWeek.splice(index, 1, value);
    setSubPeriodsInWeek(subPeriodsInWeek);
  };
  const allSee = () => {
    console.log("weekDays", weekdays);
    console.log("subPeriodsInweek", subPeriodsInWeek);
    console.log("periodsAday", periodsADay);
  };
  const generateAllTT = (
    allSectionsData: OneSectionData[],
    commonData: CommonData
  ) => {
    for (let i = 0; i < 10; i++) {
      generateTT(allSectionsData[i]);
    }
  };
  const generateTT = (oneSectionData: OneSectionData) => {
    let subPeriodsA: number[] = [];
    for (let i = 0; i < subPeriodsInWeek.length; i++) {
      subPeriodsA.push(parseInt(subPeriodsInWeek[i]));
    }
    let secA: Array<string | null> = [];
    for (let i = 0; i < periodsADay!; i++) {
      let t = [];
      for (let j = 0; j < weekdays.length; j++) {
        t.push(null);
      }
      secA.push(t);
    }
    let subjectsAllocated = new Array(subjects.length).fill(secA);
    // regular subjects
    const fillRegularSubjectsInTT = () => {
      for (let i = 0; i < subjects.length; i++) {
        if (subPeriodsA[i] < weekdays.length) continue;
        let count = 0;
        for (let j = 0; j < periodsADay; j++) {
          let loopBreak = false;
          for (let k = 0; k < weekdays.length; k++) {
            if (subjectsAllocated[i][j][k] == null && secA[j][k] == null) {
              secA[j][k] = subjects[i];
              subjectsAllocated[i][j][k] = subjects[i];
              count++;
              subPeriodsA[i] -= 1;
              if (count == weekdays.length) {
                loopBreak = true;
                break;
              }
            }
          }
          if (loopBreak) break;
        }
      }
    };
    fillRegularSubjectsInTT();

    //random array with 0, 1,2... upto subjects length
    let randomArray = [];
    const createRandomArray = (n) => {
      while (randomArray.length < n) {
        let randNo = Math.floor(Math.random() * n);
        if (!randomArray.includes(randNo)) randomArray.push(randNo);
      }
    };
    createRandomArray(subjects.length);

    //completing timeTable
    const completeTT = () => {
      for (let i = 0; i < subjects.length; i++) {
        let count = 0;
        let r = randomArray[i];
        if (subPeriodsA[r] == 0) {
          continue;
        }
        for (let j = 0; j < periodsADay!; j++) {
          let loopBreak = false;
          for (let k = 0; k < weekdays.length; k++) {
            if (subjectsAllocated[r][j][k] == null && secA[j][k] == null) {
              secA[j][k] = subjects[r];
              subjectsAllocated[r][j][k] = subjects[r];
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
    };
    completeTT();
    console.log(secA);
  };
  return (
    <div>
      <div>
        <label htmlFor='subject'>Subject:</label>
        <input
          type='text'
          id='subject'
          onChange={(e) => setSubject(e.target.value)}
        />
        <br />
        <button onClick={handleAddSubject}>Add TO Subject List</button>
        <div>{subjects}</div>
      </div>
      <div>
        <label htmlFor='cName'>Class Name:</label>
        <input
          type='text'
          id='cName'
          onChange={(e) => setCName(e.target.value)}
        />
        {cName}
        <br />
        <label htmlFor='sections'>Sections:</label>
        <input
          type='number'
          id='sections'
          onChange={(e) => setSections(parseInt(e.target.value))}
        />
        {sections}
        <br />
        <label htmlFor='periodsADay'>Periods A Day: </label>
        <input
          type='number'
          id='periodsADay'
          value={periodsADay}
          onChange={(e) => setPeriodsADay(parseInt(e.target.value))}
        />
        {periodsADay}
        <br />
        <label htmlFor='days'>Select working Days</label>
        <select ref={selectRef} id='days' multiple>
          <option value={"MON"}>MON</option>
          <option value={"TUE"}>TUE</option>
          <option value={"WED"}>WED</option>
          <option value={"THU"}>THU</option>
          <option value={"FRI"}>FRI</option>
          <option value={"SAT"}>SAT</option>
          <option value={"SUN"}>SUN</option>
        </select>
        {weekdays}
        <button onClick={handleSee}>Set WeekDays</button>
      </div>
      <div>
        {subjects.length >= 1 ? (
          subjects.map((value, index) => {
            return (
              <div key={index}>
                <span>{value}</span>
                <input
                  type='number'
                  onChange={(e) => handlePeriodNo(index, e.target.value)}
                />
              </div>
            );
          })
        ) : (
          <div>
            <h1>diiii</h1>
          </div>
        )}
      </div>
      <div></div>
      <button onClick={generateTT}>Generate TT</button>
      <button onClick={allSee}>ALL SEE</button>
    </div>
  );
};
export default Home;
