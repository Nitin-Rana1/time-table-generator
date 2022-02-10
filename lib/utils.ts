export interface OneSectionData {
  className: string;
  section: string;
  subsPeriodsInWeek: Array<number>;
}
export interface CommonData {
  subjects: string[];
  periodsADay: number | undefined;
  weekDays: string[];
}
export interface TT {
  className: string;
  section: string;
  tt: Array<Array<string | null>>;
}
