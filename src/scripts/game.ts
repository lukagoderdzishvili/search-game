import Phaser from "phaser";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";
import Configs from "./statics/configs";

export default class Game {
    private _config: Phaser.Types.Core.GameConfig;
     private _preloadScene: PreloadScene;
     private _mainScene: MainScene;
    private _gameObject: Phaser.Game;

    constructor() {
        this._config = Configs.gameConfig;

        this._preloadScene = new PreloadScene();
        this._mainScene = new MainScene();
    
        this._config.scene = [this._preloadScene, this._mainScene];
        this._gameObject = new Phaser.Game(this._config);
        
        this._addListeners();

    }

    private _addListeners(): void {
        this._gameObject.scale.on('resize', () => {
            this._mainScene.onScreenChange();
        });
    }
}