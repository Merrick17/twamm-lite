import type { FC, ReactNode } from 'react';
import type {
  GridCellParams,
  GridSortItem,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { useCallback, useMemo } from 'react';

import Alert from 'src/atoms/alert';
import Loading from 'src/atoms/loading';
import IntervalProgress from '../atoms/interval-progress';
import SortControl from '../atoms/sort-control';

export interface SortItem extends GridSortItem {}

export type SortModel = SortItem[];

export type RowId = string | number;

export type SelectionModel = RowId[];

export interface ValueGetterParams<V = any> {
  row: RowModel;
  value: V;
}

export interface ComparatorFn<V, R = any> {
  (v1: V, v2: V, row1: R, row2: R): number;
}

export interface ColDef<V = any, R = any> {
  field: string;
  hideable: boolean;
  resizeable?: boolean;
  renderCell?: (arg0: R) => ReactNode;
  sortable: boolean;
  headerName?: string;
  sortComparator?: ComparatorFn<V, RowModel>;
  valueGetter?: (params: ValueGetterParams) => V;
}

export interface RowModel extends GridValidRowModel {
  id: string;
}

export interface RowParams<R extends RowModel = any> {
  id: RowId;
  row: R;
  columns: ColDef[];
}

type RenderCellDef<T = ReactNode> = (
  arg0: Pick<GridCellParams, 'row' | 'value'>
) => T;

export interface Props {
  checkboxSelection: boolean; // eslint-disable-line react/no-unused-prop-types
  columns: ColDef[];
  error: Error | undefined;
  filterColumnField?: string; // eslint-disable-line react/no-unused-prop-types
  loading: boolean;
  onRowClick: (arg0: RowParams) => void;
  onSelectionModelChange?: (arg0: SelectionModel) => void; // eslint-disable-line react/no-unused-prop-types,max-len
  onSortModelChange: (arg0: SortModel) => void;
  rows: RowModel[];
  selectionModel?: SelectionModel; // eslint-disable-line react/no-unused-prop-types
  sortModel: SortModel; // eslint-disable-line react/no-unused-prop-types
  updating: boolean;
  updatingInterval: number;
}

const Header = (props: {
  columns: Props['columns'];
  onSortModelChange: Props['onSortModelChange'];
  sortModel: Props['sortModel'];
  updating: Props['updating'];
  updatingInterval: Props['updatingInterval'];
}) => {
  const onSortModelChange = (sortModelItem: SortItem) =>
    props.onSortModelChange(!sortModelItem.sort ? [] : [sortModelItem]);

  return (
    <thead className="text-sm text-gray-700 capitalize bg-gray-50">
      <tr>
        {props.columns.map((c) => (
          <th
            key={c.field}
            scope="col"
            className="px-3 py-5 bg-[#E5E7EB] text-black/60"
          >
            {c.field === 'pre' ? (
              <IntervalProgress
                interval={props.updatingInterval}
                refresh={props.updating}
              />
            ) : (
              <span className="flex flex-row items-center gap-x-3 whitespace-nowrap">
                {c.headerName}
                {!c.sortable ? null : (
                  <SortControl
                    sort={
                      c.field === props.sortModel[0].field
                        ? props.sortModel[0].sort
                        : undefined
                    }
                    field={c.field}
                    onChange={onSortModelChange}
                  />
                )}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

function sortComparator<T>(a: T, b: T) {
  if (a === b) return 0;

  return ((c, d) => (c < d ? -1 : 1))(a, b);
}

const Rows = (props: {
  columns: Props['columns'];
  onRowClick: Props['onRowClick'];
  rows: Props['rows'];
}) => (
  <tbody>
    {props.rows.map((r) => (
      <tr
        key={r.id}
        onClick={() =>
          props.onRowClick({
            id: r.id,
            row: r,
            columns: props.columns,
          })
        }
        className="bg-[#191B1F] text-white/60 transition cursor-pointer duration-300 ease-in-out
         hover:bg-[#26272a] border-t border-gray-500"
      >
        {props.columns.map((c) => {
          const name = c.field;
          const key = name;
          const val = r[name];
          const CellComponent = c.renderCell as
            | RenderCellDef<ReturnType<FC>>
            | undefined;

          const value = c.valueGetter
            ? c.valueGetter({ row: r, value: val })
            : val;

          return CellComponent ? (
            <td className="whitespace-nowrap px-6 py-4">
              <CellComponent row={r} value={value} />
            </td>
          ) : (
            <td key={key} className="whitespace-nowrap px-6 py-4">
              {value}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
);

export default (props: Props) => {
  const onSortModelChange = useCallback(
    (sortModel: SortModel) => {
      props.onSortModelChange(sortModel);
    },
    [props]
  );

  const columns = useMemo(() => props.columns, [props.columns]);

  const statuses = useMemo(() => {
    if (props.loading && !props.rows.length)
      return <Loading height={8} width={8} />;

    if (props.error)
      return <Alert severity="error">{props.error.message}</Alert>;

    return undefined;
  }, [props.error, props.loading, props.rows]);

  const rows = useMemo(() => {
    const [sortItem] = props.sortModel;

    if (!sortItem?.sort) return props.rows;

    const targetColumn = columns.find((c) => c.field === sortItem.field);

    return props.rows.sort((a, b) => {
      const aValue = a[sortItem.field];
      const bValue = b[sortItem.field];

      if (targetColumn?.sortComparator)
        return targetColumn.sortComparator(aValue, bValue, a, b);

      return sortItem.sort === 'asc'
        ? sortComparator(aValue, bValue)
        : sortComparator(bValue, aValue);
    });
  }, [columns, props.rows, props.sortModel]);

  return (
    <div className="w-full h-full relative overflow-x-auto shadow-md sm:rounded-lg webkit-scrollbar">
      <table className="w-full text-sm text-left text-gray-500">
        <Header
          columns={props.columns}
          onSortModelChange={onSortModelChange}
          sortModel={props.sortModel}
          updating={props.updating}
          updatingInterval={props.updatingInterval}
        />
        {statuses ? null : (
          <Rows columns={columns} onRowClick={props.onRowClick} rows={rows} />
        )}
      </table>
      {!rows.length && (
        <div className="my-2">
          <Alert severity="success">No data to display</Alert>
        </div>
      )}
      {statuses ? (
        <div className="w-full h-full flex justify-center mt-4">{statuses}</div>
      ) : null}
    </div>
  );
};
