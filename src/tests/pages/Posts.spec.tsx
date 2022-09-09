import { render, screen } from "@testing-library/react";
import { createClient } from '../../services/prismic'
import Posts, { getStaticProps } from "../../pages/posts";
import { RichText } from "prismic-dom";
 
jest.mock("../../services/prismic")

jest.mock("prismic-dom", () => ({
    RichText: {
        asText: jest.fn()
    }
}))

const posts = [
    { slug: "my-new-posts", title: "My New Post", excerpt: "Post excerpt", updatedAt: "March, 10" }
]

describe("Posts page", () => {
    it("renders correctly", () => {
        render(
            <Posts posts={ posts } />
        )

        expect(screen.getByText("My New Post")).toBeInTheDocument()
    })

    it("loads initial data", async () => {
        const clientPrismicMocked = jest.mocked(createClient)
        const getTextMocked = jest.mocked(RichText.asText)

        clientPrismicMocked.mockReturnValueOnce({
            getAllByType: jest.fn().mockResolvedValueOnce([{
                uid: "my-new-posts",
                data: {
                    title: "My New Post",
                    content: [{
                        type: "paragraph",
                        text: "Post excerpt"
                    }]
                },
                last_publication_date: "04-01-2021"
            }])
        } as never)

        getTextMocked.mockReturnValueOnce("My New Post")

        const response = await getStaticProps({ previewData: "fake-preview-data" })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [
                        { 
                            slug: "my-new-posts", 
                            title: "My New Post", 
                            excerpt: "Post excerpt", 
                            updatedAt: "01 de abril de 2021" 
                        }
                    ]
                }
            })
        )
    })
})