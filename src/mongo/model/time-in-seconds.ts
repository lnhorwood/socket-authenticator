export enum TimeInSeconds {
  SECOND = 1,
  MINUTE = TimeInSeconds.SECOND * 60,
  HOUR = TimeInSeconds.MINUTE * 60,
  DAY = TimeInSeconds.HOUR * 24,
  WEEK = TimeInSeconds.DAY * 7,
  YEAR = TimeInSeconds.WEEK * 52
}
