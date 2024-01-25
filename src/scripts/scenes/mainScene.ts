import Avatar from "../game_objects/avatar";
import Controller from "../game_objects/controller";
import Level from "../game_objects/level";
import Configs from "../statics/configs";

export default class MainScene extends Phaser.Scene{
    private _background!: Phaser.GameObjects.Image;
    private _levelContainer!: Level;
    private _avatarContainer!: Avatar;

    private _controller!: Controller;


    private _currentLevel: number = 1;

    private _croissant!: Phaser.GameObjects.Image;
    private _croissant_key!: Phaser.GameObjects.Image;

    constructor(){
        super({ key: 'MainScene' });
    }


    public create(): void{
        this._addBackground();
        this._drawCroissant();

       
        this._levelContainer = new Level(this);
        this._avatarContainer = new Avatar(this);
        this._controller = new Controller(this, this._controllerCallback);
        
        // Define the specific point on the original background size
        const originalPoint = new Phaser.Math.Vector2(4945 / 2.5, 2781 / 2.5);

        // Convert the point to the scaled background size
        const scaledPoint = new Phaser.Math.Vector2(originalPoint.x * this._background.scaleX, originalPoint.y * this._background.scaleY);

        this.cameras.main.pan(scaledPoint.x, scaledPoint.y, 1000, 'Power2');

        // Set camera bounds to match the scaled background size
        this.cameras.main.setBounds(0, 0, this._background.width * this._background.scaleX, this._background.height * this._background.scaleY);
   


    }

    private _drawCroissant(): void{
        this._croissant = this.add.image(2000 * this._background.scaleX, 840 * this._background.scaleY, 'croissant_2')
        .setScale(this._background.scale);

        this._croissant_key = this.add
        .image(2820 * this._background.scaleX, 1940 * this._background.scaleY, 'croissant_1')
        .setScale(this._background.scale)
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('drag', (_pointer: any, dragX: any, dragY: any) => {
            // Update the position of _test2 during drag
            if(
                2000 * this._background.scaleX - this._croissant.displayWidth <= dragX &&
                2000 * this._background.scaleX + this._croissant.displayWidth >= dragX && 
                840 * this._background.scaleY - this._croissant.displayHeight <= dragY &&
                840 * this._background.scaleY + this._croissant.displayHeight >= dragY  
            ){
                this._croissant.destroy();
                this._croissant_key.destroy();
            }
      

            this._croissant_key.x = dragX;
            this._croissant_key.y = dragY;
        });
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

    private _controllerCallback = (x: number, y: number): void => {
        if(!this._background) return;
        // Pan the camera to the new position
        this.cameras.main.scrollX += x;
        this.cameras.main.scrollY += y;
    
        // Set camera bounds to match the scaled background size
        this.cameras.main.setBounds(0, 0, this._background.width * this._background.scaleX, this._background.height * this._background.scaleY);
    }
    
    private _resizeBackground(): void{
        if(!this._background) return;

        const width: number = (innerWidth / 1024);
        const height: number = (innerHeight / 2000);
        const scale: number = Math.min(width, height);
        this._background
        ?.setPosition(0, 0)
        ?.setScale(scale);

        // Update camera bounds on resize
        this.cameras.main.setBounds(0, 0, this._background.width, this._background.height);

        this._croissant?.setPosition(2000 * this._background.scaleX, 840 * this._background.scaleY).setScale(scale);  
        this._croissant_key?.setPosition(2820 * this._background.scaleX, 1940 * this._background.scaleY).setScale(this._background.scale);

    }



    public onScreenChange(): void{
        console.log('resize event');
        this._resizeBackground();
        this._levelContainer?.onScreenChange();
        this._avatarContainer?.onScreenChange();       
        this._controller?.onScreenChange(); 
        this._controllerCallback(0, 0);

    }
}