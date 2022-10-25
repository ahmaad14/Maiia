import { Appointment } from '@prisma/client';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import config from 'config';
import { parseIds } from 'store/utils';
import AppointmentFormValues from 'types/AppointmentFormValues';

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');

export const getAppointments = createAsyncThunk('getAppointments', async () => {
  const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`);
  const parsedResponse = await response.json();
  return parseIds(parsedResponse) as Appointment[];
});

export const addAppointment = createAsyncThunk(
  'addAppointment',
  async (appointment: AppointmentFormValues) => {
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
    const parsedResponse = await response.json();
    return parsedResponse;
  },
);

export const updateAppointment = createAsyncThunk(
  'updateAppointment',
  async (appointment: AppointmentFormValues) => {
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
    const parsedResponse = await response.json();
    return parsedResponse;
  },
);

export const deleteAppointment = createAsyncThunk(
  'deleteAppointment',
  async (appointmentId: number) => {
    const response = await fetch(
      `${SERVER_API_ENDPOINT}/appointments?appointmentId=${appointmentId}`,
      {
        method: 'DELETE',
      },
    );
    const parsedResponse = await response.json();
    return parsedResponse;
  },
);

const appointmentAdapter = createEntityAdapter<Appointment>();

export const appointmentSelectors = appointmentAdapter.getSelectors();
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: appointmentAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAppointments.fulfilled, (state, action) => {
      appointmentAdapter.setAll(state, action.payload);
      state.error = null;
      state.loading = false;
    });
    builder.addCase(getAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(addAppointment.fulfilled, (state, action) => {
      appointmentAdapter.addOne(state, action.payload);
    });
    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      appointmentAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      appointmentAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default appointmentsSlice;
