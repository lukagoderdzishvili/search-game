import Configs from "../statics/configs";
import { AvatarConfig } from "../statics/entities";

export default class Avatar extends Phaser.GameObjects.Container{
    private _scene: Phaser.Scene;
    private _background!: Phaser.GameObjects.Image;
    private _config: AvatarConfig;
    private _dialog!: Phaser.GameObjects.Image;
    private _text!: Phaser.GameObjects.Text;

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
            this._config.width ,
            this._config.height
        );

        this.add(this._background);
        this.say();
    }

    public say(): void{
        this._dialog = this._scene.add.image(30, -this._config.height / 2, 'dialog')
        .setOrigin(this._config.origin.x, this._config.origin.y)
        .setDisplaySize(600, 0)
        .setAlpha(0)
        .setScale(1, 0);
        this.add(this._dialog);
    
        this._scene.add.tween({
            targets: this._dialog,
            scaleY: 1,
           // displayWidth: 600,
            displayHeight: 500,
            alpha: 1,
            duration: 500,
            ease: Phaser.Math.Easing.Cubic.InOut,
      
            onUpdate: () => {
                this._dialog.setPosition(30, -this._config.height / 2);
            },

            onComplete: () => {
                this._text = this._scene.add.text(-430, -this._background.height * 2, ['Distract the guards', 'and escape', 'using dynamite'], { color: '#000000', fontSize: 40, align: 'center'}).setResolution(100);
                this._text.x -= this._text.displayWidth / 2;
                this.add(this._text)
        
            }
        });
    }

    public changeText(text: string): void{
        if(this._text)this._text.destroy();
        this._text = this._scene.add.text(-400, -this._background.height * 2, text, { color: '#000000', fontSize: 40}).setResolution(100);
        this._text.x -= this._text.displayWidth / 2;
        this.add(this._text)
        console.log(this._text.text)
    }

    public onScreenChange(): void{
        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000)
        const scale: number = Math.min(width, height);
        this.setPosition(innerWidth - 30 * scale, innerHeight - 30 * scale);

        this.setScale(scale);
    }
}