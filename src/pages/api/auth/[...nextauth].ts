import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { query } from "faunadb"

import { faunadb } from "../../../services/fauna"

export default NextAuth({
  secret: process.env.NA_TOKEN,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user" },
      }   
    }),
  ],
  callbacks: {
    async session({ session, user, token }){
      try {
        const userActiveSubscription = await faunadb.query(
          query.Get(
            query.Intersection([
              query.Match(
                query.Index("subscription_by_user_ref"),
                query.Select(
                  "ref",
                  query.Get(
                    query.Match(
                      query.Index("user_by_email"),
                      query.Casefold(session.user.email)
                    ),
                  )
                )
              ),
              query.Match(
                query.Index("subscription_by_status"),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        }

      } catch (error) {
        console.log(error)
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("inserindo")
      console.log(user)

      try {
        await faunadb.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index("user_by_email"),
                  query.Casefold(user.email)
                )
              )
            ),
            query.Create(query.Collection("users"), {
              data: {
                email: user.email
              }
            }),
            query.Get(
              query.Match(
                query.Index("user_by_email"),
                query.Casefold(user.email)
              )
            )
          )
        )
        
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
  }
})