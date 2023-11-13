function isDST(date: Date) {
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== date.getTimezoneOffset(); 
}

function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  const offset = isDST(date) ? 4 : 5;
  const hours = date.getUTCHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export default convertUTCDateToLocalDate;