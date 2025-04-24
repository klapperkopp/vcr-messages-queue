# Vonage Cloud Runtime -  Messages API - Rate Limit Extender & Queueing

This is an application built on Vonage Cloud runtime that will offer an API endpoint that takes in requests for Messages API and queues them up with the help of the Vonage Cloud Runtime. The benefit is that you can send messages at a rate of up to 2000 api requests/messages per second out of the box. The service will then queue it up for Vonage Messages API, which has a default rate limit of 40 api request/messages per second. You will not need to throttle your api requests anymore, even for larger campaigns.

To send messages to this instance, you will need to use the instance url under API endpoint /enqueue and your typical payload for Vonage Messages API. That means if you use Messages API today, all you need to do is to deploy this application and then change the API url you are sending messages to to this instance. Nothing else needs changing.

## Requirements
- You must have a [Vonage Developer Account](https://developer.vonage.com/)
- You must have the [Vonage Cloud Runtime CLI](https://developer.vonage.com/en/vonage-cloud-runtime/getting-started/working-locally) installed and configured

## Run Debug

To get started in debug:

1. Run `nvm use` or use node version 22.
2. Run `npm i` to install packages.
3. Edit vcr.yml and paste your own application-id for both instance and debug mode. They should be different app ids. You can create them via the [Vonage Application Dashboard](https://dashboard.nexmo.com/applications/new) or by running `vcr app create --name 'my-app-name'`.
4. Run `vcr debug` to start live debug mode. Use the url displayed in the terminal for debugging.

## Deploy

1. Follow the [Run Debug](#run-debug) steps 1. to 3. before you continue.
2. Run `vcr secret create -name "VCR_MESSAGES_QUEUE_INTERNAL_AUTH_KEY" -value "$(openssl rand -hex 64)"`
       - This generates a random secure hash for internal authentication purpose. This will automatically be used internally to authenticate the queue when it wants to send a message. 
       - You can rotate this at any time by running `vcr secret update -name "VCR_MESSAGES_QUEUE_INTERNAL_AUTH_KEY" -value "$(openssl rand -hex 64)"` (please make sure no messages are currently in the queue when you do this, otherwise they will fail).
3. Run `vcr deploy` to deploy the app and get your instance url.

## API Usage

See file [Desciption.md](./Description.md)