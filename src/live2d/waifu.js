export class Waifu {

    constructor(el, modelDef) {
        this.loadLive2DCompleted = false;
        this.initLive2DCompleted = false;

        this.requestID = null;
        this.live2DModel = null;
        this.loadedImages = [];

        this.modelDef = modelDef;
        this.el = el;
        this.gl = null;

        this._loop = this.loop.bind(this);

        this.__init();
    }

    __init() {
        // 初始化live2D引擎
        Live2D.init();

        this.gl = this.el.getContext("webgl");
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

        this.getModel(this.modelDef.model);
        this.getTextures(this.modelDef.textures);
    }

    static createTexture(gl, image) {
        // 创建躯干
        let texture = gl.createTexture();

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    initLive2D() {
        // 初始化live2D模型
        this.initLive2DCompleted = true;
        for (let i = 0; i < this.loadedImages.length; i++) {
            let texName = Waifu.createTexture(this.gl, this.loadedImages[i]);
            this.live2DModel.setTexture(i, texName);
        }
        this.loadedImages = null;
        this.live2DModel.setGL(this.gl);
        let s = 2.0 / this.live2DModel.getCanvasWidth();
        let matrix4x4 = [s, 0, 0, 0, 0, -s, 0, 0, 0, 0, 1, 0, -1.0, 1, 0, 1];
        this.live2DModel.setMatrix(matrix4x4);
    }

    getModel(path) {
        // 请求model文件，.moc后缀的文件
        let ajax = new XMLHttpRequest();
        ajax.open("GET", path, true);
        ajax.responseType = "arraybuffer";
        ajax.onload = () => {
            if (ajax.status === 200) {
                this.live2DModel = Live2DModelWebGL.loadModel(ajax.response);
            }
        };
        ajax.send(null);
    }

    getTextures(textures) {
        // 请求textures文件
        let loadCount = 0;
        for (let i = 0; i < textures.length; i++) {
            this.loadedImages[i] = new Image();
            this.loadedImages[i].src = textures[i];
            this.loadedImages[i].onload = function () {
                if ((++loadCount) === textures.length) {
                    this.loadLive2DCompleted = true;
                }
            }.bind(this);
        }
    }

    loop() {
        // 开启循环动画
        this.__step();
        this.requestID = requestAnimationFrame(this._loop);
    }

    stop() {
        // 停止循环动画
        cancelAnimationFrame(this.requestID);
    }

    __step() {
        // 动画步进
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        if (!this.live2DModel || !this.loadLive2DCompleted)
            return;

        if (!this.initLive2DCompleted) {
            this.initLive2D();
        }

        let t = UtSystem.getTimeMSec() * 0.001 * 2 * Math.PI;
        let cycle = 3.0;
        this.live2DModel.setParamFloat("PARAM_ANGLE_X", 30 * Math.sin(t / cycle));

        this.live2DModel.update();
        this.live2DModel.draw();
    }
}