import { Plugin } from '@vencord/plugin';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface ColorPickerProps {
  onClose: () => void;
}

const ColorPickerWindow: React.FC<ColorPickerProps> = ({ onClose }) => {
  const [color, setColor] = useState<string>('#7289da');
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    document.documentElement.style.setProperty('--custom-button-bg-color', color);
    document.documentElement.style.setProperty('--custom-button-bg-opacity', opacity.toString());
  }, [color, opacity]);

  return (
    <div className="color-picker-window">
      <button className="close-button" onClick={onClose}>Close</button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={(e) => setOpacity(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default class ColorPickerPlugin extends Plugin {
  private colorPickerWindow?: HTMLDivElement;

  start() {
    // Inject the CSS file
    this.injectCSS(require('./index.css'));

    // Create the button and append it to the header
    const button = document.createElement('button');
    button.textContent = 'Open Color Picker';
    button.className = 'custom-button';
    button.onclick = () => this.showColorPickerWindow();
    
    const header = document.querySelector('.header-2h-9H9');
    if (header) {
      header.appendChild(button);
    }
  }

  stop() {
    // Remove the button and color picker window when the plugin is disabled
    const button = document.querySelector('.custom-button');
    if (button) {
      button.remove();
    }
    if (this.colorPickerWindow) {
      ReactDOM.unmountComponentAtNode(this.colorPickerWindow);
      this.colorPickerWindow.remove();
    }
  }

  createColorPickerWindow() {
    // Create the color picker window element
    this.colorPickerWindow = document.createElement('div');
    document.body.appendChild(this.colorPickerWindow);

    // Render the ColorPickerWindow component into the color picker window
    ReactDOM.render(
      <ColorPickerWindow onClose={() => {
        if (this.colorPickerWindow) {
          ReactDOM.unmountComponentAtNode(this.colorPickerWindow);
          this.colorPickerWindow.remove();
        }
      }} />,
      this.colorPickerWindow
    );
  }

  showColorPickerWindow() {
    if (!this.colorPickerWindow) {
      this.createColorPickerWindow();
    } else {
      this.colorPickerWindow.style.display = 'block';
    }
  }
}

