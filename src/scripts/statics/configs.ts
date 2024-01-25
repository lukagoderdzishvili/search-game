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

}