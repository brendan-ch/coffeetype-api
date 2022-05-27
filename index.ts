import express from 'express';
import bodyParser from 'body-parser';

import update from './src/api/get/update';
import createRoom from './src/api/post/createRoom';
import exit from './src/api/post/exit';
import join from './src/api/post/join';
import start from './src/api/post/start';
import testData from './src/api/post/testData';

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.get('/api/get/update', update);

app.post('/api/post/createRoom', createRoom);
app.post('/api/post/exit', exit);
app.post('/api/post/join', join);
app.post('/api/post/start', start);
app.post('/api/post/testData', testData);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
