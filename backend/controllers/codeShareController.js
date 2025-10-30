import CodeShare from "../models/codeShare.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { codeShareSchema } from '../validations/codeShare.validation.js';

export const storeCode = asyncHandler(async (req, res) => {
  const { description, language, code } = codeShareSchema.parse(req.body);

  const metaData = new CodeShare({
    description,
    language,
    author: req.user.id,
    code 
  });

  await metaData.save();
  res.status(201).json(new ApiResponse(201, { id: metaData._id }, 'Code stored successfully'));
});

export const getCode = asyncHandler(async (req, res) => {
  const code = await CodeShare.findById(req.params.id)
    .select('description language code author createdAt')
    .populate('author', 'username email');

  if (!code) throw new ApiError(404, 'Code not found');
  res.status(200).json(new ApiResponse(200, code, 'Fetched code successfully'));
});