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
    let roatateBase1 = nowPathPosition - 200;//現在の位置からのラジアン計算ポイント1 数値を増やすと緩やかな変化に
    let roatateBase2 = nowPathPosition + 200;//現在の位置からのラジアン計算ポイント2 数値を増やすと緩やかな変化に
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
      const x = pt1.x * svgClientRect.width / svgInfo.viewBox.width;
      const y = pt1.y * svgClientRect.height / svgInfo.viewBox.height;
      sk.clear();
      sk.push();
      creature.style('transform', `rotate(${rotate}rad)`);
      creature.position(x + randomX, y + randomY);
      sk.pop();
    }
  }

  sk.mousePressed = () => {
    //actRandomSeed = sk.random(100000);
  }
}
const P5 = new p5(s);

