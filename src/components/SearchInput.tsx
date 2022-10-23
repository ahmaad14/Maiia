import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

type Props = {
  onChange: (searchValue) => void;
  placeHolder: string;
};

const SearchInput = ({ onChange, placeHolder }: Props) => {
  return (
    <TextField
      type="search"
      variant="outlined"
      margin="normal"
      placeholder={placeHolder}
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
