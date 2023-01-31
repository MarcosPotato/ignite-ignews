import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { getStripeJS } from '../../services/stripe-js'
import { SubscribeButton } from './index'

jest.mock("next-auth/react")

jest.mock("../../services/api", () => {
    return {
        api: {
            post: jest.fn().mockResolvedValue({ data: { sessionId: "fake-session-ID" } })
        }
    }
})

jest.mock("../../services/stripe-js")

jest.mock("next/router", () => {
    return {
        useRouter(){
            return {
                push: jest.fn()
            }
        }
    }
})

jest.spyOn(require("next/router"), "useRouter")

describe("Subscribe Button Component", () => {

    const pushMock = jest.fn()
    const userRoutermock = jest.mocked(useRouter)

    userRoutermock.mockImplementation(() => ({
        push: pushMock
    }) as any)

    it("renders correctly", () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        })

        render( <SubscribeButton /> )
    
        expect(screen.getByText("Subscribe Now")).toBeInTheDocument()
    })

    it("redirects user to signin in when not authenticated", () => {
        const signInMocked = jest.mocked(signIn)
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        })

        render( <SubscribeButton /> )

        const subscribeButton = screen.getByText("Subscribe Now")

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })
    
    it("redirects to posts when user already has a subscription", () => {
        const useSessionMocked = jest.mocked(useSession)
        
        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: "John Doe",
                    email: "john.doe@example.com.br"
                },
                expires: "false",
                activeSubscription: true
            },
            status: "authenticated"
        })
        
        render( <SubscribeButton /> )

        const subscribeButton = screen.getByText("Subscribe Now")

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled()
    })

    it("redirects to payment page", () => {
        const useSessionMocked = jest.mocked(useSession)
        const getStripeJSMock = jest.mocked(getStripeJS)

        const redirectSubMock = jest.fn(() => Promise.resolve(undefined))

        getStripeJSMock.mockResolvedValueOnce({
            redirectToCheckout: redirectSubMock
        }as any)
        
        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: "John Doe",
                    email: "john.doe@example.com.br"
                },
                expires: "false",
                activeSubscription: false
            },
            status: "authenticated"
        })

        render( <SubscribeButton /> )

        const subscribeButton = screen.getByText("Subscribe Now")

        fireEvent.click(subscribeButton)

        expect(redirectSubMock).toHaveBeenCalledWith({ sessionId: "fake-session-ID" })
    })
})
