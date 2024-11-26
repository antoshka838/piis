document.addEventListener('DOMContentLoaded', function() {
  const targets = document.querySelectorAll('.target');
  let draggedElement = null;
  let isDragging = false;
  let isDoubleTapDrag = false;
  let startX, startY, initialLeft, initialTop;
  let doubleTapTimeout = null;

  // Сохраняем исходные позиции и цвета элементов
  const initialStyles = new Map();
  targets.forEach(target => {
      initialStyles.set(target, {
          left: target.style.left,
          top: target.style.top,
          backgroundColor: target.style.backgroundColor
      });
      target.addEventListener('mousedown', startDrag);
      target.addEventListener('touchstart', handleTouchStart, { passive: false });
      target.addEventListener('dblclick', handleDoubleClick);
  });

  function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      draggedElement = e.target;
      startX = e.clientX || e.touches[0].clientX;
      startY = e.clientY || e.touches[0].clientY;
      initialLeft = parseInt(draggedElement.style.left || 0);
      initialTop = parseInt(draggedElement.style.top || 0);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('touchend', endDrag);
  }

  function handleTouchStart(e) {
      if (e.touches.length === 2) {
          resetPositions();
          return;
      }

      if (doubleTapTimeout) {
          clearTimeout(doubleTapTimeout);
          doubleTapTimeout = null;
          handleDoubleClick(e);
          startDoubleTapDrag(e);
      } else {
          doubleTapTimeout = setTimeout(() => {
              doubleTapTimeout = null;
              startDrag(e);
          }, 300);
      }
  }

  function handleDoubleClick(e) {
      const target = e.target;
      target.style.backgroundColor = 'yellow';  // Меняем цвет на желтый при двойном клике
  }

  function startDoubleTapDrag(e) {
      isDoubleTapDrag = true;
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('touchend', endDoubleTapDrag);
  }

  function drag(e) {
      if (isDragging || isDoubleTapDrag) {
          e.preventDefault();
          const clientX = e.clientX || e.touches[0].clientX;
          const clientY = e.clientY || e.touches[0].clientY;
          draggedElement.style.left = `${initialLeft + clientX - startX}px`;
          draggedElement.style.top = `${initialTop + clientY - startY}px`;
      }
  }

  function endDrag() {
      isDragging = false;
      if (draggedElement) {
          const initialStyle = initialStyles.get(draggedElement);
          draggedElement.style.backgroundColor = initialStyle.backgroundColor;  // Возвращаем исходный цвет при отпускании
      }
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', endDrag);
  }

  function endDoubleTapDrag(e) {
      if (e.touches.length === 0) {
          isDoubleTapDrag = false;
          if (draggedElement) {
              const initialStyle = initialStyles.get(draggedElement);
              draggedElement.style.backgroundColor = initialStyle.backgroundColor;  // Возвращаем исходный цвет при отпускании
          }
          document.removeEventListener('touchmove', drag);
          document.removeEventListener('touchend', endDoubleTapDrag);
      }
  }

  function resetPositions() {
      targets.forEach(target => {
          const initialStyle = initialStyles.get(target);
          target.style.left = initialStyle.left;
          target.style.top = initialStyle.top;
          target.style.backgroundColor = initialStyle.backgroundColor;  // Возвращаем исходный цвет
      });
      isDragging = false;
      draggedElement = null;
  }

  // Обработка нажатия на клавишу Esc
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          resetPositions();
      }
  });
});
