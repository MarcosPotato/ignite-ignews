import { query as q } from "faunadb"
import { faunadb } from "../../../services/fauna"
import { stripe } from "../../../services/stipe"

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    const userRef = await faunadb.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index("stripe_customer_id"),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    console.log(subscriptionData )

    if(createAction){
        console.log("criando")
        await faunadb.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )
    } else{
        console.log("atualizando")
        await faunadb.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index("subscription_by_id"),
                            subscriptionData.id
                        )
                    )
                ),
                { data: subscriptionData }
            )
        )
    }

}