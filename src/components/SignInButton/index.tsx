import { signIn, useSession, signOut } from 'next-auth/react'

import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import style from './style.module.scss'

export function SignInButton(){
    const { data, status } = useSession()
    
    return status === "authenticated" ? (
        <button 
            className={ style.signInButton } 
            type="button"
            onClick={() => signOut()}
        >
            <FaGithub color="#04d361" />
                { data.user.name }
            <FiX style={{ marginLeft: "1rem" }} color="#737380" />
        </button >
    ): (
        <button 
            className={ style.signInButton } 
            type="button"
            onClick={() => signIn("github")}
        >
            <FaGithub color="#eba417" />
            Sign in with github
        </button >
    )
}