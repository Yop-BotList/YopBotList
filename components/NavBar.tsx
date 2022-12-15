import {NavBarProps} from "../utils/types";
import Link from "next/link";
import {useRouter} from "next/router";
import {useState} from "react";
import AddBotPopup from "./AddBotPopup";
import Image from "next/image";

export default function NavBar(props: NavBarProps) {
    const router = useRouter()

    const [showMenu, setShowMenu] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const toggleMenu = () => setShowMenu(!showMenu);
    const togglePopup = () => setShowPopup(!showPopup);

    // @ts-ignore
    return (
        <div className="navbar">
            <Image src="/yopbot.png" alt="logo" className="logo skeleton" width={50} height={50} />
            <div className="links">
                <Link href={"/"} className={router.pathname === "/" ? "isActive" : ""}>
                    Accueil
                    <span></span>
                </Link>
                <Link href={"/bots"} className={router.pathname.startsWith("/bots") ? "isActive" : ""}>
                    Bots
                    <span></span>
                </Link>
            </div>
            <div className="loginSection">
                {props.user ? (
                    <button className="profile" onClick={toggleMenu}>
                        <div className="infos">
                            <Image alt="" src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png`} width={50} height={50} draggable={false} />
                            <p>{props.user.username}</p>
                        </div>

                        <div className={`menu ${showMenu ? "show" : ""}`}>
                            <span className="arrowUp"></span>
                            <div className="addBot" onClick={togglePopup}>
                                <p>Ajouter un bot</p>
                                <span></span>
                                <span className="one"></span>
                            </div>
                            <Link href={`/users/${props.user.id}`}>
                                <p>Profile</p>
                                <span></span>
                                <span className="one"></span>
                            </Link>
                            <Link href={"/api/logout"}>
                                <p>Logout</p>
                                <span></span>
                                <span className="one"></span>
                            </Link>
                        </div>
                    </button>

                ) : (
                    <div>
                        <a className="loginBtn" href={`/api/oauth${props.redirectRoute ? `/${props.redirectRoute}` : ""}`}>Login</a>
                    </div>
                )}
            </div>
            <AddBotPopup showFunc={togglePopup} show={showPopup} />
        </div>
    )
}