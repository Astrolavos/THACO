function numToMonth(num) {
  switch (num) {
    case '01':
      return 'Jan';
    case '02':
      return 'Feb';
    case '03':
      return 'Mar';
    case '04':
      return 'Apr';
    case '05':
      return 'May';
    case '06':
      return 'Jun';
    case '07':
      return 'Jul';
    case '08':
      return 'Aug';
    case '09':
      return 'Sep';
    case '10':
      return 'Oct';
    case '11':
      return 'Nov';
    default:
      return 'Dec';
  }
}

export function formatDate(date) {
  if (!date) return null;
  date = date.toString();
  if (date.length !== 8) return date;
  const month = numToMonth(date.slice(4, 6));
  const day = date.slice(6);
  const year = date.slice(0, 4);
  return `${month} ${day}, ${year}`;
}

export function commas(x) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
