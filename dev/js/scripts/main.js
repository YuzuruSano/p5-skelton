import Entry from "entry";
import BrowserDetect from "modules/BrowserDetect";
import SortColors from "modules/SortColors";
import SVG from "modules/SVG";

import ImgInstance from "modules/ImgInstance";
import * as gd from "generative-design-library.js";
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import { createNoSubstitutionTemplateLiteral } from "typescript";

const svg = new SVG();
const imgInstance = new ImgInstance();

const creaturesData = [
  {
    svg: '../images/svg.svg',
    img: '../images/creature.gif',
    nowPathPosition: 0,
    prevX: 0,
    prevY: 0,
    isJumping: false,
    up: true,
    jumpStartAt: 0,
    jumpMax: 300,
  }
]

let s = (sk) => {
  let creatures = [];
  let instances = [];

  sk.preload = async () => {
    for (let index = 0; index < creaturesData.length; index++) {
      const c = creaturesData[index];
      await svg.getFile(c.svg).then(data => {
        const cc = {
          ...c, 
          img: sk.createImg(c.img).parent('canvas'),
          svgInfo: data,
          maxPathLength: data.element.querySelector('path').getTotalLength()
        }
        creatures.push(cc);
      });
    }
  }

  sk.setup = () => {
    const canvas = sk.createCanvas(sk.windowWidth, sk.windowHeight);
    canvas.parent('canvas');
  }

  sk.draw = () => {
    const width = sk.width;
    const height = sk.height;
    const mouseX = sk.pmouseX;
    const mouseY = sk.pmouseY;
    
  for (let i = 0; i < creatures.length; i++) {
      let c = creatures[i];
      if (!c.svgInfo) continue;
      c = imgInstance.setInstance(sk, c);
      instances.push(c);
    }
  }

  sk.mousePressed = () => {
    //actRandomSeed = sk.random(100000);
  }
  //キーイベント
  sk.keyPressed = (event) => {
    if (event.key == 'a'){

      instances[0].isJumping = true;
    }
  }
}
const P5 = new p5(s);

