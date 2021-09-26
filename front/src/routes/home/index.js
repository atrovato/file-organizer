import { Component, Fragment } from 'preact';
import List from '../../components/list';

class Home extends Component {

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
				path: '/path/to/file'
			});
		}

		setTimeout(() => this.setState({ availableFiles, loading: false }), 2000);
	}

	constructor(props) {
		super(props);

		this.state = {
			availableFiles: [],
			selectedFiles: [],
			loading: true
		}
	}

	componentDidMount = () => {
		this.loadFiles();
	}

	render(props, { availableFiles, selectedFiles, loading }) {
		const nbSelected = selectedFiles.length;

		return (
			<div class="container">
				{loading && (
					<div class="text-center">
						<div class="spinner-border text-info" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
				)}
				{!loading && (
					<Fragment>
						<div class="row">
							<div class="col-12">
								<div class="card overflow-hidden" style={{ height: 500 }}>
									<div class="card-header">
										Liste des fichiers disponibles
									</div>
									<div class="overflow-auto">
										<List elements={availableFiles} onSelect={this.toggleSelection} />
									</div>
									<div class="card-footer text-end fw-lighter">
										{nbSelected} sélectionné{nbSelected > 1 ? 's' : ''}
									</div>
								</div>
							</div>
						</div>
						<div class="row mt-5">
							<div class="text-center mx-auto">
								<button type="button" class="btn btn-primary me-2" disabled={nbSelected !== 1}>Film</button>
								<button type="button" class="btn btn-primary" disabled={nbSelected === 0}>Série</button>
							</div>
						</div>
					</Fragment>
				)}
			</div>
		);
	}
};

export default Home;
