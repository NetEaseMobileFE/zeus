export default function checkLogin() {
  const cookies = '; ' + document.cookie;
  const name = 'userId';
  const parts = cookies.split('; ' + name + '=');
  let value = '';
  if (parts.length === 2) {
    value = parts.pop().split(';').shift(); 
  }
  return value;
}
