import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { useSession } from "next-auth/react"
import { SignInButton } from './index'

jest.mock("next-auth/react")

describe("Signin Button Component", () => {
    it("renders correctly when user is not authenticated", () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        })

        render( <SignInButton /> )
    
        expect(screen.getByText("Sign in with github")).toBeInTheDocument()
    })

    it("renders correctly when user is authenticated", () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: "John Doe",
                    email: "john.doe@example.com.br"
                },
                expires: "false"
            },
            status: "authenticated"
        })
        
        render( <SignInButton /> )
    
        expect(screen.getByText("John Doe")).toBeInTheDocument()
    })
})
