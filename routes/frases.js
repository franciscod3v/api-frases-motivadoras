import { Router } from "express"

export const router = Router()

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const frasesJSON = require('../frases.json')

import { randomUUID } from 'node:crypto'

import { Frase } from "../models/Frase.js"

//GET para todas las frases o frases filtradas por query
router.get('/', async (req, res) => {

    const { anio, claves } = req.query

    const frasesFiltradas = await Frase.getAll({ anio, claves })

    if (frasesFiltradas.length === 0) {
        res.json({ mesagge: 'No encontramos frases con tu filtro' })
    } else {
        res.json(frasesFiltradas)
    }
})

//GET de frases por Id
router.get('/:id', async (req, res) => {

    const { id } = req.params

    const frase = await Frase.getById({ id })

    if (frase) {
        return res.json(frase)
    }

    res.status(404).json({ mesagge: 'Frase no encontrada' })
})

//POST
router.post('/', (req, res) => {
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
router.patch('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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