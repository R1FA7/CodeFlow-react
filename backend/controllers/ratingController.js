import { Agenda } from '@hokify/agenda';
import dotenv from 'dotenv';
import Contest from '../models/contest.js';
import Submission from '../models/submission.js';
import Transaction from '../models/transaction.js';

dotenv.config()

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'jobs'
  }
})

agenda.define('rating', async(job)=>{
  const {contestId} = job.attrs.data
  console.log(`Running rating job for contest ${contestId}`);
  await updateUserRatings(contestId)
  await updateProblemRatings(contestId)
})

const updateUserRatings = async (contestId)=>{
  const submissions = await Submission.find({contest:contestId}).select('submittedBy message')
  const userIds = [...new Set(submissions.map(s=>s.submittedBy.toString()))]

  const existingTx = await Transaction.find({ contest: contestId, user: { $in: userIds } });
  const existingUsers = existingTx.map(tx => tx.user.toString());

  const newTx = userIds
    .filter(u => !existingUsers.includes(u))
    .map(u => ({ contest: contestId, user: u, delta: 0 }));

  if(newTx.length) await Transaction.insertMany(newTx)
  
  const updates = submissions.map(sub=>({
    updateOne: {
      filter: {contest: contestId, user: sub.submittedBy},
      update: {$inc: {delta: sub.message==='Accepted'? 50 : -5}}
    }
  }))

  if(updates.length) await Transaction.bulkWrite(updates)
}

const updateProblemRatings = async (contestId)=>{
  const contest = await Contest.findById(contestId).populate('problems')
  if(!contest) return 

  for(const problem of contest.problems){
    const acceptedSubs = await Submission.find({
      problem: problem._id,
      message:'Accepted'
    }).populate('submittedBy', 'rating')

    const usersRating = acceptedSubs.map(s=>s.submittedBy.rating).filter(r=>r!=null)
    const modeRating = calculateModeByRange(usersRating, Math.round(Math.sqrt(usersRating.length)))

    problem.rating = modeRating || problem.rating 
    await problem.save()
  }
}

const calculateModeByRange = (arr, rangeSize)=> {
  if(!arr.length || !rangeSize) return null 
  const mini = Math.min(...arr)
  const groups = {}
  for(const rating of arr){
    const group = Math.floor((rating - mini) / rangeSize);
    groups[group] = (groups[group] || 0) + 1;
  }

  let modeGroup = 0
  let maxCount = 0
  for(const key in groups){
    if(groups[key]>maxCount){
      maxCount = groups[key]
      modeGroup=parseInt(key)
    }
  }
  return modeGroup*rangeSize+mini
}

await agenda.start()

export { agenda, updateProblemRatings, updateUserRatings };
