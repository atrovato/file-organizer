import cx from 'classnames';

const List = ({ elements = [], onSelect, disabled }) => (
  <div class="list-group">
    {elements.length === 0 && (
      <div class="text-center mt-5">Aucun fichier</div>
    )}
    {elements.length !== 0 && elements.map((item, key) => (
      <button class={cx('list-group-item list-group-item-action', {
        'list-group-item-light': !item.selected,
        'list-group-item-info': item.selected
      })}
        type="button"
        key={`file-${key}`}
        onClick={() => onSelect(item)}
        disabled={disabled}
      >
        {item.base}
        <br />
        <small class="text-muted fw-light">{item.dir}</small>
      </button>
    ))}
  </div>
);

export default List;
