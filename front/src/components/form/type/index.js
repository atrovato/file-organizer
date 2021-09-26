import Movie from './movie';
import Show from './show';

const Type = ({ type, ...props }) => {
  switch (type) {
    case 'movie':
      return <Movie {...props} />;
    case 'show':
      return <Show {...props} />;
    default:
      return null;
  }
};

export default Type;
