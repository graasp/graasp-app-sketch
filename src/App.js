import React, { Component } from 'react';
import { SketchField, Tools } from 'react-sketch';
import download from 'downloadjs';
import { detect } from 'detect-browser';
import Header from './components/Header';
import './App.css';

const INITIAL_BACKGROUND_COLOR = 'transparent';

class App extends Component {
  state = {
    lineColor: 'black',
    backgroundColor: INITIAL_BACKGROUND_COLOR,
    data: null,
    tool: Tools.Pencil,
    height: window.innerHeight,
  };

  componentDidMount() {
    document.addEventListener('message', (event) => {
      const { data } = event;
      try {
        this.setState({ data: JSON.parse(data) });
      } catch (err) {
        console.error(err);
      }
    });
  }

  postMessage = (data) => {
    const message = JSON.stringify(data);
    if (document.postMessage) {
      document.postMessage(message, '*');
    } else if (window.postMessage) {
      window.postMessage(message, '*');
    } else {
      console.error('unable to find postMessage');
    }
  };

  clear = () => {
    this.sketch.clear();
    this.sketch.setBackgroundFromDataUrl('');
    this.setState({
      backgroundColor: INITIAL_BACKGROUND_COLOR,
    });
  };

  changeColor = (color) => {
    this.setState({
      lineColor: color,
    });
  };

  setHeight = (headerOuterHeight) => {
    const { innerHeight } = window;
    const height = innerHeight - headerOuterHeight;
    this.setState({
      height,
    });
  };

  openInNewTab = (src) => {
    const image = new Image();
    image.src = src;
    const w = window.open('', '_blank');
    w.document.write(image.outerHTML);
  };

  save = () => {
    const src = this.sketch.toDataURL();
    const browser = detect();

    if (browser) {
      // open as an image embedded in an html page in a
      // new tab on all browsers when running on iOS
      if (browser.os === 'iOS') {
        return this.openInNewTab(src);
      }
      // when debugging for new browsers uncomment the following line
      // and uncomment the corresponding html element in index.html
      // document.querySelector('#browser').innerHTML = browser.name;
    }
    return download(src, 'sketch.png', 'image/png');
  };

  render() {
    const {
      data,
      tool,
      lineColor,
      backgroundColor,
      height,
    } = this.state;

    return (
      <div className="App">
        <Header
          clear={this.clear}
          changeColor={this.changeColor}
          setHeight={this.setHeight}
          color={lineColor}
          save={this.save}
        />
        <SketchField
          ref={(sketch) => { this.sketch = sketch; }}
          width={window.innerWidth}
          height={height}
          backgroundColor={backgroundColor}
          tool={tool}
          lineColor={lineColor}
          lineWidth={3}
          onChange={() => this.postMessage(this.sketch.toJSON())}
          value={data}
          imageFormat="png"
        />
      </div>
    );
  }
}

export default App;
