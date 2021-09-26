// Code-splitting is automated for `routes` directory
import Header from './header';
import Home from '../routes/home';

const App = () => (
	<div id="app">
		<Header />
		<Home path="/" />
	</div>
)

export default App;
