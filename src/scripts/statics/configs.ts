import { ArrowConfig, AvatarConfig, BackgroundConfig, BoxConfig } from "./entities";

export default class Configs{
    static gameConfig: Phaser.Types.Core.GameConfig = {
        title: 'Search Game',
        version: "1.0.0",    
    
        type: Phaser.AUTO,
        transparent: false,
        backgroundColor: '#000000',
        disableContextMenu: true,
        
        scale: {
            parent: 'app',
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 1080,
            min: {
                width: 320,
                height: 400
            },
            max: {
                width: 3840,
                height: 2160,
            }
    
        },
    
        physics: {
            
            default: 'arcade',   
            arcade: { debug: true }         
        },
        dom: {
            createContainer: true
        },
        
        //,
        //fps: {
        //    target: 60,
        //    forceSetTimeOut: true,
        //    deltaHistory: 10,
        //    panicMax: 120,
        //    smoothStep: false
        //}         
    };



    static collectedContainer: BoxConfig = {
        width: 463,
        height: 191,
        texture: 'level',
        origin: new Phaser.Math.Vector2(0, 1),
        scrollfactor: new Phaser.Math.Vector2(0, 0)
    }

    static avatar: AvatarConfig = {
        width: 240,
        height: 240,
        texture: 'avatar',
        origin: new Phaser.Math.Vector2(1, 1),
        scrollfactor: new Phaser.Math.Vector2(0, 0)
    }
    

    static background: BackgroundConfig = {
        width: 4945,
        height: 2781,
        texture: 'background'
    }

    static arrow: ArrowConfig = {
        width: 195,
        height: 133,
        texture: 'arrow',
        scrollfactor: new Phaser.Math.Vector2(0, 0)
    }
}