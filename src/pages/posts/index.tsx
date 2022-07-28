import { GetStaticProps } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { createClient } from '../../services/prismic'

import styles from './styles.module.scss'

type Post = {
    slug: string
    title: string
    excerpt: string
    updatedAt: string
}

interface PostsProps{
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
    return(
        <>
            <Head>Posts | IgNews</Head>

            <main className={ styles.container }>
                <div className={ styles.postList}>
                    { posts.map(post => (
                        <a key={ post.slug } href='#'>
                            <time>{ post.updatedAt }</time>
                            <strong>{ post.title }</strong>
                            <p>{ post.excerpt }</p>
                        </a>
                    )) }
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async({ previewData }) => {
    const prismic = createClient({ previewData })

    const response = await prismic.getAllByType("posts", {
        fetch: [
            "posts.title",
            "posts.content"
        ],
        pageSize: 100,
    })

    const posts = response.map(post => ({
        slug: post.uid,
        title: RichText.asText(post.data.title),
        excerpt: post.data.content.find(content => content.type === "paragraph")?.text ?? "",
        updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }))

    return ({
        props: { posts },
        revalidate: 60 * 60 //1h
    })
}