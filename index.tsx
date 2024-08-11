import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Ensure this CSS file exists and is properly loaded

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

class ColorPickerPlugin {
  private colorPickerWindow?: HTMLDivElement;

  constructor() {
    this.start();
  }

  start() {
    // Inject CSS file
    this.injectCSS();

    // Create the button and append it to the header
    this.addColorPickerButton();
  }

  stop() {
    // Remove the button and color picker window when the plugin is disabled
    this.removeColorPickerButton();
    if (this.colorPickerWindow) {
      ReactDOM.unmountComponentAtNode(this.colorPickerWindow);
      this.colorPickerWindow.remove();
    }
  }

  injectCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('index.css'); // Adjust path to where index.css is located
    document.head.appendChild(link);
  }

  addColorPickerButton() {
    const button = document.createElement('button');
    button.textContent = 'Open Color Picker';
    button.className = 'custom-button';
    button.onclick = () => this.showColorPickerWindow();
    
    // Use a more reliable way to find or append to the header
    const header = document.querySelector('[data-dy-header]'); // This is an example selector; use the correct one for your case
    if (header) {
      header.appendChild(button);
    }
  }

  removeColorPickerButton() {
    const button = document.querySelector('.custom-button');
    if (button) {
      button.remove();
    }
  }

  createColorPickerWindow() {
    this.colorPickerWindow = document.createElement('div');
    this.colorPickerWindow.className = 'color-picker-container'; // Ensure styling for positioning
    document.body.appendChild(this.colorPickerWindow);

    ReactDOM.render(
      <ColorPickerWindow onClose={() => {
        if (this.colorPickerWindow) {
          ReactDOM.unmountComponentAtNode(this.colorPickerWindow);
          this.colorPickerWindow.remove();
          this.colorPickerWindow = undefined; // Clear reference
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

// Export the plugin
export default ColorPickerPlugin;

// Initialize plugin
const plugin = new ColorPickerPlugin();

// Optionally handle plugin lifecycle (start and stop) based on your setup
// For example, you can start the plugin here or handle it in a different way
