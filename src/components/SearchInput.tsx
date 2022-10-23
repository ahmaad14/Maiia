import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

type Props = {
  onChange: (searchValue) => void;
};

const SearchInput = ({ onChange }: Props) => {
  return (
    <TextField
      type="search"
      variant="outlined"
      margin="normal"
      placeholder="search by name"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;
