import { Component, Fragment } from 'preact';
import cx from 'classnames';

import List from '../../components/list';
import ActionButton from '../../components/form/button/action';
import style from './style.css';
import normalize from '../../utils/normalize';
import Diff from '../../components/diff';

class Home extends Component {

	normalizeName = (e) => {
		const { value } = e.target;
		const normalizedName = normalize(value);
		const targetFiles = this.state.selectedFiles.map(file => {
			return {
				source: file,
				target: this.normalizeFile(normalizedName, file)
			}
		});
		this.setState({ normalizedName, targetFiles });
	}

	normalizeFile = (normalizedName, file) => {
		const { extension, name: originalName } = file;
		let name;
		let path;

		if (this.state.action === 'movie') {
			path = '/Films';
			name = normalizedName;
		} else {
			const [, season, episode] = originalName.match(/S(\d+)E(\d+)/i);
			path = `/Series/${normalizedName}/${normalizedName} - S${season}`;
			name = `${normalizedName} - S${season}E${episode}`;
		}

		return { name, path, extension };
	}

	selectAction = (action) => {
		this.setState({ action, collapsed: true });
	}

	cancel = () => {
		this.setState({ availableFiles: [], selectedFiles: [], action: undefined, collapsed: false, loading: true });
		this.loadFiles();
	}

	toggleCollapse = () => {
		const { action, collapsed } = this.state;
		if (action) {
			this.setState({ collapsed: !collapsed });
		}
	}

	toggleSelection = (index) => {
		const availableFiles = this.state.availableFiles.map(item => {
			const { id, selected = false } = item;
			const newSelection = index === id ? !selected : selected;
			return { ...item, selected: newSelection };
		});

		const selectedFiles = availableFiles.filter(i => i.selected);
		this.setState({ availableFiles, selectedFiles });
	}

	loadFiles = () => {
		const availableFiles = [];
		for (let i = 0; i < 20; i++) {
			availableFiles.push({
				id: i,
				name: `File ${i + 1} S0${i % 2 + 1}E0${i + 1}`,
				path: '/path/to/file',
				extension: 'avi'
			});
		}

		setTimeout(() => this.setState({ availableFiles, loading: false }), 2000);
	}

	constructor(props) {
		super(props);

		this.state = {
			availableFiles: [],
			selectedFiles: [],
			targetFiles: [],
			loading: true,
			collapsed: false
		}
	}

	componentDidMount = () => {
		this.loadFiles();
	}

	render(props, { availableFiles, selectedFiles, targetFiles, loading, action, collapsed, normalizedName = '' }) {
		const nbSelected = selectedFiles.length;
		const nameValid = normalizedName.length > 0;

		return (
			<div class="container mt-3">
				{loading && (
					<div class="text-center mt-5">
						<div class="spinner-border text-info" role="status">
							<span class="visually-hidden">Chargement...</span>
						</div>
					</div>
				)}
				{!loading && (
					<Fragment>
						<div class="row">
							<div class="col-12">
								<div class={cx('card', 'overflow-hidden', style.animate)} style={{ height: collapsed ? 82 : 500 }}>
									<div class="card-header">
										Liste des fichiers disponibles
									</div>
									<div class="overflow-auto">
										<List elements={availableFiles} onSelect={this.toggleSelection} disabled={action} />
									</div>
									<div class="card-footer text-end fw-lighter" onClick={this.toggleCollapse}>
										{action && (
											<i role="button" class={cx('bi', 'me-2', {
												'bi-chevron-up': !collapsed,
												'bi-chevron-down': collapsed
											})} />
										)}
										{nbSelected} sélectionné{nbSelected > 1 ? 's' : ''}
									</div>
								</div>
							</div>
						</div>
						{nbSelected > 0 && (
							<div class="row mt-3">
								<div class="text-center mx-auto">
									<ActionButton label="Film" type="movie" selectAction={this.selectAction} disabled={nbSelected !== 1} action={action} />
									<ActionButton label="Série" type="show" selectAction={this.selectAction} disabled={nbSelected === 0} action={action} />
								</div>
							</div>
						)}
						{action && (
							<div class="row mt-3">
								<div class="input-group input-group">
									<span class="input-group-text">Titre de la vidéo</span>
									<input type="text" class="form-control" placeholder="Entrer le titre..." onInput={this.normalizeName} />
								</div>

								{nameValid > 0 && (
									<div class="valid-feedback d-block">
										Titre normalisé : {normalizedName}
									</div>
								)}

								{targetFiles.length > 0 && (
									<Diff elements={targetFiles} />
								)}
							</div>
						)}
						<div class="row mt-3">
							<div class="text-end">
								<button type="button" class="btn btn-success me-3" disabled={targetFiles.length === 0}>Appliquer</button>
								<button type="button" class="btn btn-danger" disabled={nbSelected === 0} onClick={this.cancel}>Annuler</button>
							</div>
						</div>
					</Fragment>
				)}
			</div>
		);
	}
}

export default Home;
