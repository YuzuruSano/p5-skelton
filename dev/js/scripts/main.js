import Entry from "entry";
import BrowserDetect from "modules/BrowserDetect";
import SortColors from "modules/SortColors";
import SVG from "modules/SVG";
import ImgInstance from "modules/ImgInstance";
import creaturesFloatingData from "modules/creaturesFloatingData";
import * as gd from "generative-design-library.js";
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import { createNoSubstitutionTemplateLiteral } from "typescript";

/**
  * 1.2匹くらいでてる
  * 2.10匹くらいまで増やす（増やすのSPで投げる）
  * 3.増やし切ったら弾ける
  * 4.1に戻る
 */
const svg = new SVG();
const imgInstance = new ImgInstance();

let s = (sk) => {
  //おばけのシーン定義
  const CreatureSchece = [0, 1, 2, 3,'end'];
  let CurrentCreatureSchece = 0;//シーンスタート時

  let creatures = [];//おばけの実体データを格納
  let bombFrameMax = 40;//爆発画像の保持フレーム
  let resetFrame = 0;//リセット時のスタートフレーム
  let resetFrameMax = 200;//リセット起動後の保持フレーム

  sk.preload = () => {
    
    //おばけデータその1
    for (let index = 1; index <= creaturesFloatingData.length; index++) {
      const c = creaturesFloatingData[index - 1];
      svg.getFile(c.svg, `#path${index}`).then(data => {
        const defaultImg = sk.createImg(c.img).parent('canvas');
        const bombImg = sk.createImg(c.imgBomb).parent('canvas');
        const cc = {
          ...c,
          currentImg: defaultImg,
          defaultImg: defaultImg,
          bombImg: bombImg,
          svgInfo: data,
          maxPathLength: data.element.querySelector('path').getTotalLength(),
          isShown:false
        }
        creatures.push(cc);
      });
    }
  }

  sk.setup = () => {
    const canvas = sk.createCanvas(sk.windowWidth, sk.windowHeight);
    canvas.parent('canvas');
    $('#wrap').prepend($('<button></button>').text('test').addClass('scheneChange'));

    //シーンごとにおばけを増やす
    //todoこの信号をmidiでキャッチする
    $('.scheneChange').on('click',function(){
      if (CurrentCreatureSchece !== 'end'){
        CurrentCreatureSchece++;
      }
    })
  }

  sk.draw = () => {
    const width = sk.width;
    const height = sk.height;
    const mouseX = sk.pmouseX;
    const mouseY = sk.pmouseY;
    
    for (let index = 0; index < CurrentCreatureSchece + 1; index++) {
      let c = creatures[index];
      if (c && 'svgInfo' in c) {
        //最終シーンでリセット画像に変更する
        if (CreatureSchece[CurrentCreatureSchece] == 'end') {
          c.currentImg = c.bombImg;
          c.defaultImg.hide();
          resetFrame++;
        }
        //現状シーンで表示するイメージを出力、位置・傾きなどを保持したオブジェクト生成
        c.currentImg.show();
        const cInstance = imgInstance.setInstance(sk, c);

        //出現時のエフェクト生成
        if (cInstance && !c.isShown){
          c.bombImg.position(cInstance.currentX, cInstance.currentY);
          c.bombImg.style('transform', `rotate(${cInstance.r}rad) `);
          c.bombImg.style('transform-origin', `center`);
          c.bombImg.show();
          c.bombFrame++;
          c.isShown = true;
        }

        //出現時のエフェクト制御、一定期間で非表示に
        if (c.bombFrame > 0) {
          c.bombFrame++;
        }
        if (c.bombFrame > 0 && c.bombFrame > bombFrameMax) {
          c.bombImg.hide();
          c.bombFrame = 0;
        }
      }
    }

    //キャンバスのリセット処理起動
    if (resetFrame > 0) {
      resetFrame++;
    }
    if (resetFrame > resetFrameMax) {
      reset();
      resetFrame = 0;
    }
  }

  /**
   * リセット処理
   */
  const reset = () => {
    CurrentCreatureSchece = 0;
    for (let index = 0; index < creatures.length; index++) {
      let c = creatures[index];
      c.isShown = false;
      c.currentImg.hide();
      c.currentImg = c.defaultImg;
    }
  }
  //sk.mousePressed = () => {
    //actRandomSeed = sk.random(100000);
  //}
  //キーイベント
  // sk.keyPressed = (event) => {
  //   if (event.key == 'a'){
  //     instances[0].isJumping = true;
  //   }
  // }
}
const P5 = new p5(s);

