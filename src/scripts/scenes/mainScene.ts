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


    private _currentLevel: number = 2;


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
    
    private _donutTutorialPart: 'first' | 'second' = 'first';
    private _donutTutorialCompleted: boolean = false;

    private _extraScale: number = 2;


    private _firstLevelTutorialPart: 'first' | 'second' = 'first';
    private _secondLevelTutorialPart: 'first' | 'second' = 'first';

    constructor(){
        super({ key: 'MainScene' });

        if(this._currentLevel === 2){
            this._extraScale = 1.428;
        }else if(this._currentLevel === 3){
            this._extraScale = 2.6642;
        }
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
    
        const originalPoint = new Phaser.Math.Vector2(2472.5 / 2.5, 1390.5 / 2.5);

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

        if(this._currentLevel === 1){
            this._firstLevelTutorial('first');
        }else if(this._currentLevel === 2){
            this._secondLevelTutorial('first');
        }else{
            this._thirdLevelTutorial();
        }
    }

    private _firstLevelTutorial(part: 'first' | 'second'): void{
        const x = (this.cameras.main.scrollX  + this._dog_bone_key.x) ;
        const y = this.cameras.main.scrollY + this._dog_bone_key.y;
        this._tutorialPointer = this.add
        .image(part === 'second' ? x : this._dog_bone_key.x , part === 'second' ? y : this._dog_bone_key.y, 'pointer')
        .setDepth(800)
        .setDisplaySize(102 * this._scale, 77 * this._scale);
        
        if(part === 'first'){

            this._tutorialTweenFirstPart = this.tweens.add({
                targets: this._tutorialPointer,
                scale: '/=2',
                repeat: -1,
                yoyo: true,
                duration: 500
            });

        }else{
            this._tutorialTweenSecondPart = this.tweens.add({
                targets: this._tutorialPointer,
                x: () => this._dog_bone.x,
                y: () => this._dog_bone.y,
                duration: 1500,

                onComplete: () => {
                    this._tutorialPointer.destroy();
                    if(!this._tutorialCompleted){
                        this._firstLevelTutorial('second');
                    }
                }
            });
        }
    }

    private _secondLevelTutorial(part: 'first' | 'second'): void{

        const x = (this.cameras.main.scrollX  + this._rock_key.x) ;
        const y = this.cameras.main.scrollY + this._rock_key.y;
        this._tutorialPointer = this.add
        .image(part === 'second' ? x : this._rock_key.x , part === 'second' ? y : this._rock_key.y, 'pointer')
        .setDepth(800)
        .setDisplaySize(102 * this._scale, 77 * this._scale);
        
        if(part === 'first'){

            this._tutorialTweenFirstPart = this.tweens.add({
                targets: this._tutorialPointer,
                scale: '/=2',
                repeat: -1,
                yoyo: true,
                duration: 500
            });

        }else{
            this._tutorialTweenSecondPart = this.tweens.add({
                targets: this._tutorialPointer,
                x: () => (<Phaser.Physics.Arcade.Image>this._rock).x,
                y: () => (<Phaser.Physics.Arcade.Image>this._rock).y,
                duration: 1500,

                onComplete: () => {
                    this._tutorialPointer.destroy();
                    if(!this._tutorialCompleted){
                        this._secondLevelTutorial('second');
                    }
                }
            });
        }
    }

    private _startDonutTutorial(part: 'first' | 'second'): void{
        const x = (this.cameras.main.scrollX  + this._donut_key.x);
        const y = this.cameras.main.scrollY + this._donut_key.y;


        this._tutorialPointer = this.add
        .image(part === 'second' ? x : this._donut_key.x , part === 'second' ? y : this._donut_key.y, 'pointer')
        .setDepth(800)
        .setDisplaySize(102 * this._scale, 77 * this._scale);
        
        if(part === 'first'){

            this._tutorialTweenFirstPart = this.tweens.add({
                targets: this._tutorialPointer,
                scale: '/=2',
                repeat: -1,
                yoyo: true,
                duration: 500
            });

        }else{
            
            this._tutorialTweenSecondPart = this.tweens.add({
                targets: this._tutorialPointer,
                x: () => (<Phaser.Physics.Arcade.Image>this._donut).x,
                y: () => (<Phaser.Physics.Arcade.Image>this._donut).y,
                duration: 1500,

                onComplete: () => {
                    this._tutorialPointer.destroy();
                    if(!this._donutTutorialCompleted){
                        this._startDonutTutorial('second');
                    }
                }
            });
        }
    }

    private _thirdLevelTutorial(): void{
        this._tutorialPointer = this.add
        .image(this._burger8.x , this._burger8.y , 'pointer')
        .setDepth(800)
        .setDisplaySize(102 * this._scale, 77 * this._scale);

        
        this._tutorialTweenFirstPart = this.tweens.add({
            targets: this._tutorialPointer,
            scale: '/=2',
            repeat: -1,
            yoyo: true,
            duration: 500
        });

    }

    private _drawCroissant(): void{
        this._croissant = this.physics.add.image(1000 * this._background.scaleX, 420 * this._background.scaleY, 'croissant_2')
        .setScale(this._background.scale / 2);

        this._croissant_key = this.physics.add
        .image(1410 * this._background.scaleX, 970 * this._background.scaleY, 'croissant_1')
        .setScale(this._background.scale / 2)
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
            this._collectedContainer.removeAllItem();
            this._croissant.destroy();
            this._croissant_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
    }

    private _drawDogBone(): void{
        this._dog_bone = this.physics.add.image(842.5 * this._background.scaleX, 1085 * this._background.scaleY, 'dog_bone_2')
        .setScale(this._background.scale / 2);

        this._dog_bone_key = this.physics.add
        .image(1017.5 * this._background.scaleX, 730 * this._background.scaleY, 'dog_bone_1')
        .setScale(this._background.scale / 2)
        .setData('name', 'bone')
        .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
        .on('pointerdown', () => {
            if(this._firstLevelTutorialPart !== 'second'){   
                this._tutorialPointer?.destroy();
                this._tutorialTweenFirstPart?.destroy();
                    
            }
        })
        .on('pointerup', () => {
            if(this._firstLevelTutorialPart !== 'second'){   
                this._tutorialPointer?.destroy();
                this._tutorialTweenFirstPart?.destroy();
                this._firstLevelTutorialPart = 'second';
                this.time.delayedCall(1000, () => {
                    this._firstLevelTutorial(this._firstLevelTutorialPart);
                });
                    
            }
        })
        .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
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
            this._tutorialCompleted = true;

            this._tutorialPointer?.destroy();
            this._tutorialTweenSecondPart?.destroy();

            this._pointerImage.setAlpha(0);
            this._collectedContainer.removeAllItem();
            this._dog_bone.destroy();
            this._dog_bone_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
        
    }


    private _drawTnt(): void{
        this._tnt = this.physics.add.image(1237.5 * this._background.scaleX, 1095 * this._background.scaleY, 'tnt_2')
        .setScale(this._background.scale / 2);

        this._tnt_key = this.physics.add
        .image(737.5 * this._background.scaleX, 1117.5 * this._background.scaleY, 'tnt_1')
        .setScale(this._background.scale / 2)
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
            this._collectedContainer.removeAllItem();
            this._pointerImage.setAlpha(0);
            this._tnt.destroy();
            this._tnt_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
    }


    private _drawCrowbar(): void{
        this._crowbar = this.physics.add.image((3300 / this._extraScale) * this._background.scaleX, (1800 / this._extraScale) * this._background.scaleY, 'crowbar_1')
        .setAlpha(0)
        .setScale(this._background.scale / this._extraScale);

        this._crowbarArrow = this.add.image((3300 / this._extraScale) * this._background.scaleX, (1600 / this._extraScale) * this._background.scaleY, 'crowbar_arrow')
        .setScale(this._background.scale / this._extraScale);

         this._crowbar_key = this.physics.add
         .image((3300 / this._extraScale) * this._background.scaleX, (1475 / this._extraScale) * this._background.scaleY, 'crowbar_2')
         .setScale(this._background.scale / this._extraScale)
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
            this._collectedContainer.removeAllItem();
            this._crowbar?.destroy();
            this._crowbar = null;
            this._crowbarArrow.destroy();
            this._crowbar_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
        });
    }
    
    private _drawDonut(): void{
        this._donut = this.physics.add.image((1700 / this._extraScale) * this._background.scaleX, (1900 / this._extraScale) * this._background.scaleY, 'donut_1')
        .setAlpha(0)
        .setScale(this._background.scale / this._extraScale);

         this._donut_key = this.physics.add
         .image((750 / this._extraScale) * this._background.scaleX, (1640 / this._extraScale) * this._background.scaleY, 'donut_2')
         .setScale(this._background.scale / this._extraScale)
         .setData('name', 'donut')
         .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
         .on('pointerdown', () => {
            if(this._donutTutorialPart !== 'second'){   
                this._tutorialPointer?.destroy();
                this._tutorialTweenFirstPart?.destroy();
                    
            }
        })
         .on('pointerup', () => {
            if(this._donutTutorialPart !== 'second'){   
                this._tutorialPointer?.destroy();
                this._tutorialTweenFirstPart?.destroy();
                
                this.time.delayedCall(1000, () => {
                    this._donutTutorialPart = 'second';
                    this._startDonutTutorial(this._donutTutorialPart);
                });
                    
            }

        })
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
            this._tutorialTweenSecondPart?.destroy();
            this._donutTutorialCompleted = true;
            this._tutorialPointer?.destroy();
            this._collectedContainer.removeAllItem();
            this._donut?.destroy();
            this._donut = null;
            this._donut_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
            this._drawCrowbar();
        });
    }

    private _drawRock(): void{
        this._rock = this.physics.add.image((920 / this._extraScale) * this._background.scaleX, (1610 / this._extraScale) * this._background.scaleY, 'rock_1')
        .setAlpha(0)
        .setScale(this._background.scale / this._extraScale);

         this._rock_key = this.physics.add
         .image((2510 / this._extraScale) * this._background.scaleX, (1900 / this._extraScale) * this._background.scaleY, 'rock_2')
         .setScale(this._background.scale / this._extraScale)
         .setData('name', 'rock')
         .setInteractive({ cursor: 'pointer', draggable: true }) // Enable draggable property
         .on('pointerdown', () => {
            if(this._secondLevelTutorialPart !== 'second'){   
                this._tutorialPointer?.destroy();
                this._tutorialTweenFirstPart?.destroy();
                    
            }
        })
         .on('pointerup', () => {
            if(this._secondLevelTutorialPart !== 'second'){   
                this._tutorialPointer?.destroy();
                this._tutorialTweenFirstPart?.destroy();
                
                this.time.delayedCall(1000, () => {
                    this._secondLevelTutorialPart = 'second';
                    this._secondLevelTutorial(this._secondLevelTutorialPart);
                });
                    
            }

        })
         .on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
             this._pointerImage.setPosition(pointer.x + this._pointerImage.displayWidth / 4, pointer.y + this._pointerImage.displayHeight / 4).setAlpha(1);
     
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
            this._collectedContainer.removeAllItem();
            
            this._tutorialPointer?.destroy();
            this._tutorialTweenSecondPart?.destroy();

            this._rock?.destroy();
            this._rock = null;
            this._rock_key.destroy();
            this._checkLevelComplete();
            collide.destroy();
            this._drawDonut();
            this._startDonutTutorial('first');
            
        });
    }


    private _drawBurgers(): void{
        this._burger1 = this.physics.add.image((5900 / this._extraScale) * this._background.scaleX, (1270 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale * 0.9 / this._extraScale)
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger1);
        });
        this._burger2 = this.physics.add.image((6335 / this._extraScale) * this._background.scaleX, (1570 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale / this._extraScale)
        .setRotation(Phaser.Math.DegToRad(-2))
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger2);
        });

        this._burger3 = this.physics.add.image((5235 / this._extraScale) * this._background.scaleX, (1450 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale * 0.5 / this._extraScale) 
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger3);
        });
        
        this._burger4 = this.physics.add.image((4420 / this._extraScale) * this._background.scaleX, (500 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setFlip(true, false)
        .setScale(this._background.scale / this._extraScale) 
        .setRotation(Phaser.Math.DegToRad(22))
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger4);
        });

        this._burger5 = this.physics.add.image((3910 / this._extraScale) * this._background.scaleX, (1300 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale / this._extraScale) 
        .setRotation(Phaser.Math.DegToRad(-10))
        .setInteractive()
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger5);
        });

        this._burger6 = this.physics.add.image((3080 / this._extraScale) * this._background.scaleX, (1640 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale / this._extraScale) 
        .setInteractive()
        .setRotation(Phaser.Math.DegToRad(-5))
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger6);
        });

        this._burger7 = this.physics.add.image((2420 / this._extraScale) * this._background.scaleX, (880 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale / this._extraScale) 
        .setInteractive()
        .setRotation(Phaser.Math.DegToRad(-15))
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger7);
        });
        
        this._burger8 = this.physics.add.image((1930 / this._extraScale) * this._background.scaleX, (1550 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale * 0.9 / this._extraScale) 
        .setInteractive()
        .setRotation(Phaser.Math.DegToRad(-15))
        .on('pointerdown', () => {
            this._tutorialCompleted = true;
            this._tutorialPointer?.destroy();
            this._tutorialTweenFirstPart?.destroy();
            this._tutorialTweenSecondPart?.destroy(); 
            this._collectedContainer.addItem(this._burger8);
        })
        .on('pointerup', () => {
            this._tutorialPointer?.destroy();
            this._tutorialTweenFirstPart?.destroy();
            this._tutorialTweenSecondPart?.destroy(); 

        });

        this._burger9 = this.physics.add.image((280 / this._extraScale) * this._background.scaleX, (1480 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale / this._extraScale) 
        .setInteractive()
        .setRotation(Phaser.Math.DegToRad(-20))
        .on('pointerdown', () => {
            this._collectedContainer.addItem(this._burger9);
        });

        this._burger10 = this.physics.add.image((1230 / this._extraScale) * this._background.scaleX, (1550 / this._extraScale) * this._background.scaleY, 'burger')
        .setData('name', 'burger')
        .setScale(this._background.scale * 0.8 / this._extraScale) 
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
            this._extraScale = 1.428;
            this._background.setTexture(Configs.background.texture + this._currentLevel).setScale(this._scale * this._extraScale);
            this._tutorialPointer?.destroy();
            this._avatarContainer.removeAllElements();
            this._avatarContainer = new Avatar(this, this._currentLevel);
            this._collectedContainer.removeAllItem();
            this._drawRock();
            this._tutorialCompleted = false;
            this._secondLevelTutorial('first');
            window.parent.postMessage('LevelComplete1',"*");

        }else if(this._currentLevel === 2){
            if(this._rock !== null || this._donut !== null || this._crowbar !== null)return;
            this._currentLevel = 3;
            this._extraScale = 2.6642;
            this._background.setTexture(Configs.background.texture + this._currentLevel).setScale(this._scale * this._extraScale);
            this._tutorialPointer?.destroy();
            this._avatarContainer.removeAllElements();
            this._avatarContainer = new Avatar(this, this._currentLevel);
            this._collectedContainer.showBurgerIcon();
            this._collectedContainer.removeAllItem();
            this._drawBurgers();
            this.onScreenChange();
            this._thirdLevelTutorial();
            window.parent.postMessage('LevelComplete2',"*");
        }
    }

    private _addBackground(): void{
        this._background = this.add
        .image(0, 0, Configs.background.texture + this._currentLevel)
        .setOrigin(0, 0)
        .setScale(this._scale * this._extraScale);
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
        ?.setScale(this._scale * this._extraScale);

        // Update camera bounds on resize
        this.cameras.main.setBounds(0, 0, this._background.width, this._background.height);

        if(this._currentLevel === 1){
            this._croissant?.setPosition(1000 * this._background.scaleX, 420 * this._background.scaleY).setScale(this._background.scale / 2);  
            if(!Boolean(this._croissant_key.getData('collected'))){
                this._croissant_key?.setPosition(1410 * this._background.scaleX, 970 * this._background.scaleY).setScale(this._background.scale / 2);
            }else{
                this._croissant_key?.setScale(this._background.scale / 2);
            }

            this._dog_bone?.setPosition(842.5 * this._background.scaleX, 1085 * this._background.scaleY).setScale(this._background.scale / 2);  
            if(!Boolean(this._dog_bone_key.getData('collected'))){
                this._dog_bone_key?.setPosition(1017.5 * this._background.scaleX, 730 * this._background.scaleY).setScale(this._background.scale / 2);
            }else{
                this._dog_bone_key?.setScale(this._background.scale / 2);
            }
    
            this._tnt?.setPosition(1237.5 * this._background.scaleX, 1095 * this._background.scaleY).setScale(this._background.scale / 2);  
            if(!Boolean(this._tnt_key.getData('collected'))){
                this._tnt_key?.setPosition(737.5 * this._background.scaleX, 1117.5 * this._background.scaleY).setScale(this._background.scale / 2);
            }else{
                this._tnt_key?.setScale(this._background.scale / 2);
            }


        }else if(this._currentLevel === 2){
            this._rock?.setPosition((920 / this._extraScale) * this._background.scaleX, (1610 / this._extraScale) * this._background.scaleY).setScale(this._background.scale / this._extraScale);  
            if(!Boolean(this._rock_key?.getData('collected'))){
                this._rock_key?.setPosition((2510 / this._extraScale) * this._background.scaleX, (1900 / this._extraScale) * this._background.scaleY).setScale(this._background.scale / this._extraScale);
            }else{
                this._rock_key?.setScale(this._background.scale / this._extraScale);
            }

            this._donut?.setPosition((1700 / this._extraScale) * this._background.scaleX, (1900 / this._extraScale) * this._background.scaleY).setScale(this._background.scale / this._extraScale);  
            if(!Boolean(this._donut_key?.getData('collected'))){
                this._donut_key?.setPosition((750 / this._extraScale) * this._background.scaleX, (1640 / this._extraScale) * this._background.scaleY).setScale(this._background.scale / this._extraScale);
            }else{
                this._donut_key?.setScale(this._background.scale / this._extraScale);
            }

            this._crowbar?.setPosition((3300 / this._extraScale) * this._background.scaleX, (1800 / this._extraScale) * this._background.scaleY).setScale(this._background.scale / this._extraScale);  
            this._crowbarArrow?.setPosition((3300 / this._extraScale) * this._background.scaleX, (1600 / this._extraScale) * this._background.scaleY).setScale(this._background.scale / this._extraScale);
            if(!Boolean(this._crowbar_key?.getData('collected'))){
                this._crowbar_key?.setPosition((3300 / this._extraScale) * this._background.scaleX, (1475 / this._extraScale) * this._background.scaleY).setScale(this._background.scale / this._extraScale);
            }else{
                this._crowbar_key?.setScale(this._background.scale / this._extraScale);
            }

        }else if(this._currentLevel === 3){
            this._burger1.setPosition((5900 / this._extraScale) * this._background.scaleX, (1270 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale * 0.9 / this._extraScale);
            this._burger2.setPosition((6335 / this._extraScale) * this._background.scaleX, (1570 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale / this._extraScale);
    
            this._burger3.setPosition((5235 / this._extraScale) * this._background.scaleX, (1450 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale * 0.5 / this._extraScale);
            this._burger4.setPosition((4420 / this._extraScale) * this._background.scaleX, (500 / this._extraScale) * this._background.scaleY)
            .setFlip(true, false)
            .setScale(this._background.scale / this._extraScale);
    
            this._burger5.setPosition((3910 / this._extraScale) * this._background.scaleX, (1300 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale / this._extraScale);
    
            this._burger6.setPosition((3080 / this._extraScale) * this._background.scaleX, (1640 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale / this._extraScale);
    
            this._burger7.setPosition((2420 / this._extraScale) * this._background.scaleX, (880 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale / this._extraScale);
            
            this._burger8.setPosition((1930 / this._extraScale) * this._background.scaleX, (1550 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale * 0.9 / this._extraScale);
    
            this._burger9.setPosition((280 / this._extraScale) * this._background.scaleX, (1480 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale / this._extraScale);
    
            this._burger10.setPosition((1230 / this._extraScale) * this._background.scaleX, (1550 / this._extraScale) * this._background.scaleY)
            .setScale(this._background.scale * 0.8 / this._extraScale);
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
                this._firstLevelTutorial(this._firstLevelTutorialPart);
            }else if(this._currentLevel === 2 && this._rock){
                this._secondLevelTutorial(this._secondLevelTutorialPart);
            }
        }

        this._tutorialPointer?.setDisplaySize(102 * this._scale, 77 * this._scale);
        this._pointerImage?.setDisplaySize(102 * this._scale, 77 * this._scale);

    }
}