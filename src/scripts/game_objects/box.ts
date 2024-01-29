import Configs from "../statics/configs";
import { BoxConfig } from "../statics/entities";

export default class Box extends Phaser.GameObjects.Container{
    private _scene: Phaser.Scene;
    private _background!: Phaser.GameObjects.Image;
    private _text!: Phaser.GameObjects.Text;
    private _config: BoxConfig;
    private _scale: number = Math.min(innerWidth / 1024, innerHeight / 2000);


    constructor(scene: Phaser.Scene){
        super(scene, 0, innerHeight);
        this._scene = scene;
        this._config = Configs.collectedContainer;

        this._scene.add.existing(this);
        this.setScrollFactor(this._config.scrollfactor.x, this._config.scrollfactor.y);

        this._create();
        this.onScreenChange();
    }

    private _create(): void{
        this._background = this._scene.add
        .image(0, 0, this._config.texture)
        .setOrigin(this._config.origin.x, this._config.origin.y)
        .setDisplaySize(
            this._config.width * this._scale,
            this._config.height * this._scale
        );

        this.add(this._background);


        this._text = this._scene.add.text(
            this._background.displayWidth / 2,
            -this._background.displayHeight / 2,
            '?',
            { color: '#ffffff', fontFamily: 'cerapro', fontSize: 100 * this._scale}
        );
        this._text.x -= this._text.displayWidth / 2 + 20 * this._scale;
        this._text.y -= this._text.displayHeight / 2;


        this.add(this._text);
    }

    public onScreenChange(): void{
        this._scale = Math.min(innerWidth / 1024, innerHeight / 2000);
        this.setPosition(0, innerHeight + 5 * this._scale);
    }
}