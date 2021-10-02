import { Component, Fragment } from 'preact';
import cx from 'classnames';
import axios from 'axios';

import config from '../../config';
import List from '../../components/list';
import ActionButton from '../../components/form/button/action';
import style from './style.css';
import normalize from '../../utils/normalize';
import Diff from '../../components/diff';

const TEMPLATES = {
	season: {
		pattern: /S(\d+)EP?(\d+)/i,
		formatDir: (normalizedName, matchResult) => `/Series/${normalizedName}/${normalizedName} - S${matchResult[1]}`,
		formatName: (normalizedName, matchResult) => `${normalizedName} - S${matchResult[1]}E${matchResult[2]}`
	},
	episode: {
		pattern: /(\d+)/i,
		formatDir: (normalizedName) => `/Series/${normalizedName}`,
		formatName: (normalizedName, matchResult) => `${normalizedName} - E${matchResult[1]}`,
	}
};

class Home extends Component {

	changeShowMode = () => {
		let { showMode, normalizedName = '' } = this.state;

		if (showMode == 'season') {
			showMode = 'episode';
		} else {
			showMode = 'season';
		}

		this.setState({ showMode }, () => {
			if (normalizedName.length > 0) {
				this.normalizeElements(normalizedName);
			}
		});
	}

	normalizeName = (e) => {
		this.normalizeElements(e.target.value);
	}

	normalizeElements = (value) => {
		const normalizedName = normalize(value);
		let error;
		const targetFiles = this.state.selectedFiles.map(file => {
			const target = this.normalizeFile(normalizedName, file);
			error = error || target.error;
			return {
				source: file,
				target,
				error: target.error,
			}
		});
		this.setState({ normalizedName, targetFiles, error });
	}

	normalizeFile = (normalizedName, file) => {
		const { ext, name: originalName } = file;
		let name;
		let dir;
		let error;

		if (this.state.action === 'movie') {
			dir = '/Films';
			name = normalizedName;
		} else if (this.state.action === 'show') {
			const { showMode = 'season' } = this.state;
			const { pattern, formatDir, formatName } = TEMPLATES[showMode]

			if (pattern.test(originalName)) {
				const matchResult = originalName.match(pattern);
				dir = formatDir(normalizedName, matchResult);
				name = formatName(normalizedName, matchResult);
			} else {
				error = 'Not managed file pattern';
			}
		} else {
			error = 'Not managed video type';
		}

		return { name, dir, ext, base: `${name}${ext}`, error };
	}

	selectAction = (action) => {
		this.setState({ action, collapsed: true });
	}

	cancel = () => {
		this.setState({
			availableFiles: [],
			selectedFiles: [],
			action: undefined,
			collapsed: false,
			loading: true,
			normalizedName: undefined,
			targetFiles: [],
			error: undefined,
			showMode: 'season',
		});
		this.loadFiles();
	}

	toggleCollapse = () => {
		const { action, collapsed } = this.state;
		if (action) {
			this.setState({ collapsed: !collapsed });
		}
	}

	toggleSelection = (selected) => {
		const { dir: selectedDir, base: selectedBase } = selected;
		const selectedPath = `${selectedDir}-${selectedBase}`;

		const availableFiles = this.state.availableFiles.map(item => {
			const { selected = false, dir, base } = item;
			const curFilePath = `${dir}-${base}`;
			const newSelection = selectedPath === curFilePath ? !selected : selected;
			return { ...item, selected: newSelection };
		});

		const selectedFiles = availableFiles.filter(i => i.selected);
		this.setState({ availableFiles, selectedFiles });
	}

	selectAll = () => {
		const availableFiles = this.state.availableFiles.map(item => {
			return { ...item, selected: true };
		});

		this.setState({ availableFiles, selectedFiles: availableFiles });
	}

	unselectAll = () => {
		const availableFiles = this.state.availableFiles.map(item => {
			return { ...item, selected: false };
		});

		this.setState({ availableFiles, selectedFiles: [] });
	}

	loadFiles = async () => {
		try {
			const { data = {} } = await axios.get(`${config.API_URL}/api/files`);
			const { files: availableFiles } = data;
			this.setState({ availableFiles, loading: false });
		} catch (e) {
			console.log(e);
		}
	}

	constructor(props) {
		super(props);

		this.state = {
			availableFiles: [],
			selectedFiles: [],
			targetFiles: [],
			loading: true,
			collapsed: false,
			showMode: 'season',
		}
	}

	componentDidMount = () => {
		this.loadFiles();
	}

	render(props, { availableFiles, selectedFiles, targetFiles, loading, action, collapsed, normalizedName = '', error, showMode = 'season' }) {
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
									<div class="card-footer fw-lighter justify-content-end row">
										{!action && (
											<div class="col-8">
												<div role="button" class="d-inline me-3" onClick={this.selectAll}>
													Select all
												</div>
												<div role="button" class="d-inline" onClick={this.unselectAll}>
													Deselect all
												</div>
											</div>
										)}
										<div class="col-4 text-end">
											<div role="button" class="d-inline" onClick={this.toggleCollapse}>
												{action && (
													<i class={cx('bi', 'me-2', {
														'bi-chevron-up': !collapsed,
														'bi-chevron-down': collapsed
													})} />
												)}
												{nbSelected} sélectionné{nbSelected > 1 ? 's' : ''}
											</div>
										</div>
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
									{action === 'show' && (
										<span class="input-group-text">
											<label for="showMode" class="me-2">Par saison</label>
											<input type="checkbox" id="showMode" checked={showMode === 'season'} onClick={this.changeShowMode}></input>
										</span>
									)}
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
								<button type="button" class="btn btn-success me-3" disabled={targetFiles.length === 0 || error}>Appliquer</button>
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
