export default function createImageNodeUsingTemplate ({ templateId, photo, size }) {
  const resultNode = createNodeFromTemplate(templateId);
  const image = resultNode.querySelector('img');
  const description = photo.description._content;

  resultNode.classList.add('is-loading');
  resultNode.description = description;
  image.onload = () => {
    resultNode.classList.remove('is-loading');
  }
  resultNode.querySelector('.description').textContent = description;

  // Start loading
  image.src = photo[`url_${size}`];

  return resultNode;
}

function createNodeFromTemplate (templateId) {
  return document
    .querySelector(`#template-${templateId}`)
    .childNodes[0]
    .cloneNode(true);
}
