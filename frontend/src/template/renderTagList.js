// Renders a clickable list of tags
export default function renderTagList({ tags, selectedTag }) {
  return tags
    .map(
      tag => `
        <li class="menu__item ${
          tag._id === selectedTag ? 'menu__item--active' : ''
        }">
          <a class="menu__link--tag" href="#" data-tag-id="${tag._id}">
            ${tag.label}
          </a>
        </li>`
    )
    .join('');
}
