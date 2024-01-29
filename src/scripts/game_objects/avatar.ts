import Configs from "../statics/configs";
import { AvatarConfig } from "../statics/entities";

export default class Avatar extends Phaser.GameObjects.Container{
    private _scene: Phaser.Scene;
    private _background!: Phaser.GameObjects.Image;
    private _config: AvatarConfig;
    private _dialog!: Phaser.GameObjects.Image;
    private _text!: Phaser.GameObjects.Text;
    private _scale: number = Math.min(innerWidth / 1024, innerHeight / 2000);

    constructor(scene: Phaser.Scene){
        super(scene, innerWidth, innerHeight);
        this._scene = scene;
        this._config = Configs.avatar;

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
        this.say();
    }

    public say(): void{
        this._dialog = this._scene.add.image(30 * this._scale, -this._background.displayHeight / 2, 'dialog')
        .setOrigin(this._config.origin.x, this._config.origin.y)
        .setDisplaySize(600 * this._scale, 0)
        .setAlpha(0);
        this.add(this._dialog);
    
        this._scene.add.tween({
            targets: this._dialog,
            scaleY: 1,
            displayHeight: 500 * this._scale,
            alpha: 1,
            duration: 500,
            ease: Phaser.Math.Easing.Cubic.InOut,
      
            onUpdate: () => {
                this._dialog.setPosition(-80 * this._scale, -this._background.displayHeight / 2 - 20 * this._scale);
            },

            onComplete: () => {
                 this._text = this._scene.add.text(-this._dialog.displayWidth / 2 - this._background.displayWidth / 2, -this._background.displayHeight - this._dialog.displayHeight / 2 - 25 * this._scale, ['Distract the guards', 'and escape', 'using dynamite'], { color: '#000000', fontSize: 20, fontFamily: 'cerapro', align: 'center'});
                 this._text.x -= this._text.displayWidth / 2 - 45 * this._scale;
                 this.add(this._text)
        
            }
        });

    }

    public changeText(text: string | string[]): void{
        if(this._text)this._text.destroy();
        this._text = this._scene.add.text(-this._dialog.displayWidth / 2 - this._background.displayWidth / 2, -this._background.displayHeight - this._dialog.displayHeight / 2 - 25 * this._scale, text, { color: '#000000', fontSize: 20, fontFamily: 'cerapro', align: 'center'});
        this._text.x -= this._text.displayWidth / 2 - 45 * this._scale;
        this.add(this._text)
    }

    public onScreenChange(): void{
        this._scale = Math.min(innerWidth / 1024, innerHeight / 2000);
        this.setPosition(innerWidth - 30 * this._scale, innerHeight - 30 * this._scale);
    }
}