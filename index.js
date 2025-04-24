import express from "express"
import { INTERNAL_AUTH_KEY, MESSAGES_API_URL, PORT, QUEUE_MAX_INFLIGHT, QUEUE_MSG_PER_SEC, QUEUE_NAME } from "./constants.js"
import { vcr, Queue } from "@vonage/vcr-sdk"
import { internalAuth, vonageAuthExists } from "./middleware/auth.js"
import axios from "axios"
import crypto from "node:crypto"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function initQueue() {
    const session = vcr.createSession()
    const queueApi = new Queue(session)
    try {
        await queueApi.createQueue(QUEUE_NAME, "/executeQueue", { maxInflight: QUEUE_MAX_INFLIGHT, msgPerSecond: QUEUE_MSG_PER_SEC, active: true })
        console.log("New queue created: ", QUEUE_NAME)
        return queueApi
    } catch (e) {
        console.warn("Queue init warning: ", e?.response?.status || e)
        if (e?.response?.status == 409) {
            console.warn(`Queue ${QUEUE_NAME} already exists, therefore we can continue and use it: ${e?.response?.status || e?.message || e}`)
            return queueApi
        } else {
            return
        }
    }
}

const queueApi = await initQueue()
if (!queueApi) {
    console.error("Could not init queue.")
    process.exit(1)
}
if (!INTERNAL_AUTH_KEY) {
    console.error("Please define an INTERNAL_AUTH_KEY env var on the VCR instance.")
    process.exit(1)
}

app.get(["/", "/_/metrics", "/_/health"], (req, res) => {
    res.sendStatus(200)
})

app.post("/enqueue", vonageAuthExists, async (req, res) => {
    try {
        let temporaryMessageUuid = req.body["client_ref"] || crypto.randomUUID()
        await queueApi.enqueueSingle(QUEUE_NAME, { originalData: { ...req.body, client_ref: temporaryMessageUuid }, originalHeaders: req.headers, internalAuthKey: INTERNAL_AUTH_KEY, temporaryMessageUuid })
        res.status(200).json({ temporaryMessageUuid })
    } catch (e) {
        console.error("Error queuing up message: ", e?.response?.data || e?.message || e)
        res.sendStatus(e?.response?.status || 500)
    }
})

app.post("/executeQueue", internalAuth, async (req, res) => {
    try {
        let { originalData, originalHeaders, temporaryMessageUuid } = req.body
        let result = await axios.post(MESSAGES_API_URL, originalData, {
            headers: {
                Authorization: originalHeaders["authorization"],
                Accept: originalHeaders["accept"] || "*/*",
                "Content-Type": originalHeaders["content-type"] || "application/json"
            }
        })
        // save temporaryMessageUuid with uuid combo result.data.message_uuid
        res.sendStatus(result?.status || 200)
    } catch (e) {
        console.error("Error sending message from queue: ", e?.response?.data || e?.message || e)
        res.sendStatus(e?.response?.status || 500)
    }
})

app.listen(PORT, () => {
    console.info(`Server running on: ${vcr.getAppUrl() || `http://localhost:${PORT}`}`)
})