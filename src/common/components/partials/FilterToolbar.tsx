import useFilter from '@common/hooks/useFilter';
import { LocationOn, Search } from '@mui/icons-material';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
  Paper,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface FilterToolbarProps {
  filterItems: ReturnType<typeof useFilter>;
}

const FilterToolbar = (props: FilterToolbarProps) => {
  const {
    search,
    date,
    location,
    eventStatus,
    activityStatus,
    notFull,
    setSearch,
    setDate,
    setLocation,
    setEventStatus,
    setActivityStatus,
    setNotFull,
  } = props.filterItems;
  return (
    <Paper sx={{ p: 1.5 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date" value={date} onChange={(newValue) => setDate(newValue)} />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <TextField
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LocationOn />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Select
            variant="outlined"
            value={eventStatus}
            onChange={(e) => setEventStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="past">Past</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Select
            variant="outlined"
            value={activityStatus}
            onChange={(e) => setActivityStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={notFull} onChange={(e) => setNotFull(e.target.checked)} />}
            label="Not Full"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterToolbar;
