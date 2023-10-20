import { Frase } from "../models/Frase.js"

import { validarFrases, validarParcialmenteFrases } from "../schemas/fraseSchema.js"

export class FrasesController {

    static async getAll(req, res) {

        const { anio, claves } = req.query

        const frasesFiltradas = await Frase.getAll({ anio, claves })

        if (frasesFiltradas.length === 0) {

            res.status(500).json({ mesagge: 'No encontramos frases con tu filtro' })

        } else {

            res.json(frasesFiltradas)

        }
    }

    static async getByID(req, res) {

        const { id } = req.params

        const frase = await Frase.getById({ id })

        if (frase) {
            return res.json(frase)
        }

        res.status(404).json({ mesagge: 'Frase no encontrada' })
    }

    static async create(req, res) {

        //Usamos zod para validar que la peticion cumpla con los requerimientos para ser aceptada
        const result = validarFrases(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const nuevaFrase = await Frase.create({ input: result.data })

        //Mostramos la petición éxitosa
        res.status(201).json(nuevaFrase)

    }

    static async update(req, res) {
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
    }

    static async delete(req, res) {
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
    }
}