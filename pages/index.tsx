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

  const [cName, setCName] = useState<string>("");
  const [section, setSection] = useState<string>("");

  const [periodsADay, setPeriodsADay] = useState<number>();
  const [weekDays, setweekDays] = useState<string[]>([]);

  const [subPeriodsInWeek, setSubPeriodsInWeek] = useState<string[]>([]);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  interface OneSectionData {
    className: string;
    section: string;
    subsPeriodsInWeek: Array<string>;
  }
  interface CommonData {
    subjects: string[];
    periodsADay: number | undefined;
    weekDays: string[];
  }
  interface TT {
    className: string;
    section: string;
    tt: Array<Array<string | null>>;
  }
  const handleSee = () => {
    const options = selectRef.current!.options;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setweekDays(selected);
    setSubPeriodsInWeek(new Array(subjects.length));
  };
  const handlePeriodNo = (index: number, value: string) => {
    subPeriodsInWeek.splice(index, 1, value);
    setSubPeriodsInWeek(subPeriodsInWeek);
  };

  const generateTT = (
    oneSectionData: OneSectionData,
    commonData: CommonData
  ) => {
    let { className, section, subsPeriodsInWeek } = oneSectionData;
    let { subjects, periodsADay, weekDays } = commonData;

    let subPeriods: number[] = [];
    for (let i = 0; i < subsPeriodsInWeek.length; i++) {
      subPeriods.push(parseInt(subsPeriodsInWeek[i]));
    }
    console.log(subPeriods);
    let oneTT: Array<Array<string | null>> = [];
    for (let i = 0; i < periodsADay!; i++) {
      let t = [];
      for (let j = 0; j < weekDays.length; j++) {
        t.push(null);
      }
      oneTT.push(t);
    }
    let subjectsAllocated = new Array(subjects.length).fill(oneTT);
    // regular subjects
    const fillRegularSubjectsInTT = () => {
      for (let i = 0; i < subjects.length; i++) {
        if (
          subPeriods[i] < weekDays.length ||
          Number.isNaN(subPeriods[i]) ||
          subPeriods[i] == null
        )
          continue;
        let count = 0;
        for (let j = 0; j < periodsADay!; j++) {
          let loopBreak = false;
          for (let k = 0; k < weekDays.length; k++) {
            if (subjectsAllocated[i][j][k] == null && oneTT[j][k] == null) {
              oneTT[j][k] = subjects[i];
              subjectsAllocated[i][j][k] = subjects[i];
              count++;
              subPeriods[i] -= 1;
              if (count == weekDays.length) {
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
    let randomArray: number[] = [];
    const createRandomArray = (n: number) => {
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
        if (
          subPeriods[r] == 0 ||
          Number.isNaN(subPeriods[r]) ||
          subPeriods[r] == null
        )
          continue;
        for (let j = 0; j < periodsADay!; j++) {
          let loopBreak = false;
          for (let k = 0; k < weekDays.length; k++) {
            if (subjectsAllocated[r][j][k] == null && oneTT[j][k] == null) {
              oneTT[j][k] = subjects[r];
              subjectsAllocated[r][j][k] = subjects[r];
              count++;
              subPeriods[r] -= 1;

              if (subPeriods[r] == 0) {
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
    console.log(oneTT);
    setSchoolTT([
      ...schoolTT,
      {
        className: className,
        section: section,
        tt: oneTT,
      },
    ]);
  };
  const completeOneSchoolTT = () => {
    setAllSchoolTT([...allSchoolTT, schoolTT]);
  };
  const [schoolTT, setSchoolTT] = useState<Array<TT>>([]);
  const [allSchoolTT, setAllSchoolTT] = useState<Array<Array<TT>>>([]);
  // const [iOfSchoolTT, setIOfTTInSchoolTT] = useState(0);
  // const [iOfSchoolTTInAllSchoolTTs, setiOfSchoolTTInAllSchoolTTs] = useState(0);
  const allSee = () => {
    console.log("schoolTT", schoolTT);
    console.log("allSchoolTT", allSchoolTT);
  };
  const allClear = () => {
    setAllSchoolTT([]);
    setSchoolTT([]);
  };

  return (
    <main className={styles.container}>
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
        <label htmlFor='periodsADay'>Periods A Day: </label>
        <input
          type='number'
          id='periodsADay'
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
        {weekDays}
        <button onClick={handleSee}>Set weekDays</button>
        <br />
      </div>
      <div className={styles.diva}>
        <h1>TT One</h1>
        <label htmlFor='cName'>Class Name:</label>
        <input
          type='text'
          id='cName'
          onChange={(e) => setCName(e.target.value)}
        />
        {cName}
        <br />
        <label htmlFor='section'>Section:</label>
        <input
          type='text'
          id='section'
          onChange={(e) => setSection(e.target.value)}
        />
        {section}
        <br />
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
        <button
          onClick={(e) =>
            generateTT(
              {
                className: cName,
                section: section,
                subsPeriodsInWeek: subPeriodsInWeek,
              },
              {
                subjects: subjects,
                periodsADay: periodsADay,
                weekDays: weekDays,
              }
            )
          }
        >
          Create TT
        </button>
        <button onClick={completeOneSchoolTT}>Complete One SchoolTT</button>
        <button onClick={allSee}>All See</button>
        <button onClick={allClear}>All clear</button>
      </div>
    </main>
  );
};
export default Home;
// subjects: string[];
// periodsADay: number;
// weekDays: string[];
