import { Component, Fragment } from 'preact';
import cx from 'classnames';
import axios from 'axios';

import config from '../../config';
import List from '../../components/list';
import ActionButton from '../../components/form/button/action';
import style from './style.css';
import Diff from '../../components/diff';

const buildDefaultState = () => {
	return {
		availableFiles: [],
		selectedFiles: [],
		action: undefined,
		collapsed: false,
		loading: true,
		normalizedName: undefined,
		targetFiles: [],
		error: undefined,
		option: undefined,
		progress: undefined,
	};
}

class Home extends Component {

	moveFiles = async () => {
		const { targetFiles: files } = this.state;
		const body = { files };
		try {
			const { data: progress } = await axios.post(`${config.API_URL}/api/files`, body);
			this.setState({ progress });
		} catch (e) {
			console.log(e);
		}
	}

	changeOption = (e) => {
		const { name: option } = e.target;
		this.setState({ option }, () => {
			this.normalizeElements(this.state.normalizedName);
		});
	}

	normalizeName = (e) => {
		this.normalizeElements(e.target.value);
	}

	normalizeElements = async (name) => {
		const { action: type, selectedFiles: sources, option } = this.state;
		const body = { type, name, sources, option };
		try {
			const { data = {} } = await axios.post(`${config.API_URL}/api/files/compute`, body);
			const { files: targetFiles, error, normalizedName } = data;
			this.setState({ normalizedName, targetFiles, error });
		} catch (e) {
			console.log(e);
		}
	}

	selectAction = (action) => {
		this.setState({ action, collapsed: true });
	}

	cancel = () => {
		this.setState(buildDefaultState());
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
			const { files: availableFiles, types: availableTypes } = data;
			this.setState({ availableFiles, availableTypes, loading: false });
		} catch (e) {
			console.log(e);
		}
	}

	constructor(props) {
		super(props);

		this.state = buildDefaultState();

		this.ws = new WebSocket(`${config.WSS_URL}/ws`);
	}

	componentDidMount = () => {
		this.loadFiles();

		this.ws.onclose = () => {
			console.log('WS disconnected');
		}

		this.ws.onopen = () => {
			console.log('WS connected');
		}

		this.ws.onmessage = ({ key, message }) => {
			if (key === 'RENAME_PROCESSING') {
				const progress = JSON.parse(message);
				this.setState({ progress })
			} else if (key === 'RENAME_DONE') {
				this.setState({ progress: undefined });
			}
		}

	}

	render(props, {
		availableFiles,
		availableTypes = [],
		selectedFiles,
		targetFiles,
		loading,
		action,
		collapsed,
		normalizedName = '',
		error,
		option,
		progress,
	}) {
		const nbSelected = selectedFiles.length;
		const nameValid = normalizedName.length > 0;
		const selectedType = availableTypes.find(type => type.key === action);

		if (progress) {
			const { done, total } = progress;
			const percent = done * 100 / total;
			return (
				<div class="container mt-3">
					<div class="text-center mt-5">
						<div class="progress" style={{ height: 30 }}>
							<div class="progress-bar bg-info progress-bar-striped progress-bar-animated fw-bold" role="progressbar" style={{ width: `100%` }} aria-valuenow={total} aria-valuemin="0" aria-valuemax={total}>{`${done} / ${total}`}</div>
							<div class="progress-bar bg-success progress-bar-striped progress-bar-animated fw-bold" role="progressbar" style={{ width: `${percent}%` }} aria-valuenow={done} aria-valuemin="0" aria-valuemax={total}></div>
						</div>
					</div>
				</div>
			);
		} else if (loading) {
			return (
				<div class="container mt-3">
					<div class="text-center mt-5">
						<div class="spinner-border text-info" role="status">
							<span class="visually-hidden">Chargement...</span>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div class="container mt-3">
					<div class="row">
						<div class="col-12">
							<div class={cx('card', 'overflow-hidden', 'align-items-stretch', style.animate)} style={{ height: collapsed ? 82 : 500 }}>
								<div class="card-header">
									Liste des fichiers disponibles
								</div>
								<div class="overflow-auto">
									<List elements={availableFiles} onSelect={this.toggleSelection} disabled={action} />
								</div>
								<div class="flex-fill"></div>
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
											{nbSelected} s??lectionn??{nbSelected > 1 ? 's' : ''}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row mt-3">
						<div class="text-center mx-auto">
							{availableTypes.map(({ key, label, maxSelected }) => (
								<ActionButton key={key} label={label} type={key} selectAction={this.selectAction} disabled={nbSelected === 0 || (maxSelected && maxSelected < nbSelected)} action={action} />
							))}
						</div>
					</div>
					{action && (
						<div>
							<div class="row mt-3">
								<div class="input-group input-group">
									<span class="input-group-text">Titre de la vid??o</span>
									<input type="text" class="form-control" placeholder="Entrer le titre..." onInput={this.normalizeName} />
								</div>
							</div>

							{selectedType && selectedType.options && (
								<div class="mx-auto text-center">
									<div class="btn-group mt-3" role="group">
										{selectedType.options.map((opt, idx) => (
											<Fragment key={`options-${idx}`}>
												<input type="radio" class="btn-check" name={opt.key} id={opt.key} checked={(!option && idx === 0) || opt.key === option} onClick={this.changeOption} />
												<label class="btn btn-outline-primary" for={opt.key}>{opt.label}</label>
											</Fragment>
										))}
									</div>
								</div>
							)}

							{nameValid > 0 && (
								<div class="valid-feedback d-block">
									Titre normalis?? : {normalizedName}
								</div>
							)}

							{targetFiles.length > 0 && (
								<Diff elements={targetFiles} />
							)}
						</div>
					)}
					<div class="row mt-3">
						<div class="text-end">
							<button type="button" class="btn btn-success me-3" disabled={targetFiles.length === 0 || error} onClick={this.moveFiles}>Appliquer</button>
							<button type="button" class="btn btn-danger" disabled={nbSelected === 0} onClick={this.cancel}>Annuler</button>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default Home;
