document.addEventListener('DOMContentLoaded', function() {
    const targets = document.querySelectorAll('.target');
    let draggedElement = null;
    let isDoubleClickDrag = false;
    let initialPosition = {};

    targets.forEach(target => {
        // Сохраняем начальные позиции
        target.initialLeft = target.offsetLeft;
        target.initialTop = target.offsetTop;

        // Перетаскивание при нажатии и удержании ЛКМ
        target.addEventListener('mousedown', function(e) {
            if (isDoubleClickDrag) return;

            draggedElement = e.target;
            initialPosition = { left: e.clientX - e.target.offsetLeft, top: e.clientY - e.target.offsetTop };
            draggedElement.style.position = 'absolute';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Двойной клик для прикрепления к мыши
        target.addEventListener('dblclick', function(e) {
            draggedElement = e.target;
            isDoubleClickDrag = true;
            draggedElement.style.backgroundColor = 'lightblue'; // Изменение цвета при двойном клике

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('click', onClick);
        });
    });

    function onMouseMove(e) {
        if (draggedElement) {
            draggedElement.style.left = (e.clientX - initialPosition.left) + 'px';
            draggedElement.style.top = (e.clientY - initialPosition.top) + 'px';
        }
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        draggedElement = null;
    }

    function onClick() {
        if (isDoubleClickDrag) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('click', onClick);
            isDoubleClickDrag = false;
            draggedElement.style.backgroundColor = ''; // Возврат цвета при откреплении
            draggedElement = null;
        }
    }

    // Прерывание действий по нажатию Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && draggedElement) {
            if (isDoubleClickDrag) {
                draggedElement.style.backgroundColor = ''; // Возврат цвета при откреплении
                isDoubleClickDrag = false;
            }
            // Возврат на исходную позицию
            draggedElement.style.left = draggedElement.initialLeft + 'px';
            draggedElement.style.top = draggedElement.initialTop + 'px';
            draggedElement = null;
        }
    });
});
