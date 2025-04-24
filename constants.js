export const PORT = process.env.VCR_PORT || process.env.PORT || 3000

export const VONAGE_API_KEY = process.env.VCR_API_ACCOUNT_ID || ""
export const VONAGE_API_SECRET = process.env.VCR_API_ACCOUNT_SECRET || ""
export const VONAGE_APP_ID = process.env.VCR_API_APPLICATION_ID || ""
export const VONAGE_APP_PKEY = process.env.PRIVATE_KEY || ""
export const DEBUG_MODE = process.env.VCR_DEBUG == "true" ? true : false

export const MESSAGES_API_URL = process.env.VONAGE_MESSAGES_API_URL || "https://api-eu.vonage.com/v1/messages"

export const QUEUE_NAME = `QUEUE_${DEBUG_MODE ? 'DEBUG_' : ''}${VONAGE_APP_ID.replaceAll("-", "_")}`
export const QUEUE_MAX_INFLIGHT = process.env.QUEUE_MAX_INFLIGHT ? parseInt(process.env.QUEUE_MAX_INFLIGHT) : 30
export const QUEUE_MSG_PER_SEC = process.env.QUEUE_MSG_PER_SEC ? parseInt(process.env.QUEUE_MSG_PER_SEC) : 30
