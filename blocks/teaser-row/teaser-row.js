export default function decorate(block) {
  [...block.children].forEach((row) => {
    const imgoverlay = document.createElement('div');
    imgoverlay.classList.add('image-overlay');
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'teaser-image';
      else imgoverlay.append(div);
    });
    row.append(imgoverlay);
  });
}
