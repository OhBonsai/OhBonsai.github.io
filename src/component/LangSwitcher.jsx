import {toggleLang, useStore} from "../stores.jsx";

export default function LangSwitcher() {

    return <>
        <label className="switch">
            <input type="checkbox" onClick={()=>{toggleLang()}}/>
                <span className="slider"/>
            <div className={"langtext langtexten"}>EN </div>
            <div className={"langtext langtextzh"}>CN </div>
        </label>
    </>

}
