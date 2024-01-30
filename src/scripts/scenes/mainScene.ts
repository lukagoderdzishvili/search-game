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


    //LEVEL 1 OBJECTS
    private _croissant!: Phaser.Physics.Arcade.Image;
    private _croissant_key!: Phaser.Physics.Arcade.Image;
    private _dog_bone!: Phaser.Physics.Arcade.Image;
    private _dog_bone_key!: Phaser.Physics.Arcade.Image;
    private _tnt!: Phaser.Physics.Arcade.Image;
    private _tnt_key!: Phaser.Physics.Arcade.Image;

    //LEVEL 2 OBJECTS
    private _crowbar!: Phaser.Physics.Arcade.Image | null;
    private _crowbar_key!: Phaser.Physics.Arcade.Image;
    private _crowbarArrow!: Phaser.GameObjects.Image;
    private _donut!: Phaser.Physics.Arcade.Image | null;
    private _donut_key!: Phaser.Physics.Arcade.Image;
    private _rock!: Phaser.Physics.Arcade.Image | null;
    private _rock_key!: Phaser.Physics.Arcade.Image;


    //LEVEL 3 OBJECTS
    private _burger1!: Phaser.Physics.Arcade.Image;
    private _burger2!: Phaser.Physics.Arcade.Image;
    private _burger3!: Phaser.Physics.Arcade.Image;
    private _burger4!: Phaser.Physics.Arcade.Image;
    private _burger5!: Phaser.Physics.Arcade.Image;
    private _burger6!: Phaser.Physics.Arcade.Image;
    private _burger7!: Phaser.Physics.Arcade.Image;
    private _burger8!: Phaser.Physics.Arcade.Image;
    private _burger9!: Phaser.Physics.Arcade.Image;
    private _burger10!: Phaser.Physics.Arcade.Image;

    private _isDraggingKey: boolean = false;

    private _customInput!: CustomInputPlugin;

    private _pointerImage!: Phaser.GameObjects.Image;
    private _scale: number = Math.min(innerWidth / 1024, innerHeight / 2000);

    private _tutorialPointer!: Phaser.GameObjects.Image;
    private _tutorialTweenFirstPart!: Phaser.Tweens.Tween;
    private _tutorialTweenSecondPart!: Phaser.Tweens.Tween;
    private _tutorialCompleted: boolean = false;

    constructor(){
        super({ key: 'MainScene' });
    }


    public create(): void{
        this._addBackground();
      
        if(this._currentLevel === 1){
            this._drawCroissant();
            this._drawDogBone();
            this._drawTnt();
        }else if(this._currentLevel === 2){
            this._drawRock();
        }else if(this._currentLevel === 3){
            this._drawBurgers();
        }
       
        this._collectedContainer = new Box(this);
        this._avatarContainer = new Avatar(this, this._currentLevel);
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

        this._pointerImage = this.add
        .image(0, 0, 'pointer')
        .setAlpha(0)
        .setScrollFactor(0, 0)
        .setDepth(1000)
        .setDisplaySize(102 * this._scale, 77 * this._scale);

        this._firstLevelTutorial();
    }

    private _firstLevelTutorial(): void{
        this._tutorialPointer = this.add
        .image(this._dog_bone_key.x , this._dog_bone_key.y , 'pointer')
        .setDepth(800)
        .setDisplaySize(102 * this._scale, 77 * this._scale);

        this._tutorialTweenFirstPart = this.tweens.add({
            targets: this._tutorialPointer,
            scale: '/=2',
            repeat: 1,
            yoyo: true,
            duration: 500,

            onComplete: () => {
                this._tutorialTweenSecondPart = this.tweens.add({
                    targets: this._tutorialPointer,
                    x: () => this._dog_bone.x,
                    y: () => this._dog_bone.y,
                    duration: 2000,
                    repeat: 1,

                    onComplete: () => {
                        if(!this._tutorialCompleted){
                            this._tutorialPointer.destroy();
                            this._firstLevelTutorial();
                        }
                    }
                });
            }
        });
    }

    private _secondLevelTutorial(): void{
        this._tutorialPointer = this.add
        .image(this._rock_key.x , this._rock_key.y , 'pointer')
        .setDepth(800)
        .setDisplaySize(102 * this._scale, 77 * this._scale);

        this._tutorialTweenFirstPart = this.tweens.add({
            targets: this._tutorialPointer,
            scale: '/=2',
            repeat: 1,
            yoyo: true,
            duration: 500,

            onComplete: () => {
                this._tutorialTweenSecondPart = this.tweens.add({
                    targets: this._tutorialPointer,
                    x: () => (<Phaser.Physics.Arcade.Image>this._rock).x ,
                    y: () => (<Phaser.Physics.Arcade.Image>this._rock).y,
                    duration: 2000,
                    repeat: 1,

                    onComplete: () => {
                        if(!this._tutorialCompleted){
                            this._tutorialPointer.destroy();
                            this._secondLevelTutorial();
                        }
                    }
                });
            }
        });
    }

    private _thirdLevelTutorial(): void{
        this._tutorialPointer = this.add
        .image(this._burger1.x , this._burger1.y , 'pointer')
        .setDepth(800)
        .setDisplaySize(102 * this._scale, 77 * this._scale);

        
        this._tutorialTweenFirstPart = this.tweens.add({
            targets: this._tutorialPointer,
            scale: '/=2',
            repeat: -1,
            yoyo: true,
            duration: 500,
        });

    }

    private _drawCroissant(): void{
        this._croissant = this.physics.add.image(2000 * this._background.scaleX, 840 * this._background.scaleY, 'croissant_2')
        .setScale(this._background.scale);

        this._croissant_key = this.physics.add
        .image(2820 * this._background.scaleX, 1940 * this._background.scaleY, 'croissant_1')
        .setScale(this._background.scale)
        .setData('name', 'croissant')
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this._pointerImage.setPosition(pointer.x + this._pointerImage.displayWidth / 4, pointer.y + this._pointerImage.displayHeight / 4).setAlpha(1);

            if(this._croissant_key.getData('collected')){
                this._croissant_key.setOffset(this.cameras.main.scrollX * (1 / this._scale), this.cameras.main.scrollY * (1 / this._scale));
            }else{
                this._croissant_key.setOffset(0, 0);
            }
            this._isDraggingKey = true;
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

            this._croissant_key.x = dragX;
            this._croissant_key.y = dragY;
            

        }).on('dragend', (_pointer: any) => {
            this._pointerImage.setAlpha(0);
            this._isDraggingKey = false;
            if(this._collectedContainer.isEmpty(this._croissant_key.getData('name'))){
                this._collectedContainer.addItem(this._croissant_key);
            }
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._croissant, this._croissant_key, () => {
            if(!this._isDraggingKey)return;
            this._pointerImage.setAlpha(0);
            this._collectedContainer.removeItem(this._croissant_key);
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
        .setData('name', 'bone')
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this._tutorialCompleted = true;
            this._tutorialPointer?.destroy();
            this._tutorialTweenFirstPart?.destroy();
            this._tutorialTweenSecondPart?.destroy(); 

            this._pointerImage.setPosition(pointer.x + this._pointerImage.displayWidth / 4, pointer.y + this._pointerImage.displayHeight / 4).setAlpha(1);

            if(this._dog_bone_key.getData('collected')){
                this._dog_bone_key.setOffset(this.cameras.main.scrollX * (1 / this._scale), this.cameras.main.scrollY * (1 / this._scale));
            }else{
                this._dog_bone_key.setOffset(0, 0);
            }

            this._isDraggingKey = true;
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;
      

            this._dog_bone_key.x = dragX;
            this._dog_bone_key.y = dragY;
        }).on('dragend', (_pointer: any) => {
            this._pointerImage.setAlpha(0);
            this._isDraggingKey = false;
            if(this._collectedContainer.isEmpty(this._dog_bone_key.getData('name'))){
                this._collectedContainer.addItem(this._dog_bone_key);
            }
            
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._dog_bone, this._dog_bone_key, () => {
            if(!this._isDraggingKey)return;
            this._pointerImage.setAlpha(0);
            this._collectedContainer.removeItem(this._dog_bone_key);
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
        .setData('name', 'tnt')
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this._pointerImage.setPosition(pointer.x + this._pointerImage.displayWidth / 4, pointer.y + this._pointerImage.displayHeight / 4).setAlpha(1);

            if(this._tnt_key.getData('collected')){
                this._tnt_key.setOffset(this.cameras.main.scrollX * (1 / this._scale), this.cameras.main.scrollY * (1 / this._scale));
            }else{
                this._tnt_key.setOffset(0, 0);
            }
            this._isDraggingKey = true;
     
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

      

            this._tnt_key.x = dragX;
            this._tnt_key.y = dragY;
        }).on('dragend', (_pointer: any) => {
            this._pointerImage.setAlpha(0);
            this._isDraggingKey = false;
            if(this._collectedContainer.isEmpty(this._tnt_key.getData('name'))){
                this._collectedContainer.addItem(this._tnt_key);
            }
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._tnt, this._tnt_key, () => {
            console.log('tnt');
            if(!this._isDraggingKey)return;
            this._collectedContainer.removeItem(this._tnt_key);
            this._pointerImage.setAlpha(0);
            this._tnt.destroy();
            this._tnt_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
    }


    private _drawCrowbar(): void{
        this._crowbar = this.physics.add.image(3300 * this._background.scaleX, 1800 * this._background.scaleY, 'crowbar_1')
        .setAlpha(0)
        .setScale(this._background.scale);

        this._crowbarArrow = this.add.image(3300 * this._background.scaleX, 1600 * this._background.scaleY, 'crowbar_arrow')
        .setScale(this._background.scale);

         this._crowbar_key = this.physics.add
         .image(3300 * this._background.scaleX, 1475 * this._background.scaleY, 'crowbar_2')
         .setScale(this._background.scale)
         .setData('name', 'crowbar')
         .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
         .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
             this._pointerImage.setPosition(pointer.x + this._pointerImage.displayWidth / 4, pointer.y + this._pointerImage.displayHeight / 4).setAlpha(1);

            if(this._crowbar_key.getData('collected')){
                this._crowbar_key.setOffset(this.cameras.main.scrollX * (1 / this._scale), this.cameras.main.scrollY * (1 / this._scale));
            }else{
                this._crowbar_key.setOffset(0, 0);
            }
            this._isDraggingKey = true;
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

            this._crowbar_key.x = dragX;
            this._crowbar_key.y = dragY;
            

        }).on('dragend', (_pointer: any) => {
            this._pointerImage.setAlpha(0);
            this._isDraggingKey = false;
            this._collectedContainer.addItem(this._crowbar_key);
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._crowbar, this._crowbar_key, () => {
            if(!this._isDraggingKey)return;
            this._pointerImage.setAlpha(0);
            this._collectedContainer.removeItem(this._crowbar_key);
            this._crowbar?.destroy();
            this._crowbar = null;
            this._crowbarArrow.destroy();
            this._crowbar_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
    }
    
    private _drawDonut(): void{
        this._donut = this.physics.add.image(1700 * this._background.scaleX, 1900 * this._background.scaleY, 'donut_1')
        .setAlpha(0)
        .setScale(this._background.scale);

         this._donut_key = this.physics.add
         .image(750 * this._background.scaleX, 1640 * this._background.scaleY, 'donut_2')
         .setScale(this._background.scale)
         .setData('name', 'donut')
         .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
         .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
             this._pointerImage.setPosition(pointer.x + this._pointerImage.displayWidth / 4, pointer.y + this._pointerImage.displayHeight / 4).setAlpha(1);

            if(this._donut_key.getData('collected')){
                this._donut_key.setOffset(this.cameras.main.scrollX * (1 / this._scale), this.cameras.main.scrollY * (1 / this._scale));
            }else{
                this._donut_key.setOffset(0, 0);
            }
            this._isDraggingKey = true;
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

            this._donut_key.x = dragX;
            this._donut_key.y = dragY;
            

        }).on('dragend', (_pointer: any) => {
            this._pointerImage.setAlpha(0);
            this._isDraggingKey = false;
            this._collectedContainer.addItem(this._donut_key);
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._donut, this._donut_key, () => {
            if(!this._isDraggingKey)return;
            this._pointerImage.setAlpha(0);
            this._collectedContainer.removeItem(this._donut_key);
            this._donut?.destroy();
            this._donut = null;
            this._donut_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
            this._drawCrowbar();
        });
    }

    private _drawRock(): void{
        this._rock = this.physics.add.image(920 * this._background.scaleX, 1610 * this._background.scaleY, 'rock_1')
        .setAlpha(0)
        .setScale(this._background.scale);

         this._rock_key = this.physics.add
         .image(2510 * this._background.scaleX, 1900 * this._background.scaleY, 'rock_2')
         .setScale(this._background.scale)
         .setData('name', 'rock')
         .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
         .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
             this._pointerImage.setPosition(pointer.x + this._pointerImage.displayWidth / 4, pointer.y + this._pointerImage.displayHeight / 4).setAlpha(1);
             this._tutorialCompleted = true;
             this._tutorialPointer?.destroy();
             this._tutorialTweenFirstPart?.destroy();
             this._tutorialTweenSecondPart?.destroy(); 

            if(this._rock_key.getData('collected')){
                this._rock_key.setOffset(this.cameras.main.scrollX * (1 / this._scale), this.cameras.main.scrollY * (1 / this._scale));
            }else{
                this._rock_key.setOffset(0, 0);
            }
            this._isDraggingKey = true;
            this._customInput.initialX = pointer.x;
            this._customInput.initialY = pointer.y;

            this._rock_key.x = dragX;
            this._rock_key.y = dragY;
            

        }).on('dragend', (_pointer: any) => {
            this._pointerImage.setAlpha(0);
            this._isDraggingKey = false;
            this._collectedContainer.addItem(this._rock_key);
        });

        const collide: Phaser.Physics.Arcade.Collider = this.physics.add.collider(this._rock, this._rock_key, () => {
            if(!this._isDraggingKey)return;
            this._pointerImage.setAlpha(0);
            this._collectedContainer.removeItem(this._rock_key);
            this._rock?.destroy();
            this._rock = null;
            this._rock_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
            this._drawDonut();
        });
    }

    private _drawBurgers(): void{
        this._burger1 = this.physics.add.image(2250 * this._background.scaleX, 1330 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale)
        .setInteractive()
        .on('pointerdown', () => {
            this._tutorialCompleted = true;
            this._tutorialPointer?.destroy();
            this._tutorialTweenFirstPart?.destroy();
            this._tutorialTweenSecondPart?.destroy(); 

            this._collectedContainer.addItem(this._burger1);
        });
        this._burger2 = this.physics.add.image(2180 * this._background.scaleX, 1500 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger2);
        });

        this._burger3 = this.physics.add.image(1800 * this._background.scaleX, 1450 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger3);
        });
        
        this._burger4 = this.physics.add.image(1460 * this._background.scaleX, 1490 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setFlip(true, false)
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger4);
        });

        this._burger5 = this.physics.add.image(2600 * this._background.scaleX, 1500 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger5);
        });

        this._burger6 = this.physics.add.image(2700 * this._background.scaleX, 1540 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger6);
        });

        this._burger7 = this.physics.add.image(3100 * this._background.scaleX, 1150 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger7);
        });
        
        this._burger8 = this.physics.add.image(3520 * this._background.scaleX, 1600 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger8);
        });

        this._burger9 = this.physics.add.image(780 * this._background.scaleX, 1300 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger9);
        });

        this._burger10 = this.physics.add.image(1200 * this._background.scaleX, 750 * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger10);
        });
    }

    private _checkLevelComplete(): void{
        
        this._isDraggingKey = false;
        if(this._currentLevel === 1){
            if(this._croissant.active || this._tnt.active || this._dog_bone.active)return;
            this._currentLevel = 2;
            this._background.setTexture(Configs.background.texture + this._currentLevel);
            this._avatarContainer.removeAllElements();
            this._avatarContainer = new Avatar(this, this._currentLevel);
            this._collectedContainer.removeAllItem();
            this._drawRock();
            this._tutorialCompleted = false;
            this._secondLevelTutorial();

        }else if(this._currentLevel === 2){
            if(this._rock !== null || this._donut !== null || this._crowbar !== null)return;
            this._currentLevel = 3;
            this._background.setTexture(Configs.background.texture + this._currentLevel);
            this._avatarContainer.removeAllElements();
            this._avatarContainer = new Avatar(this, this._currentLevel);
            this._collectedContainer.showBurgerIcon();
            this._collectedContainer.removeAllItem();
            this._drawBurgers();
            this.onScreenChange();
            this._thirdLevelTutorial();
        }
    }

    private _addBackground(): void{
        this._background = this.add
        .image(0, 0, Configs.background.texture + this._currentLevel)
        .setOrigin(0, 0)
        .setScale(this._scale);
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

        this._background
        ?.setPosition(0, 0)
        ?.setScale(this._scale);

        // Update camera bounds on resize
        this.cameras.main.setBounds(0, 0, this._background.width, this._background.height);

        if(this._currentLevel === 1){
            this._croissant?.setPosition(2000 * this._background.scaleX, 840 * this._background.scaleY).setScale(this._scale);  
            if(!Boolean(this._croissant_key.getData('collected'))){
                this._croissant_key?.setPosition(2820 * this._background.scaleX, 1940 * this._background.scaleY).setScale(this._background.scale);
            }else{
                this._croissant_key?.setScale(this._background.scale);
            }
    
            this._dog_bone?.setPosition(1685 * this._background.scaleX, 2170 * this._background.scaleY).setScale(this._scale);  
            if(!Boolean(this._dog_bone_key.getData('collected'))){
                this._dog_bone_key?.setPosition(2035 * this._background.scaleX, 1460 * this._background.scaleY).setScale(this._background.scale);
            }else{
                this._dog_bone_key?.setScale(this._background.scale);
            }
    
            this._tnt?.setPosition(2475 * this._background.scaleX, 2190 * this._background.scaleY).setScale(this._scale);  
            if(!Boolean(this._tnt_key.getData('collected'))){
                this._tnt_key?.setPosition(1475 * this._background.scaleX, 2235 * this._background.scaleY).setScale(this._background.scale);
            }else{
                this._tnt_key?.setScale(this._background.scale);
            }
        }else if(this._currentLevel === 2){
            this._rock?.setPosition(920 * this._background.scaleX, 1610 * this._background.scaleY).setScale(this._scale);  
            if(!Boolean(this._rock_key?.getData('collected'))){
                this._rock_key?.setPosition(2510 * this._background.scaleX, 1900 * this._background.scaleY).setScale(this._background.scale);
            }else{
                this._rock_key?.setScale(this._background.scale);
            }


            this._donut?.setPosition(1700 * this._background.scaleX, 1900 * this._background.scaleY).setScale(this._scale);  
            if(!Boolean(this._donut_key?.getData('collected'))){
                this._donut_key?.setPosition(750 * this._background.scaleX, 1640 * this._background.scaleY).setScale(this._background.scale);
            }else{
                this._donut_key?.setScale(this._background.scale);
            }

            this._crowbar?.setPosition(3300 * this._background.scaleX, 1800 * this._background.scaleY).setScale(this._scale);  
            this._crowbarArrow?.setPosition(3300 * this._background.scaleX, 1600 * this._background.scaleY).setScale(this._background.scale);
            if(!Boolean(this._crowbar_key?.getData('collected'))){
                this._crowbar_key?.setPosition(3300 * this._background.scaleX, 1475 * this._background.scaleY).setScale(this._background.scale);
            }else{
                this._crowbar_key?.setScale(this._background.scale);
            }

        }else if(this._currentLevel === 3){
            this._burger1.setPosition(2250 * this._background.scaleX, 1330 * this._background.scaleY)
            .setScale(this._background.scale);
            this._burger2.setPosition(2180 * this._background.scaleX, 1500 * this._background.scaleY)
            .setScale(this._background.scale);
    
            this._burger3.setPosition(1800 * this._background.scaleX, 1450 * this._background.scaleY)
            .setScale(this._background.scale);
            this._burger4.setPosition(1460 * this._background.scaleX, 1490 * this._background.scaleY)
            .setFlip(true, false)
            .setScale(this._background.scale);
    
            this._burger5.setPosition(2600 * this._background.scaleX, 1500 * this._background.scaleY)
            .setScale(this._background.scale);
    
            this._burger6.setPosition(2700 * this._background.scaleX, 1540 * this._background.scaleY)
            .setScale(this._background.scale);
    
            this._burger7.setPosition(3100 * this._background.scaleX, 1150 * this._background.scaleY)
            .setScale(this._background.scale);
            
            this._burger8.setPosition(3520 * this._background.scaleX, 1600 * this._background.scaleY)
            .setScale(this._background.scale);
    
            this._burger9.setPosition(780 * this._background.scaleX, 1300 * this._background.scaleY)
            .setScale(this._background.scale);
    
            this._burger10.setPosition(1200 * this._background.scaleX, 750 * this._background.scaleY)
            .setScale(this._background.scale);
        }
    }



    public onScreenChange(): void{
        this._scale = (Math.min(innerWidth / 1024, innerHeight / 2000)) * (this._currentLevel === 3 ? 1.25 : 1);
        console.log('resize event');
        this._resizeBackground();
        this._collectedContainer?.onScreenChange();
        this._avatarContainer?.onScreenChange();       
        this._controller?.onScreenChange(); 
        this._controllerCallback(0, 0);

        if(!this._tutorialCompleted){
            this._tutorialPointer?.destroy();
            this._tutorialTweenFirstPart?.destroy();
            this._tutorialTweenSecondPart?.destroy(); 

            if(this._currentLevel === 1 && this._dog_bone){
                this._firstLevelTutorial();
            }else if(this._currentLevel === 2 && this._rock){
                this._secondLevelTutorial();
            }else if(this._currentLevel === 3 && this._burger1){
                this._thirdLevelTutorial();
            }
        }

    }
}