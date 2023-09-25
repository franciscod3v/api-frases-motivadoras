//Importamos modulo zod
const z = require('zod')

//Creamos objeto fraseSchema
//z.Object recibe como argumento un objeto que tendra que tener todos los atributos del objeto que tu deseas validar
const fraseSchema = z.object({
    frase: z.string({
        invalid_type_error: "La frase debe ser un string",
        required_error: "La frase es requerida"
    }),
    autor: z.string({
        invalid_type_error: "El autor debe ser un string",
        required_error: 'El autor es requerido'
    }),
    anio: z.number().int().max(2023),
    claves: z.array(
        z.enum([
        'exito', 'motivación', 'perseverancia', 'superación', 'actitud', 'sueños', 'esperanza', 'trabajo', 'pasión', 'logros', 'suerte', 'preparación', 'felicidad', 'fracaso', 'oportunidad', 'vida', 'aventura', 'determinación', 'trabajo duro', 'genialidad', 'paciencia']),
        {
            invalid_type_error: 'Las palabras claves deben estar en el arreglo',
            required_error: 'Las palabras claves son requeridas'
        })
})

function validarFrases(input) {
    return fraseSchema.safeParse(input)
}

function validarParcialmenteFrases(input) {
    return fraseSchema.partial().safeParse(input)
}

module.exports = {
    validarFrases,
    validarParcialmenteFrases
}
