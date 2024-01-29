export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PreloadScene' });
    }

    public preload(): void {
        this._loadFont("cerapro", `assets/cerapro-bold.otf`);
        this.load.pack("asset-pack", '/assetsPack.json');
  
        this.load.on('complete', this.complete, this);
    }

    private _loadFont(name: string, url: string): void {
        const newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            
            (<any>document.fonts).add(loaded);
        }).catch(function (error) {
            return error;
        })
    }


    public complete(): void {
        document.getElementById('loader')?.remove();        
        this.scene.start('MainScene');
        window.dispatchEvent(new Event('resize'));
    }
}