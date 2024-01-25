import Avatar from "../game_objects/avatar";
import Level from "../game_objects/level";
import Configs from "../statics/configs";

export default class MainScene extends Phaser.Scene{
    private _background!: Phaser.GameObjects.Image;
    private _levelContainer!: Level;
    private _avatarContainer!: Avatar;


    private _currentLevel: number = 1;

    constructor(){
        super({ key: 'MainScene' });
    }


    public create(): void{
        this._addBackground();
        this._levelContainer = new Level(this);
        this._avatarContainer = new Avatar(this);
        
        // Define the specific point on the original background size
        const originalPoint = new Phaser.Math.Vector2(4945 / 2.5, 2781 / 2.5);

        // Convert the point to the scaled background size
        const scaledPoint = new Phaser.Math.Vector2(originalPoint.x * this._background.scaleX, originalPoint.y * this._background.scaleY);

        this.cameras.main.pan(scaledPoint.x, scaledPoint.y, 1000);

        // Set camera bounds to match the scaled background size
        this.cameras.main.setBounds(0, 0, this._background.width * this._background.scaleX, this._background.height * this._background.scaleY);
    }


    private _addBackground(): void{
        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000)
        const scale: number = Math.min(width, height);
        this._background = this.add
        .image(0, 0, Configs.background.texture)
        .setOrigin(0, 0)
        .setScale(scale);
    }

    private _resizeBackground(): void{
        if(!this._background) return;

        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000)
        const scale: number = Math.min(width, height);
        this._background
        ?.setPosition(0, 0)
        ?.setScale(scale);

        // Update camera bounds on resize
        this.cameras.main.setBounds(0, 0, this._background.width, this._background.height);

    }

    public onScreenChange(): void{
        console.log('resize event');
        this._resizeBackground();
        this._levelContainer?.onScreenChange();
        this._avatarContainer?.onScreenChange();
        
     //   this.cameras.main.pan(0, 0);
        
    }
}