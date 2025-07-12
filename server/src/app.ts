import express from 'express'
import verificationEmail from './endpoints/verificationEmail.js'
import verificationCode from './endpoints/verificationCode.js'
import generateScript from './endpoints/generateScript.js'
import cors from 'cors'

const app=express()
app.use(express.json())
app.use(cors())

app.use('/verificationEmail', verificationEmail)
app.use('/verificationCode', verificationCode)
app.use('/generateScript', generateScript)
app.listen(3000,()=>{
    console.log(`App listening on port 3000`)
})