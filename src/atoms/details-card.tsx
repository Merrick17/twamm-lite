export interface Props {
  name: string;
  data: string;
}

export default ({ data, name }: Props) => {
  const dataArr = data?.split("|") ?? [];

  return (
    <div className="w-36 flex justify-center py-3 my-2">
      <div className="text-sm p-1 text-center border-0 text-white/70">
        <p className="whitespace-nowrap">{name}</p>
        {dataArr.length <= 1 && <span>{data ?? "-"}</span>}
        {dataArr.length > 1 && (
          <div className="flex flex-col">
            {dataArr.map((d, i) => {
              const key = `${d}-${i}`;

              return <span key={key}>{d}</span>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
