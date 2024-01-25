export default class MainScene extends Phaser.Scene{
    private _background!: Phaser.GameObjects.Image;
    
    constructor(){
        super({ key: 'MainScene' });
    }


    public create(): void{
        this._drawBackground();
    }


    public onScreenChange(): void{
        console.log('resize event');
    }


    private _drawBackground(): void{
        this._background = this.add.image(0, 0, 'background');
    }
}