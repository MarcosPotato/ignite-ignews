import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, signOut, useSession } from "next-auth/react"
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

    it("should be able to logout when user is authenticated", () => {
        const signOutMocked = jest.mocked(signOut)
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
        const button = screen.getByText("John Doe")
        fireEvent.click(button)

        expect(signOutMocked).toHaveBeenCalled()
    })

    it("should be able to logIn when user isn't authenticated", () => {
        const signInMocked = jest.mocked(signIn)
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        })
        
        render( <SignInButton /> )
        const button = screen.getByText("Sign in with github")
        fireEvent.click(button)

        expect(signInMocked).toHaveBeenCalled()
    })
})
