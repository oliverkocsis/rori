import 'phaser';

const ratio = 16 / 9;
const width = 320;
const height = width * ratio;

export default class Demo extends Phaser.Scene {

  private lanes: number;
  private lane: number;
  private car: Phaser.GameObjects.Image;
  private lines: Phaser.GameObjects.Group;
  private speed: number;
  private linesNumber: number;
  private linesCounter: number;

  constructor() {
    super('demo');
    this.lanes = 5;
    this.lane = 2;
    this.speed = 3;
    this.linesNumber = 10;
    this.linesCounter = 0;
  }

  preload() {
    this.load.image('car', 'assets/car.png');
    this.load.image('line', 'assets/line.png');
    this.load.audio('theme', ['assets/ES_The Perfect Picture - Sunshine Coast.mp3']);
  }

  create() {
    const music = this.sound.add('theme');
    music.addMarker({
      name: 'loop',
      start: 0,
      duration: music.duration,
      config: {
        loop: true
      }
    });
    music.play('loop');

    this.car = this.add.image(0, 0, 'car');
    this.moveCar();
    this.car.setScale(width / this.lanes / this.car.width);
    this.car.setOrigin(0, 1);
    this.input.keyboard.on('keydown-LEFT', (event) => {
      this.lane = Math.max(0, this.lane - 1);
      this.moveCar();
    });
    this.input.keyboard.on('keydown-RIGHT', (event) => {
      this.lane = Math.min(this.lanes - 1, this.lane + 1);
      this.moveCar();
    });
    this.input.keyboard.on('keydown-UP', (event) => {
      this.speed = Math.min(10, this.speed + 1);
    });
    this.input.keyboard.on('keydown-DOWN', (event) => {
      this.speed = Math.max(0, this.speed - 1);
    });

    this.lines = this.add.group();
    for (let l = 1; l < this.lanes; l++) {
      for (let i = -1; i < this.linesNumber; i++) {
        const line = this.add.image(width / this.lanes * l, i * height / this.linesNumber, 'line');
        line.setDisplaySize(width / this.lanes / 10, height / this.linesNumber / 2);
        line.setOrigin(0.5, 0);
        line['originalY'] = line.y;
        this.lines.add(line);
      }
    }
  }

  update() {
    this.moveLines();
  }

  moveCar() {
    this.car.setPosition(width / this.lanes * (this.lane), height * 0.95);
  }

  moveLines() {
    if (this.linesCounter < height / this.linesNumber) {
      for (const line of this.lines.getChildren()) {
        const image = line as Phaser.GameObjects.Image;
        image.setY(image.y + this.speed);
      }
      this.linesCounter += this.speed;
    } else {
      for (const line of this.lines.getChildren()) {
        const image = line as Phaser.GameObjects.Image;
        image.setY(image['originalY']);
      }
      this.linesCounter = 0;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  scene: Demo
};

const game = new Phaser.Game(config);
