document.addEventListener('DOMContentLoaded', function() {
    const drawingArea = document.getElementById('drawingArea');
    let currentShape = 'circle';
    let startX, startY;
    let drawingElement = null;

    document.querySelectorAll('input[name="shape"]').forEach(input => {
        input.addEventListener('change', function() {
            currentShape = this.value;
        });
    });

    drawingArea.addEventListener('mousedown', function(e) {
        startX = e.offsetX;
        startY = e.offsetY;
        if (currentShape === 'circle') {
            drawingElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            drawingElement.setAttribute('cx', startX);
            drawingElement.setAttribute('cy', startY);
            drawingElement.setAttribute('r', 0);
            drawingElement.setAttribute('fill', 'red');  // Красный цвет для круга
        } else if (currentShape === 'rectangle') {
            drawingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            drawingElement.setAttribute('x', startX);
            drawingElement.setAttribute('y', startY);
            drawingElement.setAttribute('width', 0);
            drawingElement.setAttribute('height', 0);
            drawingElement.setAttribute('fill', 'blue');  // Синий цвет для прямоугольника
        }
        drawingElement.setAttribute('stroke', 'black');
        drawingArea.appendChild(drawingElement);
        drawingArea.addEventListener('mousemove', draw);
        document.addEventListener('mouseup', stopDrawing);
    });

    function draw(e) {
        if (currentShape === 'circle') {
            const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
            drawingElement.setAttribute('r', radius);
        } else if (currentShape === 'rectangle') {
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;
            drawingElement.setAttribute('width', Math.abs(width));
            drawingElement.setAttribute('height', Math.abs(height));
            drawingElement.setAttribute('x', width < 0 ? e.offsetX : startX);
            drawingElement.setAttribute('y', height < 0 ? e.offsetY : startY);
        }
    }

    function stopDrawing() {
        drawingArea.removeEventListener('mousemove', draw);
        document.removeEventListener('mouseup', stopDrawing);
        drawingElement = null;
    }
});
