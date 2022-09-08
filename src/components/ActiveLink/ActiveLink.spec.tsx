import '@testing-library/jest-dom'

import { render } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: "/"
            }
        }
    }
})

describe("Active Link Component", () => {
    it("renders correctly", () => {
        const { debug, getByText } = render(
            <ActiveLink href="/" activeClassName='active'>
                <a>Home</a>
            </ActiveLink>
        )
    
        debug()
    
        expect(getByText("Home")).toBeInTheDocument()
    })
    
    it("adds active class if the link as currently", () => {
        const { debug, getByText } = render(
            <ActiveLink href="/" activeClassName='active'>
                <a>Home</a>
            </ActiveLink>
        )
    
        debug()
    
        expect(getByText("Home")).toHaveClass("active")
    })
})