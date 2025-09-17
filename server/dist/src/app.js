import express from 'express';
import generateScript from './endpoints/generateScript.js';
import getVoiceList from './endpoints/getVoiceList.js';
import generateVideo from './endpoints/generateVideo.js';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hi there!');
});
app.use('/generateScript', generateScript);
app.use('/getVoiceList', getVoiceList);
app.use('/generateVideo', generateVideo);
// app.listen(3000,()=>{
//     console.log(`App listening on port 3000`)
// })
export default app;
