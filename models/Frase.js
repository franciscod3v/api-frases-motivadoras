import { readJSON } from "../utils.js"

const frasesJSON = readJSON('./frases.json')

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
}