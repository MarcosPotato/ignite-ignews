import { GetStaticProps } from "next"
import Head from "next/head"
import { RichText } from "prismic-dom"
import Link from "next/link"
import { createClient } from "../../../services/prismic"

import styles from '../post.module.scss'
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/router"

interface Post{
    slug: string
    title: string
    content: string
    updatedAt: string
}

interface PostProps{
    post: Post
}

export default function Post({ post }: PostProps) {

    const { data, status } = useSession()
    const history = useRouter()

    useEffect(() => {
        if(status === "authenticated" && !!data?.activeSubscription){
            history.push(`/posts/${post.slug}`)
        }
    },[status, data])

    return (
        <>
            <Head>
                <title>{ post.title } | IgNews</title>
            </Head>
            <main className={ styles.container }>
                <article className={ styles.post}>
                    <h1>{ post.title }</h1>
                    <time>{ post.updatedAt }</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }} 
                    />
                    <div className={ styles.continueReading }>
                        Wanna cotinue reading?
                        <Link href="/">
                            <a>Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
} 

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async({ previewData, params }) => {
    const { slug } = params

    const prismic = createClient({ previewData })

    const response = await prismic.getByUID('posts', String(slug))

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0,3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }

    return {
        props: { post },
        revalidate: 60 * 30 //30min
    }
}