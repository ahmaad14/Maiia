import fs from 'fs';
import prompt from 'prompt-sync';

const createEntitySlice = () => {
  const entityName = prompt()(
    'ENTER ENTITY TYPE NAME (can be imported from  @prisma/client) : ',
  ).trim();
  const endPointRoute = prompt()(
    'ENTER ENDPOINT ROUTE (e.g. "/timeslots") :',
  ).trim();

  if (!endPointRoute || !entityName) throw new Error('Invalid input');

  const sliceName = `${entityName}s`;
  const sliceNameLowerCase =
    sliceName.charAt(0).toLocaleLowerCase() + sliceName.slice(1);
  const sliceContent = `import { ${entityName} } from '@prisma/client';

import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import config from 'config';
import { parseIds } from 'store/utils';

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');

export const get${sliceName} = createAsyncThunk('get${sliceName}', async () => {
  const endPoint = SERVER_API_ENDPOINT + '${endPointRoute}';
  const response = await fetch(endPoint);
  const parsedResponse = await response.json();
  return parseIds(parsedResponse) as ${entityName}[];
});

const ${sliceNameLowerCase}Adapter = createEntityAdapter<${entityName}>();
export const ${sliceNameLowerCase}Selectors = ${sliceNameLowerCase}Adapter.getSelectors();

const ${sliceNameLowerCase}Slice = createSlice({
  name: '${sliceNameLowerCase}',
  initialState: ${sliceNameLowerCase}Adapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get${sliceName}.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(get${sliceName}.fulfilled, (state, action) => {
      ${sliceNameLowerCase}Adapter.setAll(state, action.payload);
      state.error = null;
      state.loading = false;
    });
    builder.addCase(get${sliceName}.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default ${sliceNameLowerCase}Slice;`;

  fs.writeFileSync(`./src/store/${sliceNameLowerCase}.ts`, sliceContent);

  console.info('Slice Created Successfuly!');
};

try {
  createEntitySlice();
} catch (error) {
  console.error(error);
  console.log('Failed To Create Slice ');
}
