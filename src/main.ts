import Game from './scripts/game';
import './styles/style.css';
class Main{
   // private _game: Game;

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
        
      `;
   }

  
}

(() => new Main())();