import Entry from "entry";
import BrowserDetect from "modules/BrowserDetect";
import * as p5 from 'p5';

let s = (sk) => {
  sk.setup = () => {
    sk.createCanvas(720, 720);
    sk.noFill();
  }

  sk.draw = () => {
    sk.background(255);
    sk.ellipse(sk.pmouseX, sk.pmouseY, 40, 40);

    sk.fill(128);
    sk.strokeWeight(1);
    sk.ellipse(50,40, 40, 40);
    sk.rect(50,50,40,20);
  }
}

const P5 = new p5(s);


if (module.hot) {
  module.hot.accept();
}
