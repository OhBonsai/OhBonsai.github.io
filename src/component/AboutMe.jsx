import CONSTANT from "../constant.js";
import {useStore} from "../stores.jsx";

export default function AboutMe() {
    const isZh = useStore((state)=>{return state.isZh})


    return (
        <section id="about">
            {
                isZh ?  <>

                    <p>朋友们总叫我【盆栽】，

                        我在13岁的时候看了
                        <a href={"https://book.douban.com/subject/1877531/"} target={"_blank"}>《殺手：風華絕代的正義》
                        </a>
                        。觉得里面的主角【欧阳盆栽】很酷，很正义，很有趣。 就一直叫这个名字了</p>

                    <p>我有多年的Devops经历,基本撸过几乎所有运维领域的系统</p>

                    <p>因为想尝试做一个数字孪生概念的运维产品，以解决数十万VM运维与监控的问题。 为此，我开始认真学习Three.js。
                        目前我还正在学习React前端框架, 同时还想尝试Rust在前端中的应用。
                    </p>


                    <p>日常中，我喜欢没有竞争对手的活动。例如做饭，跑步，滑板，滑雪</p>

                    <p>所以，交个朋友吧</p>
                    <p><a href={"https://github.com/OhBonsai"} target={"_blank"}>GitHub: ohbonsai</a></p>
                    <p><a href={"https://twitter.com/OhBonsai"} target={"_blank"}>Twitter: ohbonsai</a></p>

                    <div className={"qr-container"}>
                        <div className={"left"}>
                            <p>微信: fun-fafa</p>
                            <img src={CONSTANT.ROOT_URL + "/qrcode.jpg"} width={50} height={50}/>
                        </div>
                        <div className={"right"}>
                            <p>小红书: 9892291977</p>
                            <img src={CONSTANT.ROOT_URL  + "/qrcode2.jpg"} width={50} height={50}/>
                        </div>
                    </div>



                </> : <>


                    <p>Hello friend, I'm glad you made it till the end. I come from china, and I like
                        to be called "pern-tzai" by my friends. When i was 13 years old. I read a novel
                        <a href={"https://book.douban.com/subject/1877531/"} target={"_blank"}>《殺手：風華絕代的正義》</a>.
                        "pern-tzai" is  name of the protagonist. He is a cool, righteous and interesting killer.</p>

                    <p> I am currently working as an SRE at Alibaba Cloud. I want to design an
                        operations product basing the concept of digital twins to solve the maintenance and
                        monitoring challenges of over 100,000 VM around the world. SO I have started learning
                        some WEBGL programming skill.</p>


                    <p> In my daily life, I enjoy activities without competitors, such as hiking, cooking,
                        skateboarding and snowboarding. I am planning to go skiing in Japan during this winter(2023-2024).
                         By the way. I am currently working in Shenzhen. A city that is very close to HongKong.
                        Free to contact me if interested.</p>

                    <p><a href={"https://github.com/OhBonsai"} target={"_blank"}>GitHub: ohbonsai</a></p>
                    <p><a href={"https://twitter.com/OhBonsai"} target={"_blank"}>Twitter: ohbonsai</a></p>
                    <p><a href={"mailto:letbonsaibe@gmail.com"} target={"_blank"}>Mail: letbonsaibe@gmail.com</a></p>

                    <div className={"qr-container"}>
                        <div className={"left"}>
                            <p>WeChat: fun-fafa</p>
                            <img src={CONSTANT.ROOT_URL + "/qrcode.jpg"} width={50} height={50}/>
                        </div>
                        <div className={"right"}>
                            <p>XiaoHongShu: 9892291977</p>
                            <img src={CONSTANT.ROOT_URL  + "/qrcode2.jpg"} width={50} height={50}/>
                        </div>
                    </div>

                </>
            }



        </section>
    );
}
