import {NavBarProps} from "../utils/types";
import Link from "next/link";
import {useRouter} from "next/router";
import {useState} from "react";

export default function NavBar(props: NavBarProps) {
    const router = useRouter()

    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => setShowMenu(!showMenu);

    return (
        <div className="navbar">
            <img src="https://cdn.discordapp.com/icons/782644006190055486/abebf32ccdda97f12f9d4aaaa0e064fc.webp" alt="logo" className="logo" />
            <div className="links">
                <Link href={"/"} className={router.pathname === "/" ? "isActive" : ""}>
                    Accueil
                    <span></span>
                </Link>
                <Link href={"/bots"} className={router.pathname.endsWith("/bot" || "/bots") ? "isActive" : ""}>
                    Bots
                    <span></span>
                </Link>
            </div>
            <div className="loginSection">
                {props.user ? (
                    <button className="profile" onClick={toggleMenu}>
                        <div className="infos">
                            <img alt="" src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png`} />
                            <p>{props.user.username}</p>
                        </div>

                        <div className={`menu ${showMenu ? "show" : ""}`}>
                            <Link href={"/profile"}>
                                <p>Profile</p>
                                <span></span>
                            </Link>
                            <Link href={"/api/logout"}>
                                <p>Logout</p>
                                <span></span>
                            </Link>
                        </div>
                    </button>

                ) : (
                    <div>
                        <a className="loginBtn" href="/api/oauth">Login</a>
                    </div>
                )}
            </div>
        </div>
    )
}