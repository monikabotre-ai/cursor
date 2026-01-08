# Meme Generator

A simple web-based meme generator that allows you to upload an image and add classic top and bottom text to create memes.

## Features

- Upload any image file (JPG, PNG, GIF, etc.)
- Add top and bottom text in classic meme style
- Real-time preview on canvas
- Download your meme as a PNG image
- Responsive design that works on desktop and mobile
- Automatic text wrapping for long text
- Classic meme text styling (white text with black outline)

## How to Use

1. **Upload an Image**: Click the "Upload Image" button and select an image from your device.

2. **Add Text**: 
   - Enter your top text in the "Top Text" field
   - Enter your bottom text in the "Bottom Text" field
   - The preview updates automatically as you type

3. **Download**: Once you're happy with your meme, click the "Download Meme" button to save it as a PNG file.

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses HTML5 Canvas API for image manipulation
- No external dependencies required
- Works in all modern browsers

## File Structure

```
Meme Generator/
├── index.html    # Main HTML structure
├── style.css     # Styling and layout
├── script.js     # Core functionality
└── README.md     # This file
```

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas API
- FileReader API
- ES6 JavaScript features

## Usage Tips

- Keep text concise for best results
- The text automatically wraps if it's too long
- Font size adjusts based on image size
- The canvas maintains the original image's aspect ratio
