const targets = document.querySelectorAll('.target');
const workspace = document.getElementById('workspace');

let activeElement = null;
let isDragging = false;
let isFollowMode = false; // Режим "следующий за пальцем"
let startX, startY, offsetX, offsetY;
let initialX, initialY;

// Сброс перетаскивания
function resetElementPosition() {
  if (activeElement) {
    activeElement.style.top = `${initialY}px`;
    activeElement.style.left = `${initialX}px`;
    activeElement = null;
  }
  isDragging = false;
}

// Обработчик touchstart
workspace.addEventListener('touchstart', (e) => {
  const touches = e.touches;

  if (touches.length > 1) {
    // Второе касание — сброс перетаскивания
    resetElementPosition();
    return;
  }

  const touch = touches[0];
  const target = e.target;

  if (isFollowMode) {
    // В режиме "следующий за пальцем" продолжаем следить за пальцем
    isDragging = true;
    startX = touch.clientX;
    startY = touch.clientY;
  } else if (target.classList.contains('target')) {
    // Начало перетаскивания для целевого элемента
    activeElement = target;
    isDragging = true;

    initialX = parseInt(target.style.left, 10);
    initialY = parseInt(target.style.top, 10);

    startX = touch.clientX;
    startY = touch.clientY;

    offsetX = startX - initialX;
    offsetY = startY - initialY;
  }
});

// Обработчик touchmove
workspace.addEventListener('touchmove', (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  if (isFollowMode && activeElement) {
    // В режиме "следующий за пальцем"
    activeElement.style.top = `${touch.clientY - activeElement.offsetHeight / 2}px`;
    activeElement.style.left = `${touch.clientX - activeElement.offsetWidth / 2}px`;
  } else if (activeElement) {
    // Обычное перетаскивание
    activeElement.style.top = `${touch.clientY - offsetY}px`;
    activeElement.style.left = `${touch.clientX - offsetX}px`;
  }
});

// Обработчик touchend
workspace.addEventListener('touchend', (e) => {
  if (e.touches.length === 0) {
    isDragging = false;

    // Если касание было коротким и на месте — завершить режим "следующий за пальцем"
    const timeDiff = e.timeStamp - e.changedTouches[0].timeStamp;
    if (timeDiff < 300) {
      isFollowMode = false;
    }
  }
});

// Двойное нажатие для включения режима "следующий за пальцем"
workspace.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('target')) {
    activeElement = e.target;
    isFollowMode = true;
  }
});

// Изменение размера при двух пальцах
workspace.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2 && activeElement) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const initialDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );

    const initialWidth = activeElement.offsetWidth;
    const initialHeight = activeElement.offsetHeight;

    function resizeHandler(event) {
      if (event.touches.length < 2) {
        workspace.removeEventListener('touchmove', resizeHandler);
        return;
      }

      const newTouch1 = event.touches[0];
      const newTouch2 = event.touches[1];

      const newDistance = Math.hypot(
        newTouch2.clientX - newTouch1.clientX,
        newTouch2.clientY - newTouch1.clientY
      );

      const scale = newDistance / initialDistance;

      const newWidth = Math.max(initialWidth * scale, 30); // Минимальная ширина — 30px
      const newHeight = Math.max(initialHeight * scale, 30); // Минимальная высота — 30px

      activeElement.style.width = `${newWidth}px`;
      activeElement.style.height = `${newHeight}px`;
    }

    workspace.addEventListener('touchmove', resizeHandler);
  }
});
