import { render, screen } from "@testing-library/react";
import { createClient } from '../../services/prismic'
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
 
jest.mock("../../services/prismic")
jest.mock("next-auth/react")

jest.mock("prismic-dom", () => ({
    RichText: {
        asText: jest.fn(),
        asHtml: jest.fn()
    }
}))

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

const post = { 
    slug: "my-new-posts", 
    title: "My New Post", 
    content: "<p>Post content</p>", 
    updatedAt: "March, 10" 
}


describe("Post preview page", () => {
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

        render( <Post post={ post }/> )

        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Post content")).toBeInTheDocument()
        expect(screen.getByText("Wanna cotinue reading?")).toBeInTheDocument()
    })

    it("redirects user to full post when user is subscribed", async () => {
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

        render( <Post post={ post }/> )

        expect(pushMock).toHaveBeenCalledWith("/posts/my-new-posts")
    })

    it("loads initial data", async () => {
        const clientPrismicMocked = jest.mocked(createClient)
        const getTextMocked = jest.mocked(RichText.asText)
        const getHtmlMocked = jest.mocked(RichText.asHtml)

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

        const response = await getStaticProps({
            previewData: "fake-preview-data",
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