// Get DOM elements
const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const topTextColor = document.getElementById('topTextColor');
const topStrokeColor = document.getElementById('topStrokeColor');
const bottomTextColor = document.getElementById('bottomTextColor');
const bottomStrokeColor = document.getElementById('bottomStrokeColor');
const canvas = document.getElementById('memeCanvas');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');
const downloadBtn = document.getElementById('downloadBtn');
const templatesGrid = document.getElementById('templatesGrid');
const ctx = canvas.getContext('2d');

let uploadedImage = null;
const maxCanvasWidth = 800;
const padding = 20;

// Template images from assets folder
const templateImages = [
    'assets/Group picture 1.jpeg',
    'assets/Screenshot (25).png'
];

// Get color value display elements
const topTextColorValue = topTextColor.parentElement.querySelector('.color-value');
const topStrokeColorValue = topStrokeColor.parentElement.querySelector('.color-value');
const bottomTextColorValue = bottomTextColor.parentElement.querySelector('.color-value');
const bottomStrokeColorValue = bottomStrokeColor.parentElement.querySelector('.color-value');

// Update color value display
function updateColorValue(colorInput, valueElement) {
    valueElement.textContent = colorInput.value.toUpperCase();
}

// Load template images
function loadTemplates() {
    templateImages.forEach((imagePath, index) => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.setAttribute('data-index', index);
        
        const templateImg = document.createElement('img');
        templateImg.src = imagePath;
        templateImg.alt = `Template ${index + 1}`;
        templateImg.className = 'template-thumbnail';
        
        // Handle image load error
        templateImg.onerror = function() {
            templateItem.style.display = 'none';
        };
        
        templateItem.appendChild(templateImg);
        templatesGrid.appendChild(templateItem);
        
        // Add click event to use template
        templateItem.addEventListener('click', function() {
            useTemplate(imagePath);
            // Add active state to clicked template
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Use template image
function useTemplate(imagePath) {
    const img = new Image();
    img.onload = function() {
        uploadedImage = img;
        drawMeme();
    };
    img.onerror = function() {
        console.error('Failed to load template image:', imagePath);
    };
    img.src = imagePath;
}

// Initialize canvas
function initCanvas() {
    canvas.style.display = 'none';
    canvasPlaceholder.style.display = 'flex';
    downloadBtn.disabled = true;
    // Initialize color value displays
    updateColorValue(topTextColor, topTextColorValue);
    updateColorValue(topStrokeColor, topStrokeColorValue);
    updateColorValue(bottomTextColor, bottomTextColorValue);
    updateColorValue(bottomStrokeColor, bottomStrokeColorValue);
    // Load templates
    loadTemplates();
}

// Handle image upload
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            uploadedImage = img;
            drawMeme();
            // Remove active state from templates when uploading custom image
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Draw meme on canvas
function drawMeme() {
    if (!uploadedImage) return;

    // Calculate canvas dimensions while maintaining aspect ratio
    let canvasWidth = Math.min(uploadedImage.width, maxCanvasWidth);
    let canvasHeight = (uploadedImage.height / uploadedImage.width) * canvasWidth;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.display = 'block';
    canvasPlaceholder.style.display = 'none';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

    // Draw text
    const topText = topTextInput.value.trim();
    const bottomText = bottomTextInput.value.trim();

    if (topText || bottomText) {
        // Set base text style
        ctx.textAlign = 'center';
        ctx.lineWidth = Math.max(canvas.width / 200, 2);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;

        // Calculate font size based on canvas width
        const fontSize = Math.max(canvas.width / 15, 24);
        ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;

        // Draw top text
        if (topText) {
            ctx.textBaseline = 'top';
            ctx.fillStyle = topTextColor.value;
            ctx.strokeStyle = topStrokeColor.value;
            const topY = padding;
            drawTextWithStroke(topText, canvas.width / 2, topY);
        }

        // Draw bottom text
        if (bottomText) {
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = bottomTextColor.value;
            ctx.strokeStyle = bottomStrokeColor.value;
            const bottomY = canvas.height - padding;
            drawTextWithStroke(bottomText, canvas.width / 2, bottomY);
        }
    }

    // Enable download button
    downloadBtn.disabled = false;
}

// Draw text with stroke (outline)
function drawTextWithStroke(text, x, y) {
    // Split text into lines if it's too long
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > canvas.width - (padding * 2)) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    // Draw each line
    const lineHeight = ctx.measureText('M').width * 1.2;
    const startY = y - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, index) => {
        const lineY = startY + (index * lineHeight);
        // Draw stroke first (outline)
        ctx.strokeText(line, x, lineY);
        // Then draw fill (text)
        ctx.fillText(line, x, lineY);
    });
}

// Update meme when text changes
topTextInput.addEventListener('input', drawMeme);
bottomTextInput.addEventListener('input', drawMeme);

// Update meme when colors change
topTextColor.addEventListener('input', function() {
    updateColorValue(topTextColor, topTextColorValue);
    drawMeme();
});
topStrokeColor.addEventListener('input', function() {
    updateColorValue(topStrokeColor, topStrokeColorValue);
    drawMeme();
});
bottomTextColor.addEventListener('input', function() {
    updateColorValue(bottomTextColor, bottomTextColorValue);
    drawMeme();
});
bottomStrokeColor.addEventListener('input', function() {
    updateColorValue(bottomStrokeColor, bottomStrokeColorValue);
    drawMeme();
});

// Handle download
downloadBtn.addEventListener('click', function() {
    if (!uploadedImage) return;

    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meme.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
});

// Initialize on page load
initCanvas();
