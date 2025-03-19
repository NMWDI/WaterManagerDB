import { useState, useEffect } from "react";
import { produce } from "immer";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { gridBreakpoints, toggleStyle } from "../ActivitiesView";
import { NoteTypeLU } from "../../../interfaces";
import { WorkingOnArrivalValue } from "../../../enums";
import { useGetNoteTypes } from "../../../service/ApiServiceNew";
import { Controller, useFieldArray } from "react-hook-form";

export default function NotesSelection({ control, watch }: any) {
  const notesList = useGetNoteTypes();

  // The default notes, and user-added ones from select dropdown
  const [visibleNoteIDs, setVisibleNoteIDs] = useState<number[]>([]);

  useEffect(() => {
    if (notesList.data) {
      const defaultNotes = notesList.data.filter(
        (note: any) => note.commonly_used == true,
      );
      setVisibleNoteIDs(defaultNotes.map((note: any) => note.id));
    }
  }, [notesList.data]);

  const { append, remove } = useFieldArray({
    control,
    name: "notes.selected_note_ids",
  });

  const isSelected = (ID: number) =>
    watch("notes.selected_note_ids")?.some((x: any) => x == ID);

  const unselectNote = (ID: number) => {
    const index = watch("notes.selected_note_ids")?.findIndex(
      (x: any) => x == ID,
    );
    remove(index);
  };

  const selectNote = (ID: number) => append(ID);

  const NoteToggleButton = ({ note }: any) => (
    <Grid item xs={4} key={note.id}>
      <ToggleButton
        value="check"
        color="primary"
        selected={isSelected(note.id)}
        fullWidth
        onChange={() => {
          isSelected(note.id) ? unselectNote(note.id) : selectNote(note.id);
        }}
        sx={toggleStyle}
      >
        {note.note}
      </ToggleButton>
    </Grid>
  );

  return (
    <Box sx={{ mt: 6 }}>
      <h4 className="custom-card-header-small">Notes</h4>
      <Grid container sx={{ mt: 3 }}>
        <Grid container item {...gridBreakpoints} xs={12}>
          <Controller
            name="notes.working_on_arrival_slug"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup {...field} color="primary" exclusive>
                <ToggleButton
                  value={WorkingOnArrivalValue.NotChecked}
                  sx={toggleStyle}
                >
                  Working Status Not Checked
                </ToggleButton>
                <ToggleButton
                  value={WorkingOnArrivalValue.Working}
                  sx={toggleStyle}
                >
                  Meter Working On Arrival
                </ToggleButton>
                <ToggleButton
                  value={WorkingOnArrivalValue.NotWorking}
                  sx={toggleStyle}
                >
                  Meter Not Working On Arrival
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>
        <Grid container item xs={12} sx={{ mt: 2 }}>
          <Grid container item {...gridBreakpoints} spacing={2}>
            {notesList.data?.map((note: any) => {
              if (visibleNoteIDs.some((x) => x == note.id)) {
                return <NoteToggleButton note={note} />;
              }
            })}
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Grid item xs={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Add Other Notes</InputLabel>
              <Select
                value={""}
                label="Add Other Notes"
                onChange={(event: any) => {
                  setVisibleNoteIDs(
                    produce(visibleNoteIDs, (newNotes) => {
                      newNotes.push(event.target.value);
                    }),
                  );
                  selectNote(event.target.value);
                }}
              >
                {notesList.data?.map((nt: NoteTypeLU) => {
                  if (
                    !visibleNoteIDs.some((x) => x == nt.id) &&
                    ![
                      WorkingOnArrivalValue.Working,
                      WorkingOnArrivalValue.NotWorking,
                      WorkingOnArrivalValue.NotChecked,
                    ].some((x) => x == nt.slug)
                  ) {
                    return (
                      <MenuItem key={nt.id} value={nt.id}>
                        {nt.note}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
