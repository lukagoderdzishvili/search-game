import Configs from "../statics/configs";
import { LevelBackgroundConfig } from "../statics/entities";

export default class Level extends Phaser.GameObjects.Container{
    private _scene: Phaser.Scene;
    private _background!: Phaser.GameObjects.Image;
    private _config: LevelBackgroundConfig;


    constructor(scene: Phaser.Scene){
        super(scene, 0, 0);
        this._scene = scene;
        this._config = Configs.levelContainer;

        this._scene.add.existing(this);
        this.setScrollFactor(this._config.scrollfactor.x, this._config.scrollfactor.y);

        this._create();
        this.onScreenChange();
    }

    private _create(): void{
        this._background = this._scene.add
        .image(0, innerHeight, this._config.texture)
        .setOrigin(this._config.origin.x, this._config.origin.y)
        .setDisplaySize(
            this._config.width * (innerWidth / 1024),
            this._config.height * (innerHeight / 2000)
        );

        this.add(this._background);
    }

    public onScreenChange(): void{
        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000)
        const scale: number = Math.min(width, height);
        
        this._background
        .setPosition(0, innerHeight)
        .setDisplaySize(
            this._config.width * scale,
            this._config.height * scale
        );
    }
}