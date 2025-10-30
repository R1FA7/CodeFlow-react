import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Submission from '../models/submission.js';
import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, signupSchema, updateMeSchema } from "../validations/user.validation.js";

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

  res.cookie('token', token, {httpOnly: true})

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

  res.cookie('token', token, {httpOnly: true})

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
  res.status(200).json(new ApiResponse(200,{
    name: loggedUser.name, username: loggedUser.username, email: loggedUser.email
  }, 'Fetched user successfully'))
})

export const updateMe = asyncHandler(async (req, res) => {
  const { name, username, password, confirmPassword, email } = updateMeSchema.parse(req.body);

  const loggedUser = await User.findById(req.user.id);
  if (!loggedUser) throw new ApiError(404, 'User not found');

  // Check duplicates only for provided fields
  const orConditions = [];
  if (name) orConditions.push({ name });
  if (email) orConditions.push({ email });
  if (username) orConditions.push({ username });

  if (orConditions.length) {
    const duplicate = await User.findOne({
      $or: orConditions,
      _id: { $ne: loggedUser._id }
    });
    if (duplicate) {
      const message =
        duplicate.name === name
          ? "Name already exists"
          : duplicate.email === email
          ? "Email already exists"
          : "Username already exists";
      throw new ApiError(409, message);
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
  res.status(200).json(new ApiResponse(200, safeUser, "Profile updated successfully"));
});


export const getUserOverview=asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  const [solvedProblemsCount, rating] = await Promise.all([
    Submission.countDocuments({ submittedBy: user._id, message: "Accepted" }),
    user.rating()
  ]);

  const data = {
    rating,
    admin: user.admin,
    contestCount: user.transactions.length,
    solvedProblemsCount,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "User overview data fetched successfully"));
})

export const getRatingHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "transactions",
    model: "Transaction",
    populate: { path: "contest", model: "Contest", select: "contestDate" },
  });

  if (!user) throw new ApiError(404, "User not found");

  let cumulative = 0;
  const ratingTimeline = user.transactions.map((t) => {
    cumulative += t.delta;
    return {
      rating: cumulative,
      contestDate: t.contest?.contestDate || null,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, ratingTimeline, "User rating history fetched successfully"));
})