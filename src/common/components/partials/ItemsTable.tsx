import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
import MenuPopover from '@common/components/lib/utils/MenuPopover/MenuPopover';
import { CRUD_ACTION, CrudRoutes, CrudRow, Id } from '@common/defs/types';
import usePermissions from '@modules/permissions/hooks/usePermissions';
import { UseItems } from '@common/hooks/useItems';
import { Cancel, DeleteOutline, Edit, MoreVert } from '@mui/icons-material';
import { Box, Button, Card, IconButton, MenuItem } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {
  DataGrid,
  frFR,
  GridColumns,
  GridToolbar,
  GridEnrichedColDef,
  GridSortModel,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ItemsTableProps<Item, CreateOneInput, UpdateOneInput, Row> {
  namespace: string;
  routes: CrudRoutes;
  useItems: UseItems<Item, CreateOneInput, UpdateOneInput>;
  columns: GridColumns;
  itemToRow: (item: Item) => Row;
  sortModel?: GridSortModel;
}

const ItemsTable = <Item, CreateOneInput, UpdateOneInput, Row extends CrudRow>(
  props: ItemsTableProps<Item, CreateOneInput, UpdateOneInput, Row>
) => {
  const { namespace, routes, useItems, columns: initColumns, itemToRow, sortModel } = props;
  const router = useRouter();
  const { items, deleteOne, cancelOne, restoreOne } = useItems({ fetchItems: true });
  const { can, canNot } = usePermissions();
  const [rows, setRows] = useState<Row[]>([]);
  const [toDeleteId, setToDeleteId] = useState<Id | null>(null);
  const [toCancelId, setToCancelId] = useState<Id | null>(null);
  const [toRestoreId, setToRestoreId] = useState<Id | null>(null);
  const [columns, setColumns] = useState<GridColumns>(initColumns);
  useEffect(() => {
    const actionsColumn: GridEnrichedColDef<Row> = {
      field: 'actions',
      headerName: 'Actions',
      filterable: false,
      sortable: false,
      width: 120,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

        const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        };

        const handleMenuClose = () => {
          setAnchorEl(null);
        };

        if (canNot(namespace, CRUD_ACTION.DELETE) && canNot(namespace, CRUD_ACTION.UPDATE) && canNot(namespace, CRUD_ACTION.CANCEL)){ 
          return null;
        }
        return (
          <Box sx={{ width: '100%', textAlign: 'right' }}>
            <IconButton color={anchorEl ? 'inherit' : 'default'} onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <MenuPopover
              open={anchorEl}
              onClose={handleMenuClose}
              arrow="right-top"
              sx={{ width: 140 }}
            >
              {can(namespace, CRUD_ACTION.UPDATE, params.row.id) && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push(routes.UpdateOne.replace('{id}', params.row.id.toString()));
                  }}
                >
                  <Edit /> Edit
                </MenuItem>
              )}
              {!params.row.isCanceled && can(namespace, CRUD_ACTION.CANCEL) && (
                <MenuItem
                  onClick={() => {
                    setToCancelId(params.row.id);
                    handleMenuClose();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Cancel /> Cancel
                </MenuItem>
              )}
              {params.row.isCanceled
                ? can(namespace, CRUD_ACTION.CANCEL) && (
                    <MenuItem
                      onClick={() => {
                        setToRestoreId(params.row.id);
                        handleMenuClose();
                      }}
                      sx={{ color: 'success.main' }}
                    >
                      <Cancel /> Restore
                    </MenuItem>
                  )
                : null}
              {can(namespace, CRUD_ACTION.DELETE) && (
                <MenuItem
                  onClick={() => {
                    setToDeleteId(params.row.id);
                    handleMenuClose();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteOutline /> Delete
                </MenuItem>
              )}
            </MenuPopover>
          </Box>
        );
      },
    };
    setColumns([...columns, actionsColumn]);
  }, []);
  useEffect(() => {
    if (items) {
      const itemsRows = items.map((item) => itemToRow(item));
      setRows(itemsRows);
    }
  }, [items]);
  return (
    <>
      <Card>
        <Box sx={{ height: 550 }}>
          {!items ? (
            <>
              <Grid
                container
                spacing={1}
                columns={{ sm: 2, md: 4, lg: 6 }}
                paddingX={4}
                marginTop={6}
              >
                {Array.from(Array(24)).map((_, index) => (
                  <Grid xs={1} key={index}>
                    <Skeleton variant="rectangular" height={45} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              <DataGrid
                disableSelectionOnClick
                pagination
                rows={rows}
                columns={columns}
                //localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                components={{
                  Toolbar: GridToolbar,
                }}
                initialState={{
                  sorting: {
                    sortModel: sortModel ?? [
                      {
                        field: 'createdAt',
                        sort: 'desc',
                      },
                    ],
                  },
                }}
              />
              <ConfirmDialog
                open={toDeleteId !== null}
                onClose={() => setToDeleteId(null)}
                title="Supprimer"
                content={
                  <Typography variant="body1" color="textSecondary">
                    Are you sure you want to delete this item? <br /> This action is irreversible.
                  </Typography>
                }
                action={
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (toDeleteId) {
                        deleteOne(toDeleteId, { displayProgress: true, displaySuccess: true });
                        setToDeleteId(null);
                      }
                    }}
                  >
                    Delete
                  </Button>
                }
              />
              <ConfirmDialog
                open={toCancelId !== null}
                onClose={() => setToCancelId(null)}
                title="Cancel"
                content={
                  <Typography variant="body1" color="textSecondary">
                    Are you sure you want to cancel this event?
                  </Typography>
                }
                action={
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (toCancelId) {
                        cancelOne(toCancelId, { displayProgress: true, displaySuccess: true });
                        setToCancelId(null);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                }
              />
              <ConfirmDialog
                open={toRestoreId !== null}
                onClose={() => setToRestoreId(null)}
                title="Restore"
                content={
                  <Typography variant="body1" color="textSecondary">
                    Are you sure you want to restore this event?
                  </Typography>
                }
                action={
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      if (toRestoreId) {
                        restoreOne(toRestoreId, { displayProgress: true, displaySuccess: true });
                        setToRestoreId(null);
                      }
                    }}
                  >
                    Restore
                  </Button>
                }
              />
            </>
          )}
        </Box>
      </Card>
    </>
  );
};

export default ItemsTable;
