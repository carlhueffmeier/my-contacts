import { trim, isDefined } from '../helper/utils';

export default function renderTagList({ tags, selectedTag }) {
  return tags
    .map(
      tag => trim`
      <li class="menu__item ${
        tag.id === selectedTag ? 'menu__item--active' : ''
      }">
        <a class="menu__link--tag" href="#" data-tag-id="${tag.id}">
          ${tag.label}
        </a>
      </li>`
    )
    .join('');
}
