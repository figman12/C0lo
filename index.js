
export default class ColorPickerPlugin extends Plugin {
  start() {
    // Inject the CSS file
    this.injectCSS(require("./index.css"));

    // Create the button and append it to the header
    const button = document.createElement("button");
    button.textContent = "Open Color Picker";
    button.className = "custom-button";
    button.onclick = () => this.showColorPickerWindow();
    
    const header = document.querySelector(".header-2h-9H9");
    if (header) {
      header.appendChild(button);
    }

    // Create the color picker window
    this.createColorPickerWindow();
  }

  stop() {
    // Remove the button and color picker window when the plugin is disabled
    const button = document.querySelector(".custom-button");
    if (button) {
      button.remove();
    }
    const window = document.querySelector(".color-picker-window");
    if (window) {
      window.remove();
    }
  }

  createColorPickerWindow() {
    // Create the color picker window element
    const colorPickerWindow = document.createElement("div");
    colorPickerWindow.className = "color-picker-window";

    // Create the color input
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#7289da"; // Default value

    // Create the transparency input
    const transparencyInput = document.createElement("input");
    transparencyInput.type = "range";
    transparencyInput.min = "0";
    transparencyInput.max = "1";
    transparencyInput.step = "0.01";
    transparencyInput.value = "1"; // Default value

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "Close";
    closeButton.onclick = () => {
      colorPickerWindow.style.display = "none";
    };

    // Append inputs and close button to the color picker window
    colorPickerWindow.appendChild(closeButton);
    colorPickerWindow.appendChild(colorInput);
    colorPickerWindow.appendChild(transparencyInput);
    
    // Append the color picker window to the body
    document.body.appendChild(colorPickerWindow);

    // Event listener for applying the selected color and transparency
    colorInput.oninput = () => {
      document.documentElement.style.setProperty("--custom-button-bg-color", colorInput.value);
    };

    transparencyInput.oninput = () => {
      document.documentElement.style.setProperty("--custom-button-bg-opacity", transparencyInput.value);
    };
  }

  showColorPickerWindow() {
    // Show the color picker window when the button is clicked
    const colorPickerWindow = document.querySelector(".color-picker-window");
    if (colorPickerWindow) {
      colorPickerWindow.style.display = "block";
    }
  }
}
