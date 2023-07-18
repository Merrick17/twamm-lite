import UpIcon from 'src/icons/up-icon';
import DownIcon from 'src/icons/down-icon';

export interface Props {
  sort: 'asc' | 'desc' | null | undefined;
  field: string;
  onChange: (arg0: { field: string; sort: 'asc' | 'desc' | undefined }) => void;
}

export default (props: Props) => {
  const toggleAsc = () => {
    props.onChange({
      field: props.field,
      sort: props.sort === 'asc' ? undefined : 'asc',
    });
  };

  const toggleDesc = () => {
    props.onChange({
      field: props.field,
      sort: props.sort === 'desc' ? undefined : 'desc',
    });
  };

  return (
    <div className="relative flex flex-col">
      <div className="top-[-3px]" onClick={toggleAsc}>
        {props.sort === 'asc' ? (
          <UpIcon height={10} width={10} color="skyblue" />
        ) : (
          <UpIcon height={10} width={10} color="#000" />
        )}
      </div>
      <div onClick={toggleDesc} className="top-[-6px]">
        {props.sort === 'desc' ? (
          <DownIcon height={10} width={10} color="skyblue" />
        ) : (
          <DownIcon height={10} width={10} color="#000" />
        )}
      </div>
    </div>
  );
};
