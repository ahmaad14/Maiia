import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { ReactNode } from 'react';

const useStyles = makeStyles({
  table: {
    maxHeight: 200,
    overflowY: 'auto',
  },
  tableHeader: {
    background: '#ddd',
  },
});

type Props = {
  columns: string[];
  rows: ReactNode[][];
};

const CustomTable = ({ columns, rows }: Props) => {
  const classes = useStyles();
  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table>
        <TableHead className={classes.tableHeader}>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align="left">
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, index) => (
                <TableCell key={index} align="left">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
