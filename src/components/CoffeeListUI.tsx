"use client";
import * as React from "react";
import { use, useState } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlotProps,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import { ICoffee } from "@/interfaces/ICoffeeLog";
import { v4 as uuidv4 } from "uuid";
import {
  patchCoffeeList,
  postCoffeeList,
  deleteCoffeeList,
} from "@/components/CoffeeListActions";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    rows: GridRowsProp<ICoffee>;
    setRows: (
      newRows: (oldRows: GridRowsProp<ICoffee>) => GridRowsProp<ICoffee>,
    ) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

function EditToolbar(props: GridSlotProps["toolbar"]) {
  const { rows, setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = rows[rows.length - 1].id + 1;
    const today = dayjs()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0)
      .utc()
      .toDate();
    setRows(
      (oldRows: GridRowsProp<ICoffee>): GridRowsProp<ICoffee> => [
        ...oldRows,
        {
          roasting_facility: "",
          coffee_name: "",
          size_g: 250,
          roast_date: today,
          open_date: today,
          price: 0,
          country_of_origin: "",
          id,
          isNew: true,
        },
      ],
    );
    setRowModesModel((oldModel: GridRowModesModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "roasting_facility" },
    }));
  };

  return (
    <Toolbar>
      <Tooltip title="Add record">
        <ToolbarButton onClick={handleClick}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}

export default function CoffeeListUI({
  data,
  apiUrl,
}: {
  data: Promise<ICoffee[]>;
  apiUrl: string;
}) {
  const coffeList: ICoffee[] = use(data);
  const [rows, setRows] = useState<GridRowsProp<ICoffee>>(coffeList);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    setRows(rows.filter((row: ICoffee) => row.id !== id));
    const result = await deleteCoffeeList(apiUrl, parseInt(id.toString()));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row: ICoffee) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row: ICoffee) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel<ICoffee>) => {
    const oldRows = [...rows];
    const updatedRow: ICoffee = {
      ...newRow,
      isNew: false,
    };
    setRows(
      rows.map((row: ICoffee) => (row.id === newRow.id ? updatedRow : row)),
    );
    let result = false;

    if (newRow.isNew) {
      result = await postCoffeeList(apiUrl, updatedRow);
    } else {
      result = await patchCoffeeList(apiUrl, updatedRow.id, updatedRow);
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "roasting_facility",
      headerName: "Rösterei",
      width: 120,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "coffee_name",
      headerName: "Kaffee",
      width: 200,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "country_of_origin",
      headerName: "Herkunftsland",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "size_g",
      headerName: "Größe (g)",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "roast_date",
      headerName: "Röstdatum",
      width: 120,
      editable: true,
      type: "date",
      valueGetter: (value) => dayjs(value).toDate(),
    },
    {
      field: "open_date",
      headerName: "Öffnungsdatum",
      width: 120,
      editable: true,
      type: "date",
      valueGetter: (value) => dayjs(value).toDate(),
    },
    {
      field: "price",
      headerName: "Preis",
      width: 80,
      editable: true,
      type: "number",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={uuidv4()}
              icon={<SaveIcon />}
              label="Save"
              material={{
                sx: {
                  color: "primary.main",
                },
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={uuidv4()}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={uuidv4()}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={uuidv4()}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { rows, setRows, setRowModesModel },
        }}
        showToolbar
      />
    </Box>
  );
}
