import {ChangeEventHandler, MouseEventHandler, useEffect, useState} from "react";

export default function AddBotPopup(props: { showFunc: MouseEventHandler, show: boolean }) {
    return (
        <div className={props.show ? "addBotPopup show" : "addBotPopup"}>
            <div className="content">
                <h1 className="title">Ajouter un bot</h1>
                <p className="description">Pour ajouter un bot, vous devez être le serveur Discord</p>
                <a className="joinBtn" href={process.env.GUILD_INVITE}>Rejoindre le serveur</a>
                <div className="close" onClick={props.showFunc}>
                    <span></span>
                </div>
            </div>
        </div>
    )
}