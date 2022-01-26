interface Class {
  number: number;
  sections: Section[];
}

interface Section {
  timeTable: string[][];
}

const classes: Class[] = [];

const createClass = () => {
  classes.push({ number: 1, sections: [] });
};

export default {};
