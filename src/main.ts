import Game from './scripts/game';
import './styles/style.css';
class Main{
  constructor(){

   window.addEventListener('DOMContentLoaded', () => {
      //ADD LOADER
      this._addLoader();
      new Game();
   });
  }

  private _addLoader(): void{
   
      const loader: HTMLElement = document.createElement('div');
      loader.classList.add('loader');
      loader.setAttribute('id', 'loader');

      loader.innerHTML = `
        <div class="loader__content">
        <div class="line"></div>
        <div class="line d1"></div>
        <div class="line d2"></div>
        <div class="line d3"></div>
        <div class="line d4"></div>
        <div class="line d5"></div>
        <br>
        <div class="caption">
           <p style='display:inline-block;'>Loading</p>
           <div class="dot">.</div>
           <div class="dot">.</div>
           <div class="dot">.</div>
     
        </div>
        </div>
      `;
      (<any>document).querySelector('body').prepend(loader);
   }

  
}

(() => new Main())();