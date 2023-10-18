import express, { json } from 'express'

const app = express()

import { corsMiddleware } from './middlewares/cors.js'

import { router } from './routes/frases.js'

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

//Middleware
app.use(express.json())

//Cors
//En cors se recibe como parametro un objeto
app.use(corsMiddleware())

//Router
app.use('/frases', router)


//Escuchar el puerto
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
