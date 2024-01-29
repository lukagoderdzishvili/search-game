import Avatar from "../game_objects/avatar";
import Controller from "../game_objects/controller";
import Configs from "../statics/configs";
import Box from "../game_objects/box";

interface CustomInputPlugin extends Phaser.Input.InputPlugin {
    initialX?: number;
    initialY?: number;
    lastX?: number;
    lasyY: number;
}
export default class MainScene extends Phaser.Scene{
    private _background!: Phaser.GameObjects.Image;
    private _collectedContainer!: Box;
    private _avatarContainer!: Avatar;

    private _controller!: Controller;


    private _currentLevel: number = 1;

    private _croissant!: Phaser.Physics.Arcade.Image;
    private _croissant_key!: Phaser.Physics.Arcade.Image;

    
    private _dog_bone!: Phaser.Physics.Arcade.Image;
    private _dog_bone_key!: Phaser.Physics.Arcade.Image;

    
    private _tnt!: Phaser.Physics.Arcade.Image;
    private _tnt_key!: Phaser.Physics.Arcade.Image;

    private _isDraggingKey: boolean = false;

    private _customInput!: CustomInputPlugin;

    constructor(){
        super({ key: 'MainScene' });
    }


    public create(): void{
        this._addBackground();
        this._drawCroissant();
        this._drawDogBone();
        this._drawTnt();
       
        this._collectedContainer = new Box(this);
        this._avatarContainer = new Avatar(this);
        this._controller = new Controller(this, this._controllerCallback);
        
        // Define the specific point on the original background size
        const originalPoint = new Phaser.Math.Vector2(4945 / 2.5, 2781 / 2.5);

        // Convert the point to the scaled background size
        const scaledPoint = new Phaser.Math.Vector2(originalPoint.x * this._background.scaleX, originalPoint.y * this._background.scaleY);

        this.cameras.main.pan(scaledPoint.x, scaledPoint.y, 1000, 'Power2');

        // Set camera bounds to match the scaled background size
        this.cameras.main.setBounds(0, 0, this._background.width * this._background.scaleX, this._background.height * this._background.scaleY);
   

        // Enable swipe/pan for the background image
        this._customInput = this.input as CustomInputPlugin;

        // Enable swipe/pan for the background image
         this.input.on('pointerdown', (pointer: any) => {
            // Store the initial pointer position for calculating the swipe distance
            if(this._isDraggingKey){

            }
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;
            
        });

        this.input.on('pointermove', (pointer: any) => {
            // Calculate the swipe distance
            if(!pointer.isDown || this._isDraggingKey)return;
            
            const deltaX = pointer.x - this._customInput.initialX!;
            const deltaY = pointer.y - this._customInput.initialY!;
            
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

            // Adjust the camera position based on the swipe distance
            this.cameras.main.scrollX -= deltaX;
            this.cameras.main.scrollY -= deltaY;

            // Set camera bounds to match the scaled background size
            this.cameras.main.setBounds(0, 0, this._background.width * this._background.scaleX, this._background.height * this._background.scaleY);
        });

    }

    private _drawCroissant(): void{
        this._croissant = this.physics.add.image(2000 * this._background.scaleX, 840 * this._background.scaleY, 'croissant_2')
        .setScale(this._background.scale);

        this._croissant_key = this.physics.add
        .image(2820 * this._background.scaleX, 1940 * this._background.scaleY, 'croissant_1')
        .setScale(this._background.scale)
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            if(this._croissant_key.getData('collected')){
                this._croissant_key.setOffset(this.cameras.main.scrollX * 2, this.cameras.main.scrollY * 2);
            }else{
                this._croissant_key.setOffset(0, 0);
            }
            this._isDraggingKey = true;
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

            this._croissant_key.x = dragX;
            this._croissant_key.y = dragY;
            

        }).on('dragend', (_pointer: any) => {

            this._isDraggingKey = false;
            this._collectedContainer.addItem(this._croissant_key);
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._croissant, this._croissant_key, () => {
            if(!this._isDraggingKey)return;
            this._croissant.destroy();
            this._croissant_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
    }

    private _drawDogBone(): void{
        this._dog_bone = this.physics.add.image(1685 * this._background.scaleX, 2170 * this._background.scaleY, 'dog_bone_2')
        .setScale(this._background.scale);

        this._dog_bone_key = this.physics.add
        .image(2035 * this._background.scaleX, 1460 * this._background.scaleY, 'dog_bone_1')
        .setScale(this._background.scale)
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            if(this._dog_bone_key.getData('collected')){
                this._dog_bone_key.setOffset(this.cameras.main.scrollX * 2, this.cameras.main.scrollY * 2);
            }else{
                this._dog_bone_key.setOffset(0, 0);
            }

            this._isDraggingKey = true;
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;
      

            this._dog_bone_key.x = dragX;
            this._dog_bone_key.y = dragY;
        }).on('dragend', (_pointer: any) => {
            this._isDraggingKey = false;
            this._collectedContainer.addItem(this._dog_bone_key);
            
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._dog_bone, this._dog_bone_key, () => {
            if(!this._isDraggingKey)return;
            this._dog_bone.destroy();
            this._dog_bone_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
        
    }


    private _drawTnt(): void{
        this._tnt = this.physics.add.image(2475 * this._background.scaleX, 2190 * this._background.scaleY, 'tnt_2')
        .setScale(this._background.scale);

        this._tnt_key = this.physics.add
        .image(1475 * this._background.scaleX, 2235 * this._background.scaleY, 'tnt_1')
        .setScale(this._background.scale)
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            if(this._tnt_key.getData('collected')){
                this._tnt_key.setOffset(this.cameras.main.scrollX * 2, this.cameras.main.scrollY * 2);
            }else{
                this._tnt_key.setOffset(0, 0);
            }
            this._isDraggingKey = true;
     
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

      

            this._tnt_key.x = dragX;
            this._tnt_key.y = dragY;
        }).on('dragend', (_pointer: any) => {
            this._isDraggingKey = false;
            this._collectedContainer.addItem(this._tnt_key);
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._tnt, this._tnt_key, () => {
            console.log('tnt');
            if(!this._isDraggingKey)return;
            this._tnt.destroy();
            this._tnt_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
    }
    
    private _checkLevelComplete(): void{
        
        this._isDraggingKey = false;
        if(this._currentLevel === 1){
            if(this._croissant.active || this._tnt.active || this._dog_bone.active)return;
            this._currentLevel = 2;
            this._avatarContainer.changeText('MISSION COMPLETED!')
        }
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
        if(!Boolean(this._croissant_key.getData('collected'))){
            this._croissant_key?.setPosition(2820 * this._background.scaleX, 1940 * this._background.scaleY).setScale(this._background.scale);
        }else{
            this._croissant_key?.setScale(this._background.scale);
        }

        this._dog_bone?.setPosition(1685 * this._background.scaleX, 2170 * this._background.scaleY).setScale(scale);  
        if(!Boolean(this._dog_bone_key.getData('collected'))){
            this._dog_bone_key?.setPosition(2035 * this._background.scaleX, 1460 * this._background.scaleY).setScale(this._background.scale);
        }else{
            this._dog_bone_key?.setScale(this._background.scale);
        }

        this._tnt?.setPosition(2475 * this._background.scaleX, 2190 * this._background.scaleY).setScale(scale);  
        if(!Boolean(this._tnt_key.getData('collected'))){
            this._tnt_key?.setPosition(1475 * this._background.scaleX, 2235 * this._background.scaleY).setScale(this._background.scale);
        }else{
            this._tnt_key?.setScale(this._background.scale);
        }
    }



    public onScreenChange(): void{
        console.log('resize event');
        this._resizeBackground();
        this._collectedContainer?.onScreenChange();
        this._avatarContainer?.onScreenChange();       
        this._controller?.onScreenChange(); 
        this._controllerCallback(0, 0);

    }
}