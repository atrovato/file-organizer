import cx from 'classnames';

const Line = ({ dir, base, size, error }) => (
  <div class={`col-${size}`}>
    {base}
    <br />
    <small class="text-muted fw-light">{dir}</small>
  </div>
);

const Diff = ({ elements = [] }) => (
  <div class="container-fluid">
    <div class="list-group">
      {elements.length !== 0 && elements.map(({ source, target, error }, key) => (
        <div class={cx('list-group-item', 'list-group-item-action', 'list-group-item-light', {
          'bg-warning': error,
          'fw-bold': error,
        })} key={`diff-${key}`}>
          <div class="row">
            <Line {...source} size={5} />
            <div class="col-1"><i class="bi bi-chevron-double-right" /></div>
            <Line {...target} size={6} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Diff;
