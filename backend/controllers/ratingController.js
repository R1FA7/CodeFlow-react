import { Agenda } from '@hokify/agenda';
import dotenv from 'dotenv';
import Contest from '../models/contest.js';
import Submission from '../models/submission.js';
import Transaction from '../models/transaction.js';
import User from '../models/user.js';

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
  console.log(`Rating job completed for contest ${contestId}`);
})

const updateUserRatings = async (contestId)=>{
  const submissions = await Submission.find({contest:contestId}).select('submittedBy message')
  const userIds = [...new Set(submissions.map(s=>s.submittedBy.toString()))]

  console.log(`Processing ratings for ${userIds.length} users`); 

  // Check for existing transactions
  const existingTx = await Transaction.find({ contest: contestId, user: { $in: userIds } });
  const existingUsers = existingTx.map(tx => tx.user.toString());

  // Create new transactions for users who don't have one
  const newTx = userIds
    .filter(u => !existingUsers.includes(u))
    .map(u => ({ contest: contestId, user: u, delta: 0 }));

  if(newTx.length) {
    const insertedTx = await Transaction.insertMany(newTx);
    console.log(`Created ${insertedTx.length} new transactions`); // DEBUG
    
    // Add transaction IDs to user's transactions array
    for(const tx of insertedTx) {
      await User.findByIdAndUpdate(
        tx.user,
        { $addToSet: { transactions: tx._id } } 
      );
    }
  }
  
  // Update transaction deltas based on submissions
  const updates = submissions.map(sub=>({
    updateOne: {
      filter: {contest: contestId, user: sub.submittedBy},
      update: {$inc: {delta: sub.message==='Accepted'? 50 : -5}}
    }
  }))

  if(updates.length) {
    const result = await Transaction.bulkWrite(updates);
    console.log(`Updated ${result.modifiedCount} transactions`);
  }
  
  console.log(`User ratings updated`); // DEBUG
}

const updateProblemRatings = async (contestId)=>{
  const contest = await Contest.findById(contestId).populate('problems')
  if(!contest) return 

  for(const problem of contest.problems){
    const acceptedSubs = await Submission.find({
      problem: problem._id,
      message:'Accepted'
    }).populate('submittedBy', 'transactions')

    // Get user ratings 
    const usersRatings = await Promise.all(
      acceptedSubs.map(async (sub) => {
        const rating = await sub.submittedBy.rating();
        return Number(rating) || 0;
      })
    );

    const validRatings = usersRatings.filter(r => r > 0);
    
    if(validRatings.length > 0) {
      const modeRating = calculateModeByRange(validRatings, Math.round(Math.sqrt(validRatings.length)));
      problem.rating = modeRating || problem.rating;
      await problem.save();
      console.log(`Problem ${problem.id}: rating = ${problem.rating}`); 
    }
  }
  
  console.log(`Problem ratings updated`);
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

