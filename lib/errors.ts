export const ERRORS = {
  UNAUTHORIZED: "Unauthorized",
  SOMETHING_WENT_WRONG: "Something went wrong",
  USER_NOT_FOUND: "User not found",
  STORY_NOT_FOUND: "Question not found",
  INVALID_REQUEST: "Invalid request",
  WALLET_MISSING: "Wallet missing",
  USER_ALREADY_EXISTS: "User already exists",
  PRIVY_WALLET_NOT_FOUND: "Privy wallet not found",
  USERNAME_INVALID_FORMAT:
    "Username should contain between 3 and 20 alphanumeric characters or underscores, and start with a letter",
  INVALID_SIGNATURE: "Invalid signature",
  USER_NOT_ON_FARCASTER: "User not on farcaster",
  TAGS_COUNT_INVALID: "You can only select up to 4 tags",
  NOT_FOUND: "Not found",
  INVALID_LENGTH: "Invalid length",
  SOCIAL_WALLET_ALREADY_LINKED: "This wallet is already linked to a different user",
} as const;