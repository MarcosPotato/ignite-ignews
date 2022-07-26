import style from './style.module.scss'

interface SubscribeButtonProps{
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps){
    return (
        <button className={ style.subscribeButton } type="button">
            Subscribe Now
        </button >
    )
}