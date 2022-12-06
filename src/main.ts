import Phaser from 'phaser'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './core/Constants'

import Game from './scenes/Game'
import { Preload } from './scenes/Preload'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
  parent: 'phaser',
  physics: {
    default: 'arcade',
  },
  dom: {
    createContainer: true,
  },
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preload, Game],
}

export default new Phaser.Game(config)
