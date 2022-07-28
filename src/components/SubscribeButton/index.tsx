import { signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api'
import { getStripeJS } from '../../services/stripe-js'

import style from './style.module.scss'

interface SubscribeButtonProps{
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps){

    const { status } = useSession()

    const handleSubscribe = async() => {
        if(status !== "authenticated"){
            signIn('github')
            return
        }

        try {
            const response = await api.post("/subscribe")

            const { sessionId } = response.data

            console.log(sessionId)

            const stripe = await getStripeJS()

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