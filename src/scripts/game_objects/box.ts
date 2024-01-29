import Configs from "../statics/configs";
import { BoxConfig } from "../statics/entities";

export default class Box extends Phaser.GameObjects.Container{
    private _scene: Phaser.Scene;
    private _background!: Phaser.GameObjects.Image;
    private _text!: Phaser.GameObjects.Text;
    private _config: BoxConfig;
    private _scale: number = Math.min(innerWidth / 1024, innerHeight / 2000);
    private _collected: Phaser.Physics.Arcade.Image[] = [];

    private _burgerIcon!: Phaser.GameObjects.Image;


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

        this._burgerIcon = this._scene.add.image(this._background.displayWidth - 70 * this._scale, -50 * this._scale, 'burger')
        .setDisplaySize(
            90 * this._scale,
            80 * this._scale
        ).setAlpha(0);
        this.add(this._burgerIcon)

        this._addText();
    }

    private _addText(text?: string): void{
        this._text = this._scene.add.text(
            this._background.displayWidth / 2,
            -this._background.displayHeight / 2,
            text ?? '?',
            { color: '#ffffff', fontFamily: 'cerapro', fontSize: 100 * this._scale}
        );
        this._text.x -= this._text.displayWidth / 2 + 20 * this._scale;
        this._text.y -= this._text.displayHeight / 2;


        this.add(this._text);
    }


    public addItem(item: Phaser.Physics.Arcade.Image): void{
        this._text?.destroy();
        const isBurger: boolean = item.getData('name') === 'burger';
        item.setData('collected', true);
        if(this._collected.findIndex(object => object.getData('name') === item.getData('name')) === -1 || isBurger){
            this._collected.push(item);
        }
        
        this._scene.add.tween({

            targets: item,
            scale: isBurger ? 0 : item.scale,
            scrollFactorX: 0,
            scrollFactorY: 0,
            x: isBurger ? this._background.getBounds().centerX : this._background.getBounds().left + (100 * (this._collected.findIndex(object => object.getData('name') === item.getData('name')) + 1) * this._scale),
            y: this._background.getBounds().centerY,
            duration: 300,

            onStart: () => {
               
                item.setDepth(this.depth + 1);
            },

            onComplete: () => {
                if(isBurger){
                    this._text?.destroy();
                    this._addText(this._collected.length.toString());
                }
            }
        });
    }

    public removeItem(item: Phaser.Physics.Arcade.Image): void{
        this._collected.filter(object => object.getData('name') !== item.getData('name'));
    }

    public removeAllItem(): void{
        this._collected.length = 0;
        this._collected = [];
    }

    public showBurgerIcon(): void{
        this._burgerIcon.setAlpha(1);
    }

    public onScreenChange(): void{
        this._scale = Math.min(innerWidth / 1024, innerHeight / 2000);
        console.log(this._scale);
        this._background.setDisplaySize(
            this._config.width * this._scale,
            this._config.height * this._scale
        );

        if(this._text?.active){
            this._text.setFontSize( 100 * this._scale);
            this._text.setPosition(this._background.displayWidth / 2, -this._background.displayHeight / 2);
            this._text.x -= this._text.displayWidth / 2 + 20 * this._scale;
            this._text.y -= this._text.displayHeight / 2;
        }

        this.setPosition(0, innerHeight + 5 * this._scale);

        if(this._collected.length > 0 && this._collected[0].getData('name') !== 'burger'){
            
            this._collected.forEach((item, index) => {
                item.setPosition(this._background.getBounds().left + ((100 * (index + 1)) * this._scale), this._background.getBounds().centerY)
            });
        }

        this._burgerIcon.setPosition(this._background.displayWidth - 70 * this._scale, -50 * this._scale)
        .setDisplaySize(
            90 * this._scale,
            80 * this._scale
        );
    }
}