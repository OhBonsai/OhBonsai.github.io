
import {nextPage, PAGE_ACTION, useStore} from "../stores.jsx";
import styles from "../index.css"
import {useSpring, animated} from "@react-spring/web";

export default function Hud() {

    const {
        currentPage,
    } = useStore()

    const springs = useSpring({
        from: {
            strokeDashoffset: 120
        },
        to: {
            strokeDashoffset: 10
        },
        config: {
            duration: 1000
        },
        loop: true,
    });
    return <>
        <div className={"next-container"} onClick={()=>{nextPage(PAGE_ACTION.NEXT)}}>
            <svg  viewBox="0 0 1024 1024" className={"next-icon"} >
                <path
                    d="M609.706667 609.706667L554.666667 665.173333V256a42.666667 42.666667 0 0 0-85.333334 0v409.173333l-55.04-55.466666a42.666667 42.666667 0 0 0-60.586666 60.586666l128 128a42.666667 42.666667 0 0 0 14.08 8.96 40.106667 40.106667 0 0 0 32.426666 0 42.666667 42.666667 0 0 0 14.08-8.96l128-128a42.666667 42.666667 0 0 0-60.586666-60.586666z"
                    p-id="4183" fill="#ffffff"></path>
                <path
                    d="M512 42.666667a469.333333 469.333333 0 1 0 469.333333 469.333333A469.333333 469.333333 0 0 0 512 42.666667z m0 853.333333a384 384 0 1 1 384-384 384 384 0 0 1-384 384z"
                    p-id="4184" fill="#ffffff"></path>
            </svg>
        </div>

        {/*<div className={"page-base next"} onClick={()=>{nextPage(PAGE_ACTION.NEXT)}}>*/}
        {/*    {currentPage === 5 ? "CONTACT": "NEXT"}*/}
        {/*</div>*/}
    </>
}
