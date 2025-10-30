import { Router } from 'express'
import { createContest, getContest, getCurrentContest, getPastContests, getUpcomingContests } from '../controllers/contestController.js'
import { verifyJWT } from '../middlewares/verifyJWT.js'
import { verifySetter } from '../middlewares/verifySetter.js'

const contestRouter = Router()

contestRouter.get('/pastContests',getPastContests)
contestRouter.get('/currentContest', getCurrentContest)
contestRouter.get('/upcomingContests',getUpcomingContests)
contestRouter.get('/:id',getContest)
contestRouter.post('/',verifyJWT, verifySetter, createContest)

export { contestRouter }

