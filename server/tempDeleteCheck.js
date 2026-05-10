const http = require('http');
const url = 'http://localhost:5000/api/tasks/6a00d38e32498c7ace19e162';
const options = {
  method: 'DELETE',
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmEwMGQzNzAzMjQ5OGM3YWNlMTllMTYxIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc3ODQzOTAyNCwiZXhwIjoxNzc4NDQyNjI0fQ.EBmZS_bNKMPjFc7FikXpVor0BSJXwfJ5-rfhhaqZz5Y'
  }
};
const req = http.request(url, options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(data);
  });
});
req.on('error', err => console.error('error', err));
req.end();
