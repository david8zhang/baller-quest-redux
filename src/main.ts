import Phaser from 'phaser'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './core/Constants'

import Game from './scenes/Game'
import { GameOver } from './scenes/GameOver'
import { Preload } from './scenes/Preload'
import { Start } from './scenes/Start'
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
  parent: 'phaser',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [
      {
        key: 'rexOutlinePipeline',
        plugin: OutlinePipelinePlugin,
        start: true,
      },
    ],
  },
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preload, Start, Game, GameOver],
}

export default new Phaser.Game(config)
