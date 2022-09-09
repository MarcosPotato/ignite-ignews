import { render, screen } from "@testing-library/react";
import { createClient } from '../../services/prismic'
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { RichText } from "prismic-dom";
import { getSession } from "next-auth/react";
 
jest.mock("../../services/prismic")
jest.mock("next-auth/react")

jest.mock("prismic-dom", () => ({
    RichText: {
        asText: jest.fn(),
        asHtml: jest.fn()
    }
}))

const post = { 
    slug: "my-new-posts", 
    title: "My New Post", 
    content: "<p>Post content</p>", 
    updatedAt: "March, 10" 
}


describe("Post page", () => {
    it("renders correctly", () => {
        render(
            <Post post={ post }/>
        )

        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Post content")).toBeInTheDocument()
    })

    it("redirects user with no subscription is found", async () => {
        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: "my-new-posts"
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: "/",
                })
            })
        )
    })

    it("loads initial data", async () => {
        const clientPrismicMocked = jest.mocked(createClient)
        const getTextMocked = jest.mocked(RichText.asText)
        const getHtmlMocked = jest.mocked(RichText.asHtml)
        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: "fake-activit-sub"
        } as any)

        clientPrismicMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: "My New Post",
                    content: [{
                        type: "paragraph",
                        text: "Post content"
                    }]
                },
                last_publication_date: "04-01-2021"
            })
        } as never)

        getTextMocked.mockReturnValueOnce("My New Post")
        getHtmlMocked.mockReturnValueOnce("<p>Post content</p>")

        const response = await getServerSideProps({
            params: {
                slug: "my-new-posts"
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: { 
                        slug: "my-new-posts", 
                        title: "My New Post", 
                        content: "<p>Post content</p>", 
                        updatedAt: "01 de abril de 2021" 
                    }
                }
            })
        )
    })
})