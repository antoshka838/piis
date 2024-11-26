document.addEventListener('DOMContentLoaded', function() {
    const drawingCanvas = document.getElementById('drawingCanvas');
    const ctx = drawingCanvas.getContext('2d');
    let currentShape = 'circle';
    let startX, startY;
    let isDrawing = false;

    document.querySelectorAll('input[name="shape"]').forEach(input => {
        input.addEventListener('change', function() {
            currentShape = this.value;
        });
    });

    drawingCanvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
        drawingCanvas.addEventListener('mousemove', draw);
        document.addEventListener('mouseup', stopDrawing);
    });

    function draw(e) {
        if (!isDrawing) return;
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        if (currentShape === 'circle') {
            const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';  // Красный цвет для круга
            ctx.fill();
            ctx.stroke();
        } else if (currentShape === 'rectangle') {
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;
            ctx.fillStyle = 'blue';  // Синий цвет для прямоугольника
            ctx.fillRect(startX, startY, width, height);
            ctx.strokeRect(startX, startY, width, height);
        }
    }

    function stopDrawing() {
        isDrawing = false;
        drawingCanvas.removeEventListener('mousemove', draw);
        document.removeEventListener('mouseup', stopDrawing);
    }
});
