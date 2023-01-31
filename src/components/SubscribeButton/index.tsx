import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJS } from '../../services/stripe-js'

import style from './style.module.scss'

export function SubscribeButton(){

    const { status, data } = useSession()
    const { push } = useRouter()

    const handleSubscribe = async() => {
        if(status !== "authenticated"){
            signIn('github')
            return
        }

        console.log("Autenticado")

        if(data.activeSubscription){
            push("/posts")
            return
        }

        try {
            const response = await api.post("/subscribe")

            console.log(response)

            const { sessionId } = response.data

            const stripe = await getStripeJS()
            console.log(stripe)

            await stripe.redirectToCheckout({ sessionId })

        } catch (error: any) {
            console.log(error)
            alert(error.messsage)
        }
    }

    return (
        <button className={ style.subscribeButton } type="button" onClick={ handleSubscribe }>
            Subscribe Now
        </button >
    )
}