import { Component } from "preact";

import normalize from "../../../../utils/normalize";

class Movie extends Component {

  normalize = (e) => {
    const { value } = e.target;
    const normalized = normalize(value);
    this.setState({ normalized });
  }

  render({ file }, { normalized = '' }) {
    const valid = normalized.length > 0;

    return (
      <div class="container-fluid">
        <div class="input-group input-group">
          <span class="input-group-text">Titre du film</span>
          <input type="text" class="form-control" placeholder="Entrer le titre du film" onInput={this.normalize} />
        </div>

        {valid > 0 && (
          <div class="valid-feedback d-block">
            Nom de fichier final : {normalized}.{file.extension}
          </div>
        )}
      </div>
    )
  }
}

export default Movie;
