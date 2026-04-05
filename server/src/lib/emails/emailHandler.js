import { resendClient, sender } from "../utils/resend.js"

export const sendWelcomeEmail = async (email, name) => {
    const {data, err} =  await resendClient.emails.send({
        from: `${sender}.name`,
        to: email,
        subject: "Welcome to ChatApp",
        html: `<h1>Welcome to ChatApp ${name}! <a href="http://localhost:3000">Click here to login</a></h1>`,
    })

    if(err) {
        console.log("Error while sending email: ",err)
    }

    console.log("data: ",data)
}