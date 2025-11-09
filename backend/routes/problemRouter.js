import { Router } from 'express'
import { getAllPastProblems, getPastProblem } from '../controllers/problemController.js'

const problemRouter = Router()


problemRouter.get('/',getAllPastProblems)
problemRouter.get('/:id',getPastProblem)

export { problemRouter }

