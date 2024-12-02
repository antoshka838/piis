const targets = document.querySelectorAll('.target');

let isDragging = false; // Флаг перетаскивания
let isPinned = false; // Флаг режима "закрепления"
let currentElement = null; // Активный элемент
let offsetX, offsetY; // Смещения
let originalPosition = {}; // Исходная позиция элемента
let lastTouchTime = 0; // Время последнего касания
const doubleTapDelay = 300; // Интервал для двойного касания
let isClickBlocked = false; // Блокировка кликов при двойном касании

// Сброс позиции элемента
function resetPosition() {
  if (currentElement) {
    currentElement.style.left = `${originalPosition.left}px`;
    currentElement.style.top = `${originalPosition.top}px`;
    isDragging = false;
    isPinned = false;
    currentElement.style.backgroundColor = 'red'; // Индикатор сброса
    currentElement = null;
  }
}

// Начало перетаскивания
function initDrag(event) {
  if (isClickBlocked) return;
  if (isPinned) {
    return; // В режиме "закрепления" игнорируем обычное перетаскивание
  }

  currentElement = event.currentTarget;
  isDragging = true;

  const rect = currentElement.getBoundingClientRect();
  offsetX = event.touches[0].clientX - rect.left;
  offsetY = event.touches[0].clientY - rect.top;

  originalPosition.left = parseInt(currentElement.style.left) || 0;
  originalPosition.top = parseInt(currentElement.style.top) || 0;
}

// Обработчик touchstart
function onTouchStart(event) {
  const currentTime = Date.now();

  if (event.touches.length === 1) {
    if (currentTime - lastTouchTime <= doubleTapDelay) {
      onDoubleClick(event); // Двойное касание
    } else if (!isPinned) {
      initDrag(event); // Начало перетаскивания
    }
  }

  if (event.touches.length > 1) {
    // Второе касание сбрасывает элемент
    resetPosition();
  }

  lastTouchTime = currentTime;
}

// Обработчик движения touchmove
function onMove(event) {
  if (isDragging || isPinned) {
    const clientX = event.touches[0].clientX;
    const clientY = event.touches[0].clientY;

    currentElement.style.left = `${clientX - offsetX}px`;
    currentElement.style.top = `${clientY - offsetY}px`;
  }
}

// Обработчик touchend
function onTouchEnd() {
  isDragging = false; // Завершаем перетаскивание
}

// Обработчик двойного нажатия
function onDoubleClick(event) {
  isClickBlocked = true; // Блокируем дополнительные клики

  if (!isPinned) {
    // Включаем режим "закрепления"
    isPinned = true;
    currentElement = event.currentTarget;
    currentElement.style.backgroundColor = 'green'; // Индикатор закрепления
  } else {
    // Выключаем режим "закрепления"
    resetPosition();
  }

  setTimeout(() => {
    isClickBlocked = false;
  }, doubleTapDelay);
}

// Привязываем события
targets.forEach((target) => {
  target.addEventListener('touchstart', onTouchStart);
  target.addEventListener('dblclick', onDoubleClick);
});

document.addEventListener('touchmove', onMove);
document.addEventListener('touchend', onTouchEnd);
