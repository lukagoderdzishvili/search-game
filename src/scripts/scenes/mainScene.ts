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
    }


    private _addBackground(): void{
        this._background = this.add
        .image(-590, 0, Configs.background.texture)
        .setOrigin(0, 0)
        .setScale(0.4);
    }

    public onScreenChange(): void{
        console.log('resize event');
        this._levelContainer?.onScreenChange();
        this._avatarContainer?.onScreenChange();
    }
}