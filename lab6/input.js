document.addEventListener('DOMContentLoaded', function() {
    const targets = document.querySelectorAll('.target');
    let draggedElement = null;
    let isDoubleClickDrag = false;
    let initialPosition = {};
    let initialTouchPosition = {};
    let isResizing = false;
    const MIN_SIZE = 50; // Минимальный размер элемента

    targets.forEach(target => {
        // Сохраняем начальные позиции
        target.initialLeft = target.offsetLeft;
        target.initialTop = target.offsetTop;
        target.initialWidth = target.offsetWidth;
        target.initialHeight = target.offsetHeight;

        // Перетаскивание при нажатии и удержании ЛКМ или сенсорный экран
        function onDragStart(e) {
            if (isDoubleClickDrag) return;

            draggedElement = e.target;
            initialPosition = {
                left: (e.type === 'mousedown' ? e.clientX : e.touches[0].clientX) - e.target.offsetLeft,
                top: (e.type === 'mousedown' ? e.clientY : e.touches[0].clientY) - e.target.offsetTop
            };
            draggedElement.style.position = 'absolute';

            document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', onMouseMove);
            document.addEventListener(e.type === 'mousedown' ? 'mouseup' : 'touchend', onMouseUp);
        }

        target.addEventListener('mousedown', onDragStart);
        target.addEventListener('touchstart', onDragStart);

        // Двойной клик или двойное касание для прикрепления к мыши/пальцу
        target.addEventListener('dblclick', function(e) {
            draggedElement = e.target;
            isDoubleClickDrag = true;
            draggedElement.style.backgroundColor = 'lightblue'; // Изменение цвета при двойном клике

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('click', onClick);
        });

        target.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'})); // Обработка двумя пальцами как Esc
                return;
            }

            if (e.target === draggedElement && isDoubleClickDrag) {
                e.preventDefault(); // Предотвращаем срабатывание другого touchstart
            } else if (e.target === draggedElement) {
                draggedElement = null;
                isDoubleClickDrag = false;
                draggedElement.style.backgroundColor = ''; // Возврат цвета при откреплении
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('click', onClick);
            }
        }, { passive: false });

        // Обработчики для изменения размера элемента
        target.addEventListener('mousedown', function(e) {
            if (e.target === draggedElement) return;
            if (e.offsetX > target.offsetWidth - 10 && e.offsetY > target.offsetHeight - 10) {
                isResizing = true;
                draggedElement = e.target;
                document.addEventListener('mousemove', onResize);
                document.addEventListener('mouseup', onStopResize);
            }
        });

        target.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'})); // Обработка двумя пальцами как Esc
                return;
            }
            if (e.target === draggedElement) return;
            const touch = e.touches[0];
            if (touch.clientX > target.offsetLeft + target.offsetWidth - 10 &&
                touch.clientY > target.offsetTop + target.offsetHeight - 10) {
                isResizing = true;
                draggedElement = e.target;
                document.addEventListener('touchmove', onResize);
                document.addEventListener('touchend', onStopResize);
            }
        });

    });

    function onMouseMove(e) {
        if (draggedElement) {
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            draggedElement.style.left = (clientX - initialPosition.left) + 'px';
            draggedElement.style.top = (clientY - initialPosition.top) + 'px';
        }
    }

    function onMouseUp(e) {
        document.removeEventListener(e.type === 'mouseup' ? 'mousemove' : 'touchmove', onMouseMove);
        document.removeEventListener(e.type === 'mouseup' ? 'mouseup' : 'touchend', onMouseUp);
        draggedElement = null;
    }

    function onClick(e) {
        if (isDoubleClickDrag) {
            isDoubleClickDrag = false;
            draggedElement.style.backgroundColor = ''; // Возврат цвета при откреплении
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('click', onClick);
            draggedElement = null;
        }
    }

    function onResize(e) {
        if (draggedElement && isResizing) {
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            let newWidth = clientX - draggedElement.offsetLeft;
            let newHeight = clientY - draggedElement.offsetTop;

            if (newWidth > MIN_SIZE) {
                draggedElement.style.width = newWidth + 'px';
            }
            if (newHeight > MIN_SIZE) {
                draggedElement.style.height = newHeight + 'px';
            }
        }
    }

    function onStopResize(e) {
        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', onStopResize);
        document.removeEventListener('touchmove', onResize);
        document.removeEventListener('touchend', onStopResize);
        isResizing = false;
        draggedElement = null;
    }

    // Прерывание действий по нажатию Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && draggedElement) {
            if (isDoubleClickDrag) {
                draggedElement.style.backgroundColor = ''; // Возврат цвета при откреплении
                isDoubleClickDrag = false;
            }
            draggedElement.style.left = draggedElement.initialLeft + 'px';
            draggedElement.style.top = draggedElement.initialTop + 'px';
            draggedElement.style.width = draggedElement.initialWidth + 'px';
            draggedElement.style.height = draggedElement.initialHeight + 'px';
            draggedElement = null;
        }
    });
});
