// const targets = document.querySelectorAll('.target');
// const workspace = document.getElementById('workspace');

// let activeElement = null;
// let isDragging = false;
// let isFollowMode = false; // Режим "следующий за пальцем"
// let startX, startY, offsetX, offsetY;
// let initialX, initialY;

// // Сброс перетаскивания
// function resetElementPosition() {
//   if (activeElement) {
//     activeElement.style.top = `${initialY}px`;
//     activeElement.style.left = `${initialX}px`;
//     activeElement = null;
//   }
//   isDragging = false;
// }

// // Обработчик touchstart
// workspace.addEventListener('touchstart', (e) => {
//   const touches = e.touches;

//   if (touches.length > 1) {
//     // Второе касание — сброс перетаскивания
//     resetElementPosition();
//     return;
//   }

//   const touch = touches[0];
//   const target = e.target;

//   if (isFollowMode) {
//     // В режиме "следующий за пальцем" продолжаем следить за пальцем
//     isDragging = true;
//     startX = touch.clientX;
//     startY = touch.clientY;
//   } else if (target.classList.contains('target')) {
//     // Начало перетаскивания для целевого элемента
//     activeElement = target;
//     isDragging = true;

//     initialX = parseInt(target.style.left, 10);
//     initialY = parseInt(target.style.top, 10);

//     startX = touch.clientX;
//     startY = touch.clientY;

//     offsetX = startX - initialX;
//     offsetY = startY - initialY;
//   }
// });

// // Обработчик touchmove
// workspace.addEventListener('touchmove', (e) => {
//   if (!isDragging) return;

//   const touch = e.touches[0];
//   if (isFollowMode && activeElement) {
//     // В режиме "следующий за пальцем"
//     activeElement.style.top = `${touch.clientY - activeElement.offsetHeight / 2}px`;
//     activeElement.style.left = `${touch.clientX - activeElement.offsetWidth / 2}px`;
//   } else if (activeElement) {
//     // Обычное перетаскивание
//     activeElement.style.top = `${touch.clientY - offsetY}px`;
//     activeElement.style.left = `${touch.clientX - offsetX}px`;
//   }
// });

// // Обработчик touchend
// workspace.addEventListener('touchend', (e) => {
//   if (e.touches.length === 0) {
//     isDragging = false;

//     // Если касание было коротким и на месте — завершить режим "следующий за пальцем"
//     const timeDiff = e.timeStamp - e.changedTouches[0].timeStamp;
//     if (timeDiff < 300) {
//       isFollowMode = false;
//     }
//   }
// });

// // Двойное нажатие для включения режима "следующий за пальцем"
// workspace.addEventListener('dblclick', (e) => {
//   if (e.target.classList.contains('target')) {
//     activeElement = e.target;
//     isFollowMode = true;
//   }
// });

// // Изменение размера при двух пальцах
// workspace.addEventListener('touchstart', (e) => {
//   if (e.touches.length === 2 && activeElement) {
//     const touch1 = e.touches[0];
//     const touch2 = e.touches[1];

//     const initialDistance = Math.hypot(
//       touch2.clientX - touch1.clientX,
//       touch2.clientY - touch1.clientY
//     );

//     const initialWidth = activeElement.offsetWidth;
//     const initialHeight = activeElement.offsetHeight;

//     function resizeHandler(event) {
//       if (event.touches.length < 2) {
//         workspace.removeEventListener('touchmove', resizeHandler);
//         return;
//       }

//       const newTouch1 = event.touches[0];
//       const newTouch2 = event.touches[1];

//       const newDistance = Math.hypot(
//         newTouch2.clientX - newTouch1.clientX,
//         newTouch2.clientY - newTouch1.clientY
//       );

//       const scale = newDistance / initialDistance;

//       const newWidth = Math.max(initialWidth * scale, 30); // Минимальная ширина — 30px
//       const newHeight = Math.max(initialHeight * scale, 30); // Минимальная высота — 30px

//       activeElement.style.width = `${newWidth}px`;
//       activeElement.style.height = `${newHeight}px`;
//     }

//     workspace.addEventListener('touchmove', resizeHandler);
//   }
// });

const targets = document.querySelectorAll('.target');

let isDragging = false;
let isPinned = false;
let currentElement = null;
let offsetX, offsetY;
let originalPosition = {};
let lastTouchTime = 0;
const doubleTapDelay = 300; 
let isClickBlocked = false; 

function unpinElement(event) {
    isPinned = false;
    currentElement.style.backgroundColor = 'red'; 

    const rect = currentElement.getBoundingClientRect();
    const elementCenterX = rect.width / 2;
    const elementCenterY = rect.height / 2;

    const newLeft = event.touches[0].clientX - elementCenterX;
    const newTop = event.touches[0].clientY - elementCenterY;

    currentElement.style.left = `${newLeft}px`;
    currentElement.style.top = `${newTop}px`;
    currentElement = null;
}

function initDrag(event) {
    if (isClickBlocked) return;
    if (isPinned) {
        unpinElement(event); 
        return;
    }

    currentElement = event.currentTarget;
    isDragging = true;

    const rect = currentElement.getBoundingClientRect();
    offsetX = event.touches[0].clientX - rect.left;
    offsetY = event.touches[0].clientY - rect.top;

    originalPosition.left = parseInt(currentElement.style.left) || 0;
    originalPosition.top = parseInt(currentElement.style.top) || 0;
}

function onTouchStart(event) {
    const currentTime = Date.now();

    if (event.touches.length === 1) {
        if (currentTime - lastTouchTime <= doubleTapDelay) {
            onDoubleClick(event);
        } else if (!isPinned) {
            initDrag(event);
        }
    }

    lastTouchTime = currentTime;
}

function onEnd() {
    if (isDragging) {
        isDragging = false;
    }
}

function onMove(event) {
    if (isDragging || isPinned) {
        const clientX = event.touches[0].clientX;
        const clientY = event.touches[0].clientY;

        if (event.touches.length > 1) {
            resetPosition(); 
            return; 
        }

        currentElement.style.left = `${clientX - offsetX}px`;
        currentElement.style.top = `${clientY - offsetY}px`;
    }
}

function onDoubleClick(event) {
    isClickBlocked = true; 

    if (!isPinned) {
        isPinned = true;
        currentElement = event.currentTarget;
        currentElement.style.backgroundColor = 'blue'; 
    } else {
        unpinElement(event);
    }

    setTimeout(() => {
        isClickBlocked = false;
    }, doubleTapDelay);
}

function resetPosition() {
    if (currentElement) {
        currentElement.style.left = `${originalPosition.left}px`;
        currentElement.style.top = `${originalPosition.top}px`;
        isDragging = false;
        isPinned = false;
        currentElement.style.backgroundColor = 'red'; 
        currentElement = null;
    }
}

function onTouchEnd() {
    onEnd();
}

targets.forEach(target => {
    target.addEventListener('touchstart', onTouchStart);
    target.addEventListener('dblclick', onDoubleClick);
});

document.addEventListener('touchmove', onMove);
document.addEventListener('touchend', onTouchEnd);