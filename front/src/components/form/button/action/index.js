import { Fragment } from "react";
import cx from "classnames";

const ActionButton = ({ label, type, disabled, action, selectAction }) => (
  <Fragment>
    <input type="radio" name="action" class="btn-check"
      id={type}
      disabled={disabled || action}
      onClick={() => selectAction(type)}
    />
    <label for={type}
      class={cx("btn", "me-2", {
        "btn-primary": !action || action === type,
        "btn-outline-secondary": action && action !== type,
      })}
    >
      {label}
    </label>
  </Fragment>
);

export default ActionButton;