import { Router } from "express"

export const router = Router()

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const frasesJSON = require('../frases.json')

import { Frase } from "../models/Frase.js"

import { validarFrases, validarParcialmenteFrases } from "../schemas/fraseSchema.js"

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
router.post('/', async (req, res) => {
    //Usamos zod para validar que la peticion cumpla con los requerimientos para ser aceptada
    const result = validarFrases(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const nuevaFrase = await Frase.create({ input: result.data })

    //Mostramos la petición éxitosa
    res.status(201).json(nuevaFrase)

})

//PATH - Actualizamos una frase por su Id
router.patch('/:id', async (req, res) => {

    //Validar petición
    const result = validarParcialmenteFrases(req.body)

    if (!result.success) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    //Guardando Id
    const { id } = req.params

    //Buscando Id en Json
    const fraseActualizada = await Frase.update({ id, input: result.data })

    if (!fraseActualizada.valor) {
        return res.status(404).json(fraseActualizada.mesagge)
    } else {
        return res.json(fraseActualizada.message)
    }

})

//DELETE - Borramos una frase por su Id
router.delete('/:id', async (req, res) => {
    //Capturamos id
    const { id } = req.params

    //Buscamos Id
    const FraseIndex = await Frase.delete({ id })

    //Verificando si encontró el Id
    if (FraseIndex === false) {

        return res.status(404).json({ mesagge: 'Frase no encontrada' })

    } else {

        return res.json({ message: `Frase borrada.` })
    }

})