import Configs from "../statics/configs";
import { BoxConfig } from "../statics/entities";

export default class Box extends Phaser.GameObjects.Container{
    private _scene: Phaser.Scene;
    private _background!: Phaser.GameObjects.Image;
    private _text!: Phaser.GameObjects.Text;
    private _config: BoxConfig;


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
            this._config.width,
            this._config.height
        );

        this.add(this._background);


        this._text = this._scene.add.text(this._config.width / 2 - 10, -25, '?', { color: '#ffffff', fontSize: 75}).setScale(2)
        .setOrigin(this._config.origin.x, this._config.origin.y).setResolution(10);
        this._text.x -= this._text.displayWidth / 2;


        this.add(this._text);
    }


    public changeLevelText(newLevel: string): void{
        this._text.setText(newLevel);
    }

    public onScreenChange(): void{
        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000)
        const scale: number = Math.min(width, height);
 
        this.setPosition(0, innerHeight + 5 * scale);
        this.setScale(scale)
    }
}