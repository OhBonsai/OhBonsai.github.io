import {toggleLang, useStore} from "../stores.jsx";

export default function LangSwitcher() {

    const isZh = useStore((state)=>{return state.isZh})

    return <>
        <label className="switch">
            <input type="checkbox" checked={!isZh} onClick={()=>{toggleLang()}}/>
                <span className="slider"/>
            <div className={"langtext langtexten"}>EN </div>
            <div className={"langtext langtextzh"}>中 </div>
        </label>
    </>

}
