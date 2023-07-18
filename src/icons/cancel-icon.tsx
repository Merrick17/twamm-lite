const CancelIcon = ({ height, width }: { height: number; width: number }) => (
  <div className="flex items-center text-red-600 rounded-full fill-current">
    <svg
      fill="inherit"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>cancel</title>
      <path
        d="M16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13
             13zM16 6c-5.522 0-10 4.478-10 
      10s4.478 10 10 10c5.523 0 10-4.478 10-10s-4.477-10-10-10zM20.537 19.535l-1.014
       1.014c-0.186 0.186-0.488 0.186-0.675 0l-2.87-2.87-2.87 2.87c-0.187 0.186-0.488
        0.186-0.675 0l-1.014-1.014c-0.186-0.186-0.186-0.488 
        0-0.675l2.871-2.869-2.871-2.87c-0.186-0.187-0.186-0.489
         0-0.676l1.014-1.013c0.187-0.187 0.488-0.187 0.675 0l2.87 2.87 2.87-2.87c0.187-0.187
          0.489-0.187 0.675 0l1.014 1.013c0.186 0.187 0.186 0.489 0 0.676l-2.871 2.87 2.871 
          2.869c0.186 0.187 0.186 0.49 0 0.675z"
      />
    </svg>
  </div>
);

export default CancelIcon;
