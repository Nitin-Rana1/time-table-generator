import type { NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.scss";
import stylesF from "../styles/Footer.module.scss";
import html2canvas from "html2canvas";

import Header from "../components/Header";
import jsPDF from "jspdf";

const Home: NextPage = () => {
  const [subjects, setSubjects] = useState<string[]>([
    "P",
    "C",
    "M",
    "IP",
    "BIO",
  ]);
  const [subject, setSubject] = useState<string>("");
  const handleAddSubject = () => {
    setSubjects([...subjects, subject]);
  };

  const [cName, setCName] = useState<string>("");
  const [section, setSection] = useState<string>("");

  const [periodsADay, setPeriodsADay] = useState<number>(6);
  const [weekDays, setweekDays] = useState<string[]>([]);

  const [subPeriodsInWeek, setSubPeriodsInWeek] = useState<number[]>([]);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  interface OneSectionData {
    className: string;
    section: string;
    subsPeriodsInWeek: Array<number>;
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
  const [subAllocated, setSubAllocated] = useState<
    Array<Array<Array<string | null>>>
  >([]);
  const makeSubAll = () => {
    let subjectsAllocated: Array<Array<Array<string | null>>> = [];
    for (let i = 0; i < subjects.length; i++) {
      let oneSub = [];
      for (let j = 0; j < periodsADay!; j++) {
        let oneRow = [];
        for (let k = 0; k < weekDays.length; k++) {
          oneRow.push(null);
        }
        oneSub.push(oneRow);
      }
      subjectsAllocated.push(oneSub);
      setSubAllocated(subjectsAllocated);
    }
  };

  const setweekDaysFunc = () => {
    const options = selectRef.current!.options;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setweekDays(selected);
    setSubPeriodsInWeek(new Array(subjects.length).fill(0));
  };
  const handlePeriodNo = (index: number, n: number) => {
    let arr = [...subPeriodsInWeek];
    if (
      arr.reduce((a, b) => a + b, 0) == weekDays.length * periodsADay &&
      n == 1
    )
      return;
    if (arr[index] != 0 || n == 1) arr.splice(index, 1, arr[index] + n);

    setSubPeriodsInWeek(arr);
  };
  const generateTTLoop = () => {
    const checkWithFunc = (func: any) => {
      let arr = func(
        {
          className: cName,
          section: section,
          subsPeriodsInWeek: subPeriodsInWeek,
        },
        {
          subjects: subjects,
          periodsADay: periodsADay,
          weekDays: weekDays,
        },
        subAllocated
      );
      let oneTT = arr.oneTT;
      let notNull = true;
      for (let j = 0; j < oneTT.length; j++) {
        if (oneTT[j].includes(null)) {
          notNull = false;
          break;
        }
      }
      return { notNull, subAlloc: arr.subjectsAllocated, tt: arr.oneTT };
    };
    for (let i = 0; i < 10; i++) {
      let obj = checkWithFunc(generateTT);
      if (obj.notNull) {
        setSubAllocated(obj.subAlloc);
        setSchoolTT([
          ...schoolTT,
          {
            className: cName,
            section: section,
            tt: obj.tt,
          },
        ]);
        console.log(obj.tt);
        return;
      }
    }

    for (let i = 0; i < 15; i++) {
      let obj = checkWithFunc(hardGenerateTT);
      if (obj.notNull) {
        setSubAllocated(obj.subAlloc);
        setSchoolTT([
          ...schoolTT,
          {
            className: cName,
            section: section,
            tt: obj.tt,
          },
        ]);
        console.log(obj.tt);
        return;
      } else if (i > 10) {
        setSubAllocated(obj.subAlloc);
        setSchoolTT([
          ...schoolTT,
          {
            className: cName,
            section: section,
            tt: obj.tt,
          },
        ]);
        console.log(obj.tt);
        return;
      }
    }
  };
  const hardGenerateTT = (
    oneSectionData: OneSectionData,
    commonData: CommonData,
    subAllocated: Array<Array<Array<string | null>>>
  ) => {
    let { className, section, subsPeriodsInWeek } = oneSectionData;
    let { subjects, periodsADay, weekDays } = commonData;

    let subPeriods: number[] = [];
    for (let i = 0; i < subsPeriodsInWeek.length; i++) {
      subPeriods.push(subsPeriodsInWeek[i]);
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
    let subjectsAllocated: Array<Array<Array<string | null>>> = [];
    for (let i = 0; i < subAllocated.length; i++) {
      let oneSub = [];
      for (let j = 0; j < subAllocated[i].length; j++) {
        oneSub.push([...subAllocated[i][j]]);
      }
      subjectsAllocated.push([...oneSub]);
    }
    const createRandomArray = (n: number) => {
      let randomArray: number[] = [];
      while (randomArray.length < n) {
        let randNo = Math.floor(Math.random() * n);
        if (!randomArray.includes(randNo)) randomArray.push(randNo);
      }
      return randomArray;
    };
    let randomArray0 = createRandomArray(subjects.length);
    // regular subjects upto halfONLY
    const fillRegularSubjectsInTT = (n: number) => {
      for (let i = 0; i < subjects.length; i++) {
        let r = randomArray0[i];
        if (
          Number.isNaN(subPeriods[r]) ||
          subPeriods[r] == null ||
          subPeriods[r] == 0
        )
          continue;
        let count = 0;
        for (let j = 0; j < periodsADay!; j++) {
          let loopBreak = false;
          for (let k = 0; k < weekDays.length; k++) {
            if (subjectsAllocated[r][j][k] == null && oneTT[j][k] == null) {
              oneTT[j][k] = subjects[r];
              subjectsAllocated[r][j][k] = subjects[r];
              count++;
              subPeriods[r] -= 1;
              if (count == n || subPeriods[r] == 0) {
                loopBreak = true;
                break;
              }
            }
          }
          if (loopBreak) break;
        }
      }
    };
    // fillRegularSubjectsInTT(weekDays.length / 2);
    fillRegularSubjectsInTT(2);
    fillRegularSubjectsInTT(3);
    fillRegularSubjectsInTT(3);

    //random array with 0, 1,2... upto subjects length
    let randomArray: number[] = createRandomArray(subjects.length);

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
    return { subjectsAllocated, oneTT };
  };
  const generateTT = (
    oneSectionData: OneSectionData,
    commonData: CommonData,
    subAllocated: Array<Array<Array<string | null>>>
  ) => {
    let { className, section, subsPeriodsInWeek } = oneSectionData;
    let { subjects, periodsADay, weekDays } = commonData;

    let subPeriods: number[] = [];
    for (let i = 0; i < subsPeriodsInWeek.length; i++) {
      subPeriods.push(subsPeriodsInWeek[i]);
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
    let subjectsAllocated: Array<Array<Array<string | null>>> = [];
    for (let i = 0; i < subAllocated.length; i++) {
      let oneSub = [];
      for (let j = 0; j < subAllocated[i].length; j++) {
        oneSub.push([...subAllocated[i][j]]);
      }
      subjectsAllocated.push([...oneSub]);
    }
    // regular subjects
    const fillRegularSubjectsInTT = () => {
      for (let i = 0; i < subjects.length; i++) {
        if (
          subPeriods[i] < weekDays.length ||
          Number.isNaN(subPeriods[i]) ||
          subPeriods[i] == null ||
          subPeriods[i] == 0
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
    return { subjectsAllocated, oneTT };
  };
  const completeOneSchoolTT = () => {
    setAllSchoolTT([...allSchoolTT, schoolTT]);
    showSection(1);
  };
  const [schoolTT, setSchoolTT] = useState<Array<TT>>([]);
  const [allSchoolTT, setAllSchoolTT] = useState<Array<Array<TT>>>([]);
  // const [iOfSchoolTT, setIOfTTInSchoolTT] = useState(0);
  // const [iOfSchoolTTInAllSchoolTTs, setiOfSchoolTTInAllSchoolTTs] = useState(0);
  const allSee = () => {
    console.log("schoolTT", schoolTT);
    console.log("allSchoolTT", allSchoolTT);
    console.log("subALl", subAllocated);
    console.log("subPEri", subPeriodsInWeek);
  };
  const allClear = () => {
    setAllSchoolTT([]);
    setSchoolTT([]);
    makeSubAll();
    setSubPeriodsInWeek(new Array(subjects.length).fill(0));
  };

  const deleteSubject = (i: number) => {
    subjects.splice(i, 1);
    setSubjects([...subjects]);
  };
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const showSection = (n: number) => {
    if (n == 1) {
      section2Ref.current!.style.right = "-100vw";
      section3Ref.current!.style.right = "-100vw";
      allClear();
    }

    if (n == 2) {
      section2Ref.current!.style.right = "0";
    }
    if (n == 3) {
      section3Ref.current!.style.right = "0";
    }
  };
  const section2Next = (n: number) => {
    if (n == 1) {
      setweekDaysFunc();
      makeSubAll();
      showSection(3);
      allClear();
    }
  };
  const pictureRef = useRef<HTMLDivElement | null>(null);
  const pictureOutputRef = useRef<HTMLImageElement | null>(null);

  async function takeCC() {
    // html2canvas(pictureRef.current!).then(function (canvas) {
    //   let imgData = canvas.toDataURL("image/png");
    //   let doc = new jsPDF();
    //   doc.addImage(imgData, "PNG", 10, 10);
    //   doc.save("timetable.pdf");
    // });
    // var doc = new jsPDF();
    // var requiredPages = 4;
    // for (var i = 0; i < requiredPages; i++) {
    //   doc.addPage();
    //   //doc.text(20, 100, 'Some Text.');
    // }
    // doc.save("hello.pdf");

    let doc = new jsPDF();
    for (let i = 0; i < schoolTT.length; i++) {
      if (i != 0) doc.addPage();
      let div = document.getElementsByClassName("oneTT")[i];
      let canvas = await html2canvas(div);
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();
      // let imgData = canvas.toDataURL("image/png", 0, 0, width, height);
      doc.addImage(canvas, "PNG", 0, 0, width, height/2);
    }
    doc.save("timetable.pdf");
  }
  return (
    <main className={styles.container}>
      <Header />
      <section className={styles.section1}>
        <h1>Subjects List</h1>
        <input type='text' onChange={(e) => setSubject(e.target.value)} />
        <button className={styles.addButton} onClick={handleAddSubject}>
          +
        </button>
        <div className={styles.allSubjects}>
          {subjects.length > 0 ? (
            subjects.map((value, index) => {
              return (
                <div className={styles.subData} key={index}>
                  <span>{index + 1}</span>
                  {value}
                  <button onClick={(e) => deleteSubject(index)}>Delete</button>
                </div>
              );
            })
          ) : (
            <div className={styles.noSubWarn}>No subjects Added</div>
          )}
        </div>
      </section>
      <section className={styles.section2} ref={section2Ref}>
        <h3>Give below info then click next</h3>
        <span>
          <label htmlFor='periodsADay'>Periods A Day: </label>
          <input
            type='number'
            id='periodsADay'
            onChange={(e) => setPeriodsADay(parseInt(e.target.value))}
          />
          {periodsADay}
        </span>
        <span>
          <label htmlFor='days'>Select working Days</label>
          <select ref={selectRef} id='days' multiple size={7}>
            <option value={"MON"}>MON</option>
            <option value={"TUE"}>TUE</option>
            <option value={"WED"}>WED</option>
            <option value={"THU"}>THU</option>
            <option value={"FRI"}>FRI</option>
            <option value={"SAT"}>SAT</option>
            <option value={"SUN"}>SUN</option>
          </select>
        </span>
        <button onClick={() => section2Next(1)}>Next</button>
      </section>
      <section className={styles.section3} ref={section3Ref}>
        <h3>Here, create timetable one class at a Time</h3>
        <h4>
          Periods In week: {subPeriodsInWeek.reduce((a, b) => a + b, 0)} /{" "}
          {weekDays.length * periodsADay}
        </h4>

        <br />
        <label htmlFor='cName'>Standard Name:</label>
        <input
          type='text'
          id='cName'
          onChange={(e) => setCName(e.target.value)}
        />
        <br />
        <label htmlFor='section'>Section:</label>
        <input
          type='text'
          id='section'
          onChange={(e) => setSection(e.target.value)}
        />
        <br />
        <div className={styles.section3Data}>
          {subjects.length >= 1 ? (
            subjects.map((value, index) => {
              return (
                <div key={index}>
                  <span>{value}</span>
                  <span>
                    <button onClick={() => handlePeriodNo(index, -1)}>
                      &lt;
                    </button>
                    <small>{subPeriodsInWeek[index]}</small>
                    <button onClick={() => handlePeriodNo(index, 1)}>
                      &gt;
                    </button>
                  </span>
                </div>
              );
            })
          ) : (
            <div>
              <h1>diiii</h1>
            </div>
          )}
        </div>
        <button onClick={generateTTLoop}>Create One Section TT</button>
        <button onClick={takeCC}>photo</button>
        <button onClick={completeOneSchoolTT}>
          Save This Set Of School TimeTables
        </button>
        <button onClick={allSee}>all c</button>

        <button onClick={allClear}>all clear</button>
        <article>
          {schoolTT.length == 0 ? (
            <div>no data</div>
          ) : (
            <>
              <div ref={pictureRef}>
                {schoolTT.map((value, i) => {
                  return (
                    <div key={i} className='oneTT'>
                      <div className={styles.oneTT}>
                        <h4>
                          Standard Name: {value.className}
                          <br />
                          Section: {value.section}
                        </h4>
                        <div className={styles.weekDayName}>
                          <span className={styles.fixWidth}>Days </span>
                          {weekDays.map((value) => {
                            return <span key={value}>{value}</span>;
                          })}
                        </div>
                        {value.tt.map((value, i1) => {
                          return (
                            <>
                              <div className={styles.ttRow} key={i1}>
                                {value.map((value, i2) => {
                                  return (
                                    <>
                                      {i2 == 0 ? (
                                        <span className={styles.fixWidth}>
                                          {i1 + 1}
                                        </span>
                                      ) : (
                                        <span></span>
                                      )}
                                      <span key={i2}>{value}</span>
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              )
            </>
          )}
          {/* <img ref={pictureOutputRef} /> */}
        </article>
      </section>
      <footer className={stylesF.footer}>
        <div onClick={() => showSection(1)}>Subjects</div>
        <div onClick={() => showSection(2)}>TimeTables</div>
      </footer>
    </main>
  );
};
export default Home;
