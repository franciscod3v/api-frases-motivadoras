import express, { json } from 'express'

import { randomUUID } from 'node:crypto'

import { validarFrases, validarParcialmenteFrases } from './schemas/fraseSchema.js'

const app = express()

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const frasesJSON = require('./frases.json')

import cors from 'cors'

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

//Middleware
app.use(express.json())

//Cors
//En cors se recibe como parametro un objeto
app.use(cors({
    origin: (origin, callback) => {

        const ACCEPTED_ORIGINS = [
            'http://localhost:1234',
            'http://127.0.0.1:5500'
        ]

        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by Cors'))
    }
}))

//GET para todas las frases o frases filtradas por query
app.get('/frases', (req, res) => {
    const { anio, claves } = req.query

    let frasesFiltradas = frasesJSON

    if (claves) {
        frasesFiltradas = frasesFiltradas.filter(
            frase => frase.claves.some(
                c => c.toLowerCase() === claves.toLowerCase())
        )
    }

    if (anio) {
        frasesFiltradas = frasesFiltradas.filter(
            frase => frase.anio.toString() === anio.toString()
        )
    }

    if (frasesFiltradas.length === 0) {
        res.json({ mesagge: 'No encontramos frases con tu filtro' })
    } else {
        res.json(frasesFiltradas)
    }


})

//GET de frases por Id
app.get('/frases/:id', (req, res) => {
    const { id } = req.params

    const frase = frasesJSON.find(
        frase => frase.id === id
    )

    if (frase) {
        return res.json(frase)
    }

    res.status(404).json({ mesagge: 'Frase no encontrada' })
})

//POST
app.post('/frases', (req, res) => {
    //Usamos zod para validar que la peticion cumpla con los requerimientos para ser aceptada
    const result = validarFrases(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    //Creando la frase
    const nuevaFrase = {
        id: randomUUID(),
        ...result.data
    }

    //Agregando la nueva frase
    frasesJSON.push(nuevaFrase)

    //Mostramos la petición éxitosa
    res.status(201).json(nuevaFrase)

})

//PATH - Actualizamos una frase por su Id
app.patch('/frases/:id', (req, res) => {
    //Validar petición
    const result = validarParcialmenteFrases(req.body)

    if (!result.success) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    //Guardando Id
    const { id } = req.params

    //Buscando Id en Json
    const FraseIndex = frasesJSON.findIndex(frase => frase.id === id)

    //Verificando si encontró el Id
    if (FraseIndex === -1) {
        return res.status(404).json({ message: 'Frase no encontrada' })
    }

    //Creando la frase actualizada
    const fraseActualizada = {
        ...frasesJSON[FraseIndex],
        ...result.data
    }

    //Reemplazamos la frase desactualizada por la frase actualizada
    frasesJSON[FraseIndex] = fraseActualizada

    //Mostramos la frase actualizada
    return res.json(fraseActualizada)

})

//DELETE - Borramos una frase por su Id
app.delete('/frases/:id', (req, res) => {
    //Capturamos id
    const { id } = req.params

    //Buscamos Id
    const FraseIndex = frasesJSON.findIndex(frase => frase.id === id)

    //Verificando si encontró el Id
    if (FraseIndex === -1) {
        return res.status(404).json({ mesagge: 'Frase no encontrada' })
    } else {
        //Guardando la frase que se va a borrar para mostrarla
        const fraseABorrar = frasesJSON[FraseIndex]

        //Borrando la frase
        frasesJSON.splice(FraseIndex, 1)

        return res.json({ message: `Frase borrada: ${fraseABorrar.frase}` })
    }

})


//Escuchar el puerto
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
