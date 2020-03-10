import './live2d/core/live2d.min';

import {Waifu} from "./live2d/waifu";


// 创建一个Waifu
new Waifu(
    document.getElementById("glCanvas"),
    {
        "type": "Live2D Model Setting",
        "name": "haru",
        "model": "model/haru/haru.moc",
        "textures": [
            "model/haru/haru.1024/texture_00.png",
            "model/haru/haru.1024/texture_01.png",
            "model/haru/haru.1024/texture_02.png"
        ]
    }
).loop();