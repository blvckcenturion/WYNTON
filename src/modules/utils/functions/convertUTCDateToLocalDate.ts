function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(date.getTime());

  newDate.setUTCHours(date.getUTCHours()-4);
  newDate.setUTCMinutes(date.getUTCMinutes());
  newDate.setUTCSeconds(date.getUTCSeconds());
  newDate.setUTCMilliseconds(date.getUTCMilliseconds());

  return newDate;
}

export default convertUTCDateToLocalDate;