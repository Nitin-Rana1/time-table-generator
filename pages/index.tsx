import type { NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import styles from "../styles/Home.module.scss";
import stylesF from "../styles/Footer.module.scss";
import stylesSet from "../styles/Setting.module.scss";
import stylesHomeS from "../styles/HomeScreen.module.scss";
import stylesLastS from "../styles/LastScreen.module.scss";

//for pdf
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
//icons
import { VscThreeBars } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";
import { GrDocumentPdf } from "react-icons/gr";
//interfaces
import { OneSectionData, CommonData, TT } from "../lib/utils";

const Home: NextPage = () => {
  const [subjects, setSubjects] = useState<string[]>([]);
  // const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");

  const handleAddSubject = () => {
    if (subject == "") return;
    allClear();
    if (subjects.length > 0) {
      window.localStorage.setItem(
        "subjects",
        JSON.stringify([...subjects, subject])
      );
    }
    setSubjects([...subjects, subject]);
  };

  const [cName, setCName] = useState<string>("");
  const [section, setSection] = useState<string>("A");

  const [periodsADay, setPeriodsADay] = useState<number>(0);
  const [weekDays, setweekDays] = useState<string[]>([]);

  const [subPeriodsInWeek, setSubPeriodsInWeek] = useState<number[]>([]);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  // interface OneSectionData {
  //   className: string;
  //   section: string;
  //   subsPeriodsInWeek: Array<number>;
  // }
  // interface CommonData {
  //   subjects: string[];
  //   periodsADay: number | undefined;
  //   weekDays: string[];
  // }
  // interface TT {
  //   className: string;
  //   section: string;
  //   tt: Array<Array<string | null>>;
  // }
  const [subAllocated, setSubAllocated] = useState<
    Array<Array<Array<string | null>>>
  >([]);

  useEffect(() => {
    if (window.localStorage.getItem("subjects")) {
      let arr = window.localStorage.getItem("subjects");
      setSubjects(JSON.parse(arr!));
    }
  }, []);
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
    allClear();
  };
  const selectPeriodsADayRef = useRef<HTMLSelectElement | null>(null);
  const handlePeriodsADaySelect = () => {
    const options = selectPeriodsADayRef.current!.options;
    for (const option of options) {
      if (option.selected) {
        setPeriodsADay(parseInt(option.value));
        return;
      }
    }
    allClear();
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
    if (
      cName == "" ||
      subPeriodsInWeek.reduce((a, b) => a + b, 0) !=
        weekDays.length * periodsADay!
    ) {
      if (cName == "") setCreateOneTTWarnMsg("No standard/class name given!");
      else setCreateOneTTWarnMsg("Please fill all subjects periods!");
      showWarning(31);
      setTimeout(() => {
        showWarning(30);
      }, 2000);
      return;
    }

    showWarning(41);
    setTimeout(() => {
      showWarning(40);
    }, 2200);

    // Periods In week: {subPeriodsInWeek.reduce((a, b) => a + b, 0)} /
    // {weekDays.length * periodsADay!}

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
  // const completeOneSchoolTT = () => {
  //   setAllSchoolTT([...allSchoolTT, schoolTT]);
  //   showSection(1);
  // };

  const [schoolTT, setSchoolTT] = useState<Array<TT>>([]);
  const [allSchoolTT, setAllSchoolTT] = useState<Array<Array<TT>>>([]);
  // const [iOfSchoolTT, setIOfTTInSchoolTT] = useState(0);
  // const [iOfSchoolTTInAllSchoolTTs, setiOfSchoolTTInAllSchoolTTs] = useState(0);
  const allClear = () => {
    setAllSchoolTT([]);
    setSchoolTT([]);
    makeSubAll();
    setSubPeriodsInWeek(new Array(subjects.length).fill(0));
  };
  const [isSettingOpen, setIsSettingOpen] = useState<number>(0);
  const deleteSubject = (i: number) => {
    if (isSettingOpen == 1) return;
    allClear();
    subjects.splice(i, 1);
    window.localStorage.setItem("subjects", JSON.stringify([...subjects]));
    setSubjects([...subjects]);
  };
  const section1Ref = useRef<HTMLElement>(null);

  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const settingMenu = useRef<HTMLElement>(null);
  // const settingMenuAboutUs = useRef<HTMLElement>(null);
  // const settingMenuFeedBack = useRef<HTMLElement>(null);
  // const settingMenuContactUs = useRef<HTMLElement>(null);
  // const settingMenuHowToUse = useRef<HTMLElement>(null);
  // const settingMenuPremiumApp = useRef<HTMLElement>(null);

  const closeArticle = (n: number) => {
    //settingmenu itself
    if (n == 0) {
      // settingMenu.current!.style.left = "-100vw";
      settingMenu.current!.style.clipPath = "circle(0% at 0 0)";
      setIsSettingOpen(0);
    }
    //About Us
    // if (n == 1) {
    //   settingMenuAboutUs.current!.style.left = '-100vw';
    // }
  };
  const showArticle = (n: number) => {
    if (n == 0) {
      // settingMenu.current!.style.left = "0";
      settingMenu.current!.style.clipPath = "circle(100% at 50% 50%)";
      setIsSettingOpen(1);
    }
    //About Us
    // if (n == 1) {
    //   settingMenuAboutUs.current!.style.left = '0';
    // }
  };
  const footerUnderlineRef = useRef<HTMLDivElement>(null);
  //warnings ref
  const noSubWarnRef = useRef<HTMLDivElement>(null);
  const noPeriodWeekDatsWarnRef = useRef<HTMLDivElement>(null);
  const createOneTTWarnRef = useRef<HTMLDivElement>(null);
  const ttCreatedRef = useRef<HTMLDivElement>(null);
  const [createOneTTWarnMsg, setCreateOneTTWarnMsg] = useState(
    "Please fill all subjects periods"
  );

  const showWarning = (n: number) => {
    if (n == 11) noSubWarnRef.current!.style.transform = "scaleX(1)";
    else if (n == 10) noSubWarnRef.current!.style.transform = "scaleX(0)";
    else if (n == 21)
      noPeriodWeekDatsWarnRef.current!.style.transform = "scaleX(1)";
    else if (n == 20)
      noPeriodWeekDatsWarnRef.current!.style.transform = "scaleX(0)";
    else if (n == 31) createOneTTWarnRef.current!.style.transform = "scaleX(1)";
    else if (n == 30) createOneTTWarnRef.current!.style.transform = "scaleX(0)";
    else if (n == 41) ttCreatedRef.current!.style.transform = "scaleX(1)";
    else if (n == 40) ttCreatedRef.current!.style.transform = "scaleX(0)";
  };
  const showSection = (n: number) => {
    if (n == 1) {
      section1Ref.current!.style.left = "0";
      section2Ref.current!.style.right = "-100vw";
      section3Ref.current!.style.right = "-100vw";
      footSub.current!.style.color = "green";
      footTT.current!.style.color = "gray";
      closeArticle(0);
      footerUnderlineRef.current!.style.left = "0";
      return;
    }

    if (n == 2) {
      if (subjects.length == 0) {
        showWarning(11);
        setTimeout(() => showWarning(10), 2000);
        return;
      }
      section1Ref.current!.style.left = "0";
      section2Ref.current!.style.right = "0";
      footSub.current!.style.color = "gray";
      footTT.current!.style.color = "green";
      closeArticle(0);
      footerUnderlineRef.current!.style.left = "50vw";
      return;
    }
    if (n == 3) {
      section1Ref.current!.style.left = "-100vw";
      section2Ref.current!.style.right = "-100vw";

      section3Ref.current!.style.right = "0";
      closeArticle(0);
      return;
    }
  };
  const section2Next = (n: number) => {
    if (n == 1) {
      if (periodsADay == 0 || weekDays.length == 0) {
        showWarning(21);
        setTimeout(() => {
          showWarning(20);
        }, 2000);
        return;
      }

      makeSubAll();
      showSection(3);
    }
  };
  const pictureRef = useRef<HTMLDivElement | null>(null);

  async function makePDFAndDownloadIt() {
    let doc = new jsPDF();
    let width = doc.internal.pageSize.getWidth();
    let height = doc.internal.pageSize.getHeight();
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(22);
    doc.text("Thanks For using School TimeTable Generator App ", 20, 20);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    doc.text("Total Classes:", 20, 40);
    doc.text(schoolTT.length.toString(), width / 2, 40);

    doc.text("Total Periods A Day:", 20, 50);
    doc.text(periodsADay.toString(), width / 2, 50);

    doc.text("Working/Schooling Days:", 20, 60);
    doc.text("" + weekDays, width / 2, 60);

    doc.text("Total Periods a week:", 20, 70);
    doc.text((weekDays.length * periodsADay).toString(), width / 2, 70);

    doc.text("Total Subjects:", 20, 85);
    doc.text(subjects.length.toString(), width / 2, 85);

    let x = 95;
    doc.setFontSize(10);

    for (let i = 0; i < subjects.length; i++) {
      doc.text(i + 1 + ". " + subjects[i], 20, x);
      x += 4;
    }
    doc.setFontSize(16);

    doc.text("1/ " + (schoolTT.length + 1), 20, height - 15);

    for (let i = 0; i < schoolTT.length; i++) {
      doc.addPage();
      let div = document.getElementsByClassName("oneTT")[i];
      let canvas = await html2canvas(div as HTMLElement);
      // let imgData = canvas.toDataURL("image/png", 0, 0, width, height);
      doc.addImage(canvas, "PNG", 0, height / 4, width, height / 2);
      doc.text(i + 2 + "/ " + (schoolTT.length + 1), 20, height - 15);
    }
    doc.save("timetable.pdf");
  }
  const footSub = useRef<HTMLDivElement>(null);
  const footTT = useRef<HTMLDivElement>(null);
  const selectSectionRef = useRef<HTMLSelectElement>(null);
  const selectSection = () => {
    const options = selectSectionRef.current!.options;
    for (const option of options) {
      if (option.selected) {
        setSection(option.value);
        return;
      }
    }
    setSection("X");
  };
  const sectionList = [];

  for (let i = 65; i <= 80; i++) {
    sectionList.push(String.fromCharCode(i));
  }
  for (let i = 0; i <= 10; i++) {
    sectionList.push(i.toString());
  }
  return (
    <main className={styles.container}>
      <Header />
      <span onClick={() => showArticle(0)} className={stylesHomeS.settingIcon}>
        <VscThreeBars />
      </span>
      <section
        ref={section1Ref}
        className={stylesHomeS.section1}
        onClick={() => {
          closeArticle(0);
        }}
      >
        <h2>Subjects List</h2>
        <input type='text' onChange={(e) => setSubject(e.target.value)} />
        <button className={stylesHomeS.addButton} onClick={handleAddSubject}>
          +
        </button>
        <div className={stylesHomeS.allSubjects}>
          {subjects.length > 0 ? (
            subjects.map((value, index) => {
              return (
                <div className={stylesHomeS.subData} key={index}>
                  <span>{index + 1}.</span>
                  <span>{value}</span>
                  <span
                    className={stylesHomeS.closeButton}
                    onClick={(e) => deleteSubject(index)}
                  >
                    <TiDelete />
                  </span>
                </div>
              );
            })
          ) : (
            <div className={stylesHomeS.noSubWarn}>
              <div className={styles.warn} ref={noSubWarnRef}>
                Please Add Subjects First!!
              </div>
              No subjects Added Yet
              <br />
              <br />
              Please list all Subjects of School/College.
              <br />
              <br />
              <b>Note:-</b>
              <ul>
                <li>
                  Add Subject with Teacher Name like Maths By Mishra Sir or
                  MathsA, MathsB.
                </li>

                <li>
                  So that two classes can have a subject in same periods if
                  teachers are different.
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
      <section
        className={styles.section2}
        ref={section2Ref}
        onClick={() => {
          closeArticle(0);
        }}
      >
        <h3>Give below info then click next</h3>
        <span>
          <label htmlFor='periodsADay'>Periods A Day: </label>
          <select
            id='periodsADay'
            onChange={handlePeriodsADaySelect}
            ref={selectPeriodsADayRef}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
              (value, i) => {
                return (
                  <option key={value + i} value={value}>
                    {value}
                  </option>
                );
              }
            )}
          </select>
        </span>
        <span>
          <label htmlFor='days'>Select working Days</label>
          <select
            ref={selectRef}
            onChange={setweekDaysFunc}
            id='days'
            multiple
            size={7}
          >
            <option value={"MON"}>MON</option>
            <option value={"TUE"}>TUE</option>
            <option value={"WED"}>WED</option>
            <option value={"THU"}>THU</option>
            <option value={"FRI"}>FRI</option>
            <option value={"SAT"}>SAT</option>
            <option value={"SUN"}>SUN</option>
          </select>
        </span>
        <div className={styles.warn} ref={noPeriodWeekDatsWarnRef}>
          Complete above info!!
        </div>
        <button onClick={() => section2Next(1)} className={styles.sec2next}>
          Next
        </button>
      </section>
      <section
        className={stylesLastS.section3}
        ref={section3Ref}
        onClick={() => {
          closeArticle(0);
        }}
      >
        <h3>Create multiple Timetable for school</h3>
        <div
          className={`${styles.warn} ${styles.green} ${stylesLastS.warnn}`}
          ref={ttCreatedRef}
        >
          One class TimeTable created scroll down to see!
        </div>
        <div
          className={`${styles.warn} ${stylesLastS.warnn}`}
          ref={createOneTTWarnRef}
        >
          {createOneTTWarnMsg}
        </div>
        <div
          className={`${styles.warn} ${stylesLastS.warnn}`}
          ref={createOneTTWarnRef}
        >
          {createOneTTWarnMsg}
        </div>
        <h3 className={styles.textAlignCenter}>
          Periods In week: {subPeriodsInWeek.reduce((a, b) => a + b, 0)} /
          {weekDays.length * periodsADay!}
        </h3>
        <label htmlFor='cName'>Standard Name:</label>
        <input
          type='text'
          id='cName'
          onChange={(e) => setCName(e.target.value)}
        />
        <br />

        <label htmlFor='section'>Section:</label>
        <select
          className={stylesLastS.selectSection}
          ref={selectSectionRef}
          id='section'
          onChange={selectSection}
        >
          {sectionList.map((value, index) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
        <br />
        <br />

        <div className={stylesLastS.pdfButtonGroup}>
          <button onClick={generateTTLoop}>Create One TT</button>
          <button onClick={makePDFAndDownloadIt}>
            Download <GrDocumentPdf />
          </button>
          <button onClick={allClear}>Clear All</button>
        </div>
        <br />
        <div className={stylesLastS.section3Data}>
          {subjects.length >= 1 ? (
            subjects.map((value, index) => {
              return (
                <div key={index}>
                  <span className={styles.mrSmall}>{index + 1}. </span>

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
            <div></div>
          )}
        </div>
        <hr />

        <article>
          {schoolTT.length == 0 ? (
            <div className={stylesLastS.note}>
              Create timetable one at a time like 9-A, 9-B, 10-A, 10-B and so
              on. Plz select periods and click on create one time table button
            </div>
          ) : (
            <div ref={pictureRef}>
              {schoolTT.map((value, i) => {
                return (
                  <div key={i} className='oneTT'>
                    <h6 className={stylesLastS.pdfHeadings}>
                      Standard Name: {value.className}
                      <br />
                      Section: {value.section}
                    </h6>
                    <table className={stylesLastS.oneTT}>
                      <tr className={stylesLastS.weekDayName}>
                        <th>Periods</th>
                        {weekDays.map((value) => {
                          return <th key={value}>{value}</th>;
                        })}
                      </tr>
                      {value.tt.map((value, i1) => {
                        return (
                          <>
                            <tr className={stylesLastS.ttRow} key={i1}>
                              {value.map((value, i2) => {
                                return (
                                  <>
                                    {i2 == 0 ? (
                                      <>
                                        <th>{i1 + 1}</th>
                                        <td key={i2}>{value}</td>
                                      </>
                                    ) : (
                                      <td key={i2}>{value}</td>
                                    )}
                                  </>
                                );
                              })}
                            </tr>
                          </>
                        );
                      })}
                    </table>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>
      <article className={stylesSet.settingMenuArticle} ref={settingMenu}>
        {/* <h2>Setting</h2> */}
        {/* <div>View Ads To help Us</div> */}
        <div>Version 1.0.0</div>
        <div>
          About Us
          <p>We are Indian app developer team.</p>
        </div>
      </article>

      {/*
      <article
        className={stylesSet.settingMenuAboutUs}
        ref={settingMenuAboutUs}
      >
        <span onClick={() => closeArticle(1)}>
          <BiArrowBack />
        </span>
        <section className={stylesSet.style2}></section>

        <section className={stylesSet.one}>
          <h2 className={stylesSet.textAlignCenter}>Indian App Team NTECH</h2>
          <p>
            NTECH is Indian based app developer team, we at NTECH aims at
            providing apps that are helpful to you customers and do our best to
            provide you services that saves your time and effort.
          </p>
        </section>
        <h2 className={stylesSet.textAlignCenter}>Our Member</h2>
        <section className={stylesSet.two}>
          <div>
            <img src='i6.jpg' alt='men' />
            <caption>
              <div>John Doe</div>
              <div>CSS King</div>
            </caption>
          </div>
          <div>
            <img src='i4.jpg' alt='men' />
            <caption>
              <div>Sindy Doll</div>
              <div>SEO Expert</div>
            </caption>
          </div>
        </section>
      </article>
      */}
      <footer className={stylesF.footer}>
        <div onClick={() => showSection(1)} ref={footSub}>
          Subjects
        </div>
        <div onClick={() => showSection(2)} ref={footTT}>
          TimeTables
        </div>
        <div ref={footerUnderlineRef}></div>
      </footer>
    </main>
  );
};
export default Home;
