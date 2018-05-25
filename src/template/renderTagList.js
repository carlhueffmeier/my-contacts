import { trim } from '../helper/utils';

export default function renderTagList({ tags, activeTag }) {
  return tags
    .map(
      tag => trim`
      <li class="menu__item">
        <a class="menu__link" href="#">${tag}</a>
      </li>`
    )
    .join('');
}
