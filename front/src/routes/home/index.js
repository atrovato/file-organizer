import { Component, Fragment } from 'preact';
import cx from 'classnames';

import List from '../../components/list';
import ActionButton from '../../components/form/button/action';
import style from './style.css';
import Type from '../../components/form/type';

class Home extends Component {

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
				name: `File ${i + 1}`,
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
			loading: true,
			collapsed: false
		}
	}

	componentDidMount = () => {
		this.loadFiles();
	}

	render(props, { availableFiles, selectedFiles, loading, action, collapsed }) {
		const nbSelected = selectedFiles.length;

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
						<div class="row mt-3">
							<div class="text-center mx-auto">
								<ActionButton label="Film" type="movie" selectAction={this.selectAction} disabled={nbSelected !== 1} action={action} />
								<ActionButton label="Série" type="show" selectAction={this.selectAction} disabled={nbSelected === 0} action={action} />
							</div>
						</div>
						<div class="row mt-3">
							<Type type={action} files={selectedFiles} />
						</div>
						<div class="row mt-3">
							<div class="text-end">
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
