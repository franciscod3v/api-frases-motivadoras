import { Router } from "express"

export const router = Router()

import { FrasesController } from "../controllers/FrasesController.js"

//GET para todas las frases o frases filtradas por query
router.get('/', FrasesController.getAll)

//GET de frases por Id
router.get('/:id', FrasesController.getByID)

//POST
router.post('/', FrasesController.create)

//PATH - Actualizamos una frase por su Id
router.patch('/:id', FrasesController.update)

//DELETE - Borramos una frase por su Id
router.delete('/:id', FrasesController.delete)