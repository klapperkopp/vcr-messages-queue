import { INTERNAL_AUTH_KEY } from "../constants.js"

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
        if (internalAuthKey && internalAuthKey === INTERNAL_AUTH_KEY) {
            next()
        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        console.error("Internal auth error: ", e.message || e)
        res.sendStatus(401)
    }
}