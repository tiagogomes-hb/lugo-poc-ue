export default function decorate(block) {
  const [teaserWrapper] = block.children;

  const blockteaser = document.createElement('blockteaser');
  blockteaser.textContent = teaserWrapper.textContent.trim();
  teaserWrapper.replaceChildren(blockteaser);
}