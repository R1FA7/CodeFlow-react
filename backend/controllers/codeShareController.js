import { randomBytes } from 'crypto';
import CodeShare from "../models/codeShare.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { codeShareSchema } from '../validations/codeShare.validation.js';

export const storeCode = asyncHandler(async (req, res) => {
  const { description, language, code, stdin } = codeShareSchema.parse(req.body);

  // Generate unique share ID (8 characters)
  const shareId = randomBytes(4).toString('hex');

  const metaData = new CodeShare({
    shareId,
    description: description || `${language} code snippet`,
    language,
    code,
    stdin: stdin || '',
    author: req.user?.id || null // Optional: allow anonymous sharing
  });

  await metaData.save();
  
  res.status(201).json(
    new ApiResponse(
      201, 
      { 
        shareId: metaData.shareId,
        id: metaData._id 
      }, 
      'Code stored successfully'
    )
  );
});

export const getCode = asyncHandler(async (req, res) => {
  const { shareId } = req.params;

  const code = await CodeShare.findOne({ shareId })
    .select('description language code stdin author createdAt views')
    .populate('author', 'username email');

  if (!code) throw new ApiError(404, 'Code not found');

  // Increment view count
  code.views += 1;
  await code.save();

  res.status(200).json(
    new ApiResponse(200, code, 'Fetched code successfully')
  );
});

// Optional: Get user's shared codes
export const getMySharedCodes = asyncHandler(async (req, res) => {
  const codes = await CodeShare.find({ author: req.user.id })
    .select('shareId description language createdAt views')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, codes, 'Fetched your shared codes')
  );
});

// Optional: Delete shared code
export const deleteCode = asyncHandler(async (req, res) => {
  const { shareId } = req.params;

  const code = await CodeShare.findOne({ shareId, author: req.user.id });
  if (!code) throw new ApiError(404, 'Code not found or unauthorized');

  await code.deleteOne();
  res.status(200).json(
    new ApiResponse(200, null, 'Code deleted successfully')
  );
});