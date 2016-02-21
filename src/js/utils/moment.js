export function format(date = Date.now()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = fixNum(d.getMonth() + 1);
  const day = fixNum(d.getDay());
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  return `${year}-${month}-${day}`;
}
function fixNum(num) {
  if (num < 10) {
    return '0' + num;
  }
}
