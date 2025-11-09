import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Submission from '../models/submission.js';
import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, signupSchema, updateMeSchema } from "../validations/user.validation.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000
}
export const signUp = asyncHandler(async(req,res)=>{
  const {name, username, email, password} = signupSchema.parse(req.body)

  const existing = await User.findOne({
    $or: [{email}, {username}]
  })

  if(existing) throw new ApiError(409, 'User already exists')

  const user = await User.create({
    name, username, email, password
  })

  const token = jwt.sign(
    {id: user._id},
    process.env.JWT_SECRET,
    {expiresIn:'1d'}
  )

  res.cookie('token', token, cookieOptions)

  const safeUser = user.toObject();
  delete safeUser.password;

  return res.status(201).json(new ApiResponse(201, safeUser, 'User Signed up successfully'))
})

export const login = asyncHandler(async(req,res)=>{
  const {login, password} = loginSchema.parse(req.body)

  const user = await User.findOne(
    login.includes('@') ? {email: login} : {username: login}
  )

  if(!user) throw new ApiError(404,'User not found')

  const matched = await bcrypt.compare(password, user.password)
  if(!matched) throw new ApiError(400, 'Invalid Credential')

  const token = jwt.sign(
    {id: user._id},
    process.env.JWT_SECRET,
    {expiresIn:'1d'}
  )

  res.cookie('token', token, cookieOptions)

  const safeUser = user.toObject();
  delete safeUser.password;

  return res.status(200).json(new ApiResponse(200, safeUser, 'User Signed in successfully'))
})

export const logout = asyncHandler(async(req,res)=>{
  res.clearCookie('token',{httpOnly:true})
  return res.status(200).json(new ApiResponse(200,null, 'Logged out successfully'))
})

export const getMe = asyncHandler(async(req,res)=>{
  const loggedUser = await User.findById(req.user.id)
  if(!loggedUser) throw new ApiError(401, 'No user')
  res.status(200).json(new ApiResponse(200,{
    name: loggedUser.name, username: loggedUser.username, email: loggedUser.email, admin:loggedUser.admin, setter: loggedUser.setter 
  }, 'Fetched user successfully'))
})
export const updateMe = asyncHandler(async (req, res) => {
  // Parse and validate - removes empty strings
  const cleanedBody = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );

  const validatedData = updateMeSchema.parse(cleanedBody);

  const loggedUser = await User.findById(req.user.id);
  if (!loggedUser) throw new ApiError(404, 'User not found');

  // Check if at least one field is being updated
  const hasUpdates = Object.keys(validatedData).some(
    key => key !== 'confirmPassword' && validatedData[key]
  );
  
  if (!hasUpdates) {
    throw new ApiError(400, 'Please provide at least one field to update');
  }

  // Check for duplicates only for fields being updated
  const { name, email, username, password, confirmPassword } = validatedData;
  console.log(validatedData)
  const orConditions = [];
  if (email) orConditions.push({ email });
  if (username) orConditions.push({ username });

  if (orConditions.length > 0) {
    const duplicate = await User.findOne({
      $or: orConditions,
      _id: { $ne: loggedUser._id }
    });
    
    if (duplicate) {
      const field = duplicate.email === email ? 'Email' : 'Username';
      throw new ApiError(409, `${field} already exists`);
    }
  }

  // Update only provided fields
  if (name) loggedUser.name = name;
  if (username) loggedUser.username = username;
  if (email) loggedUser.email = email;
  
  if (password) {
    if (password !== confirmPassword) throw new ApiError(400, 'Passwords do not match');
    loggedUser.password = password;
  }

  await loggedUser.save();
  
  const safeUser = loggedUser.toObject();
  delete safeUser.password;
  
  res.status(200).json(
    new ApiResponse(200, safeUser, "Profile updated successfully")
  );
});

export const getUserOverview=asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "transactions",
    model: "Transaction",
    populate: { path: "contest", model: "Contest", select: "contestDate" },
  });

  if (!user) throw new ApiError(404, "User not found");

  const transactions = user.transactions || []
  // Overview
  const solvedProblemsCount = Number(
    await Submission.countDocuments({ submittedBy: user._id, message: "Accepted" })
  ) || 0;

  const rating = Number(await user.rating()) || 0

  const overview = {
    rating,
    admin: user.admin,
    contestCount: user.transactions.length || 0,
    solvedProblemsCount,
  };

  // rating history
  let cumulative = 0;
  const ratingHistory = user.transactions.map((t) => {
    const delta = Number(t.delta) || 0
    cumulative += delta;
    return {
      rating: cumulative,
      contestDate: t.contest?.contestDate || null,
    };
  });

  const data = { overview, ratingHistory };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "User overview data fetched successfully"));
})
