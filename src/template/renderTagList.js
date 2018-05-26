import { trim } from '../helper/utils';

export default function renderTagList({ tags, activeTag }) {
  return tags
    .map(
      tag => trim`
      <li class="menu__item">
        <a class="menu__link--tag" href="#" data-tag-id="${tag.id}">${
        tag.label
      }</a>
      </li>`
    )
    .join('');
}
