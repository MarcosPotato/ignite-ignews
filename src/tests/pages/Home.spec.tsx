import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { stripe } from '../../services/stipe'

import Home, { getStaticProps } from "../../pages";

jest.mock("next-auth/react", () => {
    return{
        useSession(){
            return {
                data: null,
                status: "unauthenticated"
            }
        }
    }
})

jest.mock("next/router", () => {
    return {
        useRouter(){
            return {
                push: jest.fn()
            }
        }
    }
})

jest.mock("../../services/stipe")

jest.spyOn(require("next/router"), "useRouter")

describe("Home page", () => {
    const pushMock = jest.fn()
    const userRoutermock = jest.mocked(useRouter)

    userRoutermock.mockImplementation(() => ({
        push: pushMock
    }) as any)
    
    it("renders correctly", () => {
        render(
            <Home product={{ priceId: "fake price id", amount: "R$10,00" }} />
        )

        expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()
    })

    it("loads initial data", async() => {
        const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve) 

        retrieveStripePricesMocked.mockResolvedValueOnce({
            id: "fake-id",
            unit_amount: 1000
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: "fake-id",
                        amount: "$10.00"
                    }
                }
            })
        )
    })
})