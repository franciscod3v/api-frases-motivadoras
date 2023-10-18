import { readJSON } from "../utils.js"

const frasesJSON = readJSON('./frases.json')

import { randomUUID } from 'node:crypto'

export class Frase {

    static getAll = async ({ anio, claves }) => {

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

        return frasesFiltradas
    }

    static async getById({ id }) {

        const frase = frasesJSON.find(
            frase => frase.id === id
        )

        return frase
    }

    static async create({ input }) {

        //Creando la frase
        const nuevaFrase = {
            id: randomUUID(),
            ...input
        }

        //Agregando la nueva frase
        frasesJSON.push(nuevaFrase)

        return nuevaFrase
    }

    static async delete({ id }) {

        //Buscamos Id
        const FraseIndex = frasesJSON.findIndex(frase => frase.id === id)

        if (FraseIndex === -1) {
            return false
        }

        frasesJSON.splice(FraseIndex, 1)

        return true
    }

    static async update({ id, input }) {

        //Buscando Id en Json
        const FraseIndex = frasesJSON.findIndex(frase => frase.id === id)

        //Verificando si encontró el Id
        if (FraseIndex === -1) {
            return { valor: false, message: 'Frase no encontrada' }
        }

        //Creando la frase actualizada
        const fraseActualizada = {
            ...frasesJSON[FraseIndex],
            ...input
        }

        //Reemplazamos la frase desactualizada por la frase actualizada
        frasesJSON[FraseIndex] = fraseActualizada

        return { valor: true, message: fraseActualizada }
    }
}