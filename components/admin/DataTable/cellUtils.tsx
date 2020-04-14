import {CellProps, Renderer} from 'react-table';

export const createCell = <D extends object>(
  renderFunction: Renderer<CellProps<D>>,
): Renderer<CellProps<D>> => renderFunction;
