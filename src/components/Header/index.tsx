import { SignInButton } from '../SignInButton'

import style from './style.module.scss'
import { ActiveLink } from '../ActiveLink'

export function Header(){
    return (
        <header className={ style.headerContainer }>
            <div className={ style.headerContent }>
                <img src="/images/logo.svg" alt="ig-news"/>
                <nav>
                    <ActiveLink 
                        href="/" 
                        activeClassName={ style.active }
                    >
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink
                        href="/posts" 
                        activeClassName={ style.active }
                    >
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
                <SignInButton />
            </div>
        </header>
    )
}