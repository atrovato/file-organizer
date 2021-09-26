import cx from 'classnames';

const List = ({ elements = [], onSelect, disabled }) => (
  <div class="list-group">
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
        disabled={disabled}
      >
        {name}
        <br />
        <small class="text-muted fw-light">{path}</small>
      </button>
    ))}
  </div>
);

export default List;
