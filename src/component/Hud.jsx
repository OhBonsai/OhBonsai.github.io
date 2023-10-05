
import {nextPage} from "../stores.jsx";

export default function Hud() {
    return <>
        <div id={"next"} onClick={()=>{nextPage(1)}}>
            Next
        </div>
        <div id={"pre"} onClick={()=>{nextPage(-1)}}>
            Pre
        </div>
    </>
}