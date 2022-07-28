import { Client } from "faunadb";

export const faunadb = new Client({
    secret: process.env.FAUNA_DB_KEY
})