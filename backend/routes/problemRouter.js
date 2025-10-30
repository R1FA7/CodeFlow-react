import { Router } from 'express'
import { getAllPastProblems, getPastProblem } from '../controllers/problemController.js'

const problemRouter = Router()

problemRouter.get('/:id',getPastProblem)
problemRouter.get('/',getAllPastProblems)

export { problemRouter }

