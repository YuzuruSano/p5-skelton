import Entry from "entry";
import BrowserDetect from "modules/BrowserDetect";
import SortColors from "modules/SortColors";
import SVG from "modules/SVG";
import ImgPos from "modules/ImgPos";
import * as gd from "generative-design-library.js";
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import { createNoSubstitutionTemplateLiteral } from "typescript";

const svg = new SVG();
const imgPos = new ImgPos();

let s = (sk) => {
  let svgInfo;
  let nowPathPosition = 0;
  let maxPathLength;

  let prevX = 0;
  let prevY = 0;

  let creature;

  let isJumping = false;
  let up = true;
  let jump0 = 0;
  let jumpMax = 300;

  sk.setup = () => {
    const canvas = sk.createCanvas(sk.windowWidth, sk.windowHeight);
    canvas.parent('canvas');
    creature = sk.createImg("../images/creature.gif");

    svg.getFile('../images/svg.svg').then(data => {
      svgInfo = data;
      maxPathLength = svgInfo.element.querySelector('path').getTotalLength();
    });
  }

  sk.draw = () => {
    const width = sk.width;
    const height = sk.height;
    const mouseX = sk.pmouseX;
    const mouseY = sk.pmouseY;
    const speed = sk.random(10, 500);
    const randomX = sk.random(10, 15);
    const randomY = sk.random(10, 15);

    if (svgInfo){
      
      //現在の座標がpathの全長を越していたら0に初期化
      nowPathPosition = (nowPathPosition + speed / 100);
      if (nowPathPosition > maxPathLength) {
        nowPathPosition = 0;
      }

      //画像の現在位置と傾きを取得
      const p = imgPos.getNowImgPosition(creature, svgInfo, nowPathPosition, prevX, prevY, speed);
      let { x, y, r, originX, originY} = {...p};
      sk.rect(originX, originY, 10, 10);

      //jump
      if (isJumping){
        const jump = (r < 0) ? r - 1.5708 : r + 1.5708;
        const jumpX = sk.sin(jump) * jump0;
        const jumpY = sk.cos(jump) * jump0;

        y = y + jumpY;
        x = x + jumpX;
        
        if (jump0 > jumpMax) {
          up = false;
        }

        if(up){
          jump0 = jump0 + 50;
        }else{
          jump0 = jump0 - 50;
        }
        
        if (jump0 < 0){
          isJumping = false;
          up = true;
        } 
      }

      //jump
      //to do 角度が負のときにおかしい
      // 勾配がゆるいときにおかしいん
      sk.push();
      //sk.clear();
      creature.style('transform', `rotate(${r}rad) `);
      creature.style('transform-origin', `center`);
      creature.position(x, y);
      sk.pop();

      prevX = x;
      prevY = y;
    }
  }

  sk.mousePressed = () => {
    //actRandomSeed = sk.random(100000);
  }
  //キーイベント
  sk.keyPressed = (event) => {
    if (event.key == 'a'){
      console.log('a');
      isJumping = true;
    }
  }
}
const P5 = new p5(s);

