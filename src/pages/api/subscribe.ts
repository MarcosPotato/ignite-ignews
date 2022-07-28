import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react'
import { faunadb } from "../../services/fauna";
import { stripe } from "../../services/stipe";
import { query as q } from "faunadb";

interface User{
    ref: {
        id: string
    },
    data: {
        stripe_customer_id: string
    }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
    console.log("teste")
    if(request.method === "POST"){
        console.log(request)
        const session = await getSession({ req: request })

        const user = await faunadb.query<User>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if(!customerId){
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                //metadata:{}
            })
            
            await faunadb.query(
                q.Update(
                    q.Ref(
                        q.Collection("users"),
                        user.ref.id
                    ), {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: "required",
            line_items: [
                {
                    price: "price_1LPoqAJcnjImLdVAG970KAXw",
                    quantity: 1
                }
            ],
            mode: "subscription",
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            customer: customerId 
        })

        return response.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else{
        response.setHeader("Allow", "POST")
        return response.status(405).end("Method not allowed")
    }
}