import { Component } from 'preact';
import cx from 'classnames';

class List extends Component {

  render({ elements = [], onSelect }) {
    return <div class="list-group">
      {elements.length === 0 && (
        <div class="text-center mt-5">Aucun fichier</div>
      )}
      {elements.length !== 0 && elements.map(({ name, path, selected = false, id }, key) => (
        <button class={cx('list-group-item list-group-item-action', {
          'list-group-item-light': !selected,
          'list-group-item-info': selected
        })}
          type="button"
          key={`file-${key}`}
          onClick={() => onSelect(id)}
        >
          {name}
          <br />
          <small class="text-muted fw-light">{path}</small>
        </button>
      ))}
    </div>
  }
}

export default List;
