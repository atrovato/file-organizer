import Movie from './movie';
import Show from './show';

const Type = ({ type, files, ...props }) => {
  switch (type) {
    case 'movie':
      return <Movie {...props} file={files[0]} />;
    case 'show':
      return <Show {...props} />;
    default:
      return null;
  }
};

export default Type;
