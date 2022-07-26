import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import style from './style.module.scss'

export function SignInButton(){
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true)
    
    return isUserLoggedIn ? (
        <button className={ style.signInButton } type="button">
            <FaGithub color="#04d361" />
            teste
            <FiX style={{ marginLeft: "1rem" }} color="#737380" />
        </button >
    ): (
        <button className={ style.signInButton } type="button">
            <FaGithub color="#eba417" />
            Sign in with github
        </button >
    )
}