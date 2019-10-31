import Entry from "entry";
import BrowserDetect from "modules/BrowserDetect";
import SortColors from "modules/SortColors";
import * as gd from "generative-design-library.js";
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import axios from 'axios';
import { createNoSubstitutionTemplateLiteral } from "typescript";

const getSvgInfo = () => {
  const svgElement = document.querySelector('svg');
  const viewBoxParams = svgElement.getAttribute('viewBox').split(' ').map((param) => +param);
  return {
    element: svgElement,
    viewBox: {
      x: viewBoxParams[0],
      y: viewBoxParams[1],
      width: viewBoxParams[2],
      height: viewBoxParams[3]
    }
  };
}

const getFile = (file) => {
  return axios.get(file)
  .then(function (response) {
    const svg = response.data;
    document.body.insertAdjacentHTML('beforeend', svg);
  })
  .then(() => {
    const info = getSvgInfo();
    return info;
  })
  .catch(function (error) {
    console.log(error);
  })
}

let s = (sk) => {
  let tileCount = 10;
  let actRandomSeed = 0;
  let actStrokeCap;
  let svgInfo;
  let path;
  let nowPathPosition = 0; // 現在のSVG pathの位置
  let maxPathLength;
  let pathElement;
  let creature;

  let isJumping = false;
  let up = true;
  let jump0 = 0;
  let jumpMax = 300;

  sk.setup = () => {
    sk.createCanvas(1000, 1000);
    actStrokeCap = sk.ROUND;
    creature = sk.createImg("../images/creature.gif");

    getFile('../images/svg.svg').then(data => {
      svgInfo = data;
      pathElement = data.element.querySelector('path');
      maxPathLength = pathElement.getTotalLength();
    });
  }

  sk.draw = () => {
    const width = sk.width;
    const height = sk.height;
    const mouseX = sk.pmouseX;
    const mouseY = sk.pmouseY;
    const SPEED = sk.random(10, 500);
    const randomX = sk.random(10, 15);
    const randomY = sk.random(10, 15);

    // 現在の座標がpathの全長を越していたら0に初期化
    if (nowPathPosition > maxPathLength) {
      nowPathPosition = 0;
    }

    // 次の位置に進める
    nowPathPosition = (nowPathPosition + SPEED / 100);
    let roatateBase1 = nowPathPosition - 10 ;//現在の位置からのラジアン計算ポイント1 数値を増やすと緩やかな変化に
    let roatateBase2 = nowPathPosition + 10 ;//現在の位置からのラジアン計算ポイント2 数値を増やすと緩やかな変化に
    if (roatateBase1 < 0) {
      roatateBase1 = 0;
    }
    if (roatateBase2 > maxPathLength) {
      roatateBase2 = maxPathLength;
    }

    if (pathElement){
      const pt1 = pathElement.getPointAtLength(nowPathPosition);
      const pt0 = pathElement.getPointAtLength(roatateBase1);
      const pt2 = pathElement.getPointAtLength(roatateBase2);

      const dx = pt2.x - pt0.x;
      const dy = pt2.y - pt0.y;
      let rotate = Math.atan(dy / dx);
      
      if (dx < 0) {
        rotate += Math.PI;
      }

      // DOM上の座標を求める
      const svgClientRect = svgInfo.element.getBoundingClientRect();
      let x = (pt1.x * svgClientRect.width / svgInfo.viewBox.width) + randomX;
      let y = (pt1.y * svgClientRect.height / svgInfo.viewBox.height) + randomY;
      
      //jump
      if (isJumping){
        const jump = (rotate < 0) ? rotate - 1.5708 : rotate + 1.5708;
        const jumpX = sk.sin(jump) * jump0; // 円周上のX座標の位置
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
      //ask.clear();
      sk.imageMode(sk.CENTER);
      creature.style('transform', `rotate(${rotate}rad)`);
      creature.position(x, y);
      sk.pop();

      sk.rect(x, y, 10, 10);

      
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

