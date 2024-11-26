import Link from '../Link';
import Button from '../../components/Form/Button';

export default function ToNextPage(props) {
  return (
    <Link to={props.nextPage}>
      <Button>
        <p>
          {props.description}
        </p>
      </Button>
    </Link>
  );
}
