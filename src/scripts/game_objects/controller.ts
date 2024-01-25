import Configs from "../statics/configs";

export default class Controller{
    private _scene: Phaser.Scene;
    private _arrowClickCallback: (x: number, y: number) => void;

    private _leftArrow!: Phaser.GameObjects.Image;
    private _rightArrow!: Phaser.GameObjects.Image;
    private _topArrow!: Phaser.GameObjects.Image;
    private _bottomArrow!: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, arrowClickCallback: (x: number, y: number) => void){
        this._scene = scene;
        this._arrowClickCallback = arrowClickCallback;

        this._create();
        this._addEvents();
    }


    private _create(): void{
        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000)
        const scale: number = Math.min(width, height);
        const offset: number = 100 * scale;

        this._topArrow = this._scene.add
        .image(innerWidth / 2, offset, Configs.arrow.texture)
        .setScrollFactor(Configs.arrow.scrollfactor.x, Configs.arrow.scrollfactor.y)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale)
        .setInteractive({ cursor: 'pointer' });
        this._scene.add.existing(this._topArrow);

        
        this._bottomArrow = this._scene.add
        .image(innerWidth / 2, innerHeight - offset, Configs.arrow.texture)
        .setScrollFactor(Configs.arrow.scrollfactor.x, Configs.arrow.scrollfactor.y)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale)
        .setRotation(Phaser.Math.DegToRad(180))
        .setInteractive({ cursor: 'pointer' });
        this._scene.add.existing(this._bottomArrow);

        

        this._leftArrow = this._scene.add
        .image(offset, innerHeight / 2, Configs.arrow.texture)
        .setScrollFactor(Configs.arrow.scrollfactor.x, Configs.arrow.scrollfactor.y)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale)
        .setRotation(Phaser.Math.DegToRad(-90))
        .setInteractive({ cursor: 'pointer' });
        this._scene.add.existing(this._leftArrow);


        
        this._rightArrow = this._scene.add
        .image(innerWidth - offset, innerHeight / 2, Configs.arrow.texture)
        .setScrollFactor(Configs.arrow.scrollfactor.x, Configs.arrow.scrollfactor.y)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale)
        .setRotation(Phaser.Math.DegToRad(90))
        .setInteractive({ cursor: 'pointer' });
        this._scene.add.existing(this._rightArrow);
    }

    private _addEvents(): void{
        this._rightArrow.on('pointerdown', () => {
           this._arrowClickCallback(50, 0);
        }, this);

        this._leftArrow.on('pointerdown', () => {
            this._arrowClickCallback(-50, 0);
         }, this);

         this._topArrow.on('pointerdown', () => {
            this._arrowClickCallback(0, -50);
         }, this);

         this._bottomArrow.on('pointerdown', () => {
            this._arrowClickCallback(0, 50);
         }, this);
    }

    public onScreenChange(): void{
        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000)
        const scale: number = Math.min(width, height);

        const offset: number = 100 * scale;

        this._leftArrow
        .setPosition(offset, innerHeight / 2)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale);
        
        this._rightArrow
        .setPosition(innerWidth - offset, innerHeight / 2)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale);

        
        this._topArrow
        .setPosition(innerWidth / 2, offset)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale);

        
        this._bottomArrow
        .setPosition(innerWidth / 2, innerHeight - offset)
        .setDisplaySize(Configs.arrow.width * scale, Configs.arrow.height * scale);
    }
    
}