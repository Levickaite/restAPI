import express from 'express'
import apiRoutes from './routes/apiRoutes.js'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const app = express()
app.use(express.json())
app.use(express.static(path.join(_dirname, 'public')))

const dbURI = 'mongodb+srv://levickaiteindre314:G70R3vEMuxVPErvK@cluster0.4kff5sd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI)
    .then(result => {
        app.listen(3002);
        console.log('http://localhost:3002')
    })
    .catch(err => console.log(err))
app.set('view engine', 'ejs')

// routes
app.get('/', (req, res) => {res.render('home')});
app.use('/api', apiRoutes)
