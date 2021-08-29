import galleryItems from './app.js';

const refs = {
  ulJsEl: document.querySelector('.js-gallery'),
  // ulEl: document.querySelector('.gallery'),
  liEl: document.querySelector('.gallery__item'),
  // aEl: document.querySelector('gallery__link'),
  // divLightboxEl: document.querySelector('lightbox'),
  divJSLightboxEl: document.querySelector('.js-lightbox'),
  closeBtn: document.querySelector('[data-action="close-lightbox"]'),
};


const modalImageEl = refs.divJSLightboxEl.querySelector('.lightbox__image');
let modalIsOpen = false;
let imageCardNextSibling = null;


function createGalleryItems(items) {
  return items.reduce((acc, { preview, original, description }) => {
    acc = `${acc} <li class="gallery__item">
    <a
    class="gallery__link"
    href="${original}"
    >
    <img
    class="gallery__image"
    loading="lazy"
    data-src="${preview}"
    data-source="${original}"
    alt="${description}"
    width="390"
    higth="240"
    />
    </a>
    </li>
    `;
    return acc;
  }, '');
}
refs.ulJsEl.insertAdjacentHTML('beforeend', createGalleryItems(galleryItems));


function onImageClick(e) {
  
  e.preventDefault(); //

  if (!e.target.classList.contains('gallery__image')) {
    return;
  }

 

  openModalWindow(e.target);
}
refs.ulJsEl.addEventListener('click', onImageClick);


function openModalWindow(target) {
  modalIsOpen = true;


  const { source } = target.dataset;
  const gallery = target.closest('.gallery');

  imageCardNextSibling = gallery.nextElementSibling;
  imageCardNextSibling.classList.add('is-open');
  // console.log(imageCardNextSibling);

  modalImageEl.src = source;
  modalImageEl.alt = target.alt;
}


function closeModalWindow() {
  if (modalIsOpen) {
    imageCardNextSibling.classList.remove('is-open');
    modalImageEl.src = '';
    modalImageEl.alt = '';

    modalIsOpen = false;
  }
}
refs.closeBtn.addEventListener('click', closeModalWindow);


function clickToOverlay(e) {
  if (e.target.classList.contains('lightbox__overlay')) {
    closeModalWindow();
  }
}
document.addEventListener('click', clickToOverlay);


function keydownToEsc(e) {
  if (e.keyCode === 27) {
    closeModalWindow();
  }
}
window.addEventListener('keydown', keydownToEsc);


function keydownToArrowRightAndLeft(e) {
  const clickToLeftArrow = e.keyCode === 37;
  const clickToRightArrow = e.keyCode === 39;

  if (modalIsOpen && (clickToLeftArrow || clickToRightArrow)) {
    const { src } = modalImageEl;
    const foundIndex = galleryItems.findIndex(item => item.original === src);
    let item = null;

    if (foundIndex === 0 && clickToLeftArrow) {
      item = galleryItems[galleryItems.length - 1];
    } else if (foundIndex === galleryItems.length - 1 && clickToRightArrow) {
      item = galleryItems[0];
    } else if (clickToLeftArrow) {
      item = galleryItems[foundIndex - 1];
    } else {
      item = galleryItems[foundIndex + 1];
    }

    if (item) {
      modalImageEl.src = item.original;
      modalImageEl.alt = item.description;
    }
  }
}
window.addEventListener('keydown', keydownToArrowRightAndLeft);


function addSrcAttrToLazyImages() {
  // attr - attribute
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  
  lazyImages.forEach(image =>
    image.addEventListener('load', onImageLoaded, { once: true }),
  );
  function onImageLoaded(e) {
    console.log('Картинка загрузилась');
  }

  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  });
}
function addLazySizesScript() {
  const script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  script.integrity =
    'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==';
  script.crossorigin = 'anonymous';
  script.referrerpolicy = 'no-referrer';

  document.body.appendChild(script);
}
// feature detection js(выявление возможностей браузера)
if ('loading' in HTMLImageElement.prototype) {
  console.log('Браузер поддерживает lazyload');
  addSrcAttrToLazyImages();
} else {
  console.log('Браузер НЕ поддерживает lazyload');
  addLazySizesScript();
}
