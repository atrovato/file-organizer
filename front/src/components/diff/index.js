const Line = ({ name, path, extension, size }) => (
  <div class={`col-${size}`}>
    {name}.{extension}
    <br />
    <small class="text-muted fw-light">{path}</small>
  </div>
);

const Diff = ({ elements = [] }) => (
  <div class="container-fluid">
    <div class="list-group">
      {elements.length !== 0 && elements.map(({ source, target }, key) => (
        <div class="list-group-item list-group-item-action list-group-item-light" key={`diff-${key}`}>
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
