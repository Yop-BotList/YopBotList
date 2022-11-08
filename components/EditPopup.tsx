import {MouseEventHandler} from "react";

export default function EditPopup(props: { hideFunc: MouseEventHandler, show: boolean, type: string }) {
    return (
        <div className={props.show ? "editPopup show" : "editPopup"}>
            <div className="content">
                {props.type === "notgoodid" ? (
                    <div className="error">
                        <h1>ID du bot invalide</h1>
                    </div>
                ) : props.type === "nobot" ? (
                    <div className="error">
                        <h1>Le bot n'existe pas</h1>
                    </div>
                ) : props.type === "noprefix" ? (
                    <div className="error">
                        <h1>Le préfixe du bot est invalide</h1>
                    </div>
                ) : props.type === "nodescription" ? (
                    <div className="error">
                        <h1>La description du bot est invalide</h1>
                    </div>
                ) : props.type === "notags" ? (
                    <div className="error">
                        <h1>Les tags du bot sont invalides</h1>
                    </div>
                ) : props.type === "prefixtoolong" ? (
                    <div className="error">
                        <h1>Le préfixe du bot est trop long</h1>
                    </div>
                ) : (
                    <div className="success">
                        <h1>Le bot a été édité avec succès</h1>
                    </div>
                )}
                <div className="close" onClick={props.hideFunc}>
                    <span></span>
                </div>
            </div>
        </div>
    )
}