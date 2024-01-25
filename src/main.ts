import Game from './scripts/game';
import './styles/style.css';
class Main{
 // private _game: Game;

  constructor(){
     new Game();
  }

  
}

(() => new Main())();