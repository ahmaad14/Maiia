import fs from 'fs';
import prompt from 'prompt-sync';

const createEntitySlice = () => {
  const entityName = prompt()(
    'ENTER ENTITY TYPE NAME (can be imported from  @prisma/client) : ',
  );
  const endPointRoute = prompt()('ENTER ENDPOINT ROUTE (e.g. "/timeslots") :');

  if (!endPointRoute || !entityName) throw new Error('Invalid input');

  const entityNameLowerCase = entityName.toLowerCase();
  const sliceBoilerplate = `import { ${entityName} } from '@prisma/client';

import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import config from 'config';
import { parseIds } from 'store/utils';

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');

export const get${entityName} = createAsyncThunk('get${entityName}s', async () => {
  const endPoint = SERVER_API_ENDPOINT + '/' + '${endPointRoute}';
  const response = await fetch(endPoint);
  const parsedResponse = await response.json();
  return parseIds(parsedResponse) as ${entityName}[];
});

const ${entityNameLowerCase}Adapter = createEntityAdapter<${entityName}>();
export const ${entityNameLowerCase}Selectors = ${entityNameLowerCase}Adapter.getSelectors();

const ${entityNameLowerCase}sSlice = createSlice({
  name: '${entityNameLowerCase}',
  initialState: ${entityNameLowerCase}Adapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get${entityName}.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(get${entityName}.fulfilled, (state, action) => {
      ${entityNameLowerCase}Adapter.setAll(state, action.payload);
      state.error = null;
      state.loading = false;
    });
    builder.addCase(get${entityName}.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default ${entityNameLowerCase}sSlice;
`;

  fs.writeFileSync(`./src/store/${entityNameLowerCase}s.ts`, sliceBoilerplate);

  console.info('Slice Created Successfuly!');
};

try {
  createEntitySlice();
} catch (error) {
  console.error(error);
  console.log('Failed To Create Slice ');
}
