export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PreloadScene' });
    }

    public preload(): void {
        this.load.pack("asset-pack", '/assetsPack.json');
  
        this.load.on('complete', this.complete, this);
    }


    public complete(): void {
        document.getElementById('loader')?.remove();        
        this.scene.start('MainScene');
        window.dispatchEvent(new Event('resize'));
    }
}