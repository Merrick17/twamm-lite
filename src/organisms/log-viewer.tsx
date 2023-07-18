const LogItems = (props: { logs: string[] }) => (
  <>
    {props.logs.map((message: string, i) => (
      /* eslint-disable-next-line react/no-array-index-key */
      <li key={`log-${i}-${message}`}>{message}</li>
    ))}
  </>
);

export default ({ logs }: { logs: string[] | undefined }) => {
  if (!logs) return null;

  return (
    <div className="mt-1">
      <ul className="border-gray-500 rounded-md overflow-y-scroll webkit-scrollbar w-full p-1 h-10">
        <LogItems logs={logs} />
      </ul>
    </div>
  );
};
