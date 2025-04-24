import { VONAGE_APP_PKEY } from "../constants.js"
import jwt from "jsonwebtoken"

export const vonageAuthExists = (req, res, next) => {
    try {
        if (req.headers["authorization"]) {
            next()
        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        console.error("Vonage auth error: ", e.message || e)
        res.sendStatus(401)
    }
}

export const internalAuth = (req, res, next) => {
    try {
        let { internalAuthKey } = req.body
        if (internalAuthKey && jwt.verify(internalAuthKey, VONAGE_APP_PKEY, { algorithms: ["RS256"] })) {
            next()
        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        console.error("Internal auth error: ", e.message || e)
        res.sendStatus(401)
    }
}