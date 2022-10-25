import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'prisma/client';

async (req: NextApiRequest, res: NextApiResponse) => {
  const availabilities = await prisma.availability.findMany({
    where: { practitionerId: +req.query.practitionerId },
  });

  res.status(200).json(availabilities);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const appointments = await prisma.appointment.findMany();
      res.status(200).json(appointments);
      break;
    case 'POST': {
      const { patientId, practitionerId, startDate, endDate } = JSON.parse(
        req.body,
      );
      const appointment = await prisma.appointment.create({
        data: {
          patientId: +patientId,
          practitionerId: +practitionerId,
          startDate: startDate,
          endDate: endDate,
        },
      });
      res.status(200).json(appointment);
      break;
    }
    case 'PUT': {
      const { id, patientId, practitionerId, startDate, endDate } = JSON.parse(
        req.body,
      );
      const appointment = await prisma.appointment.update({
        where: {
          id: id,
        },
        data: {
          patientId: +patientId,
          practitionerId: +practitionerId,
          startDate: startDate,
          endDate: endDate,
        },
      });
      res.status(200).json(appointment);
      break;
    }
    case 'DELETE':
      const appointmentId = +req.query.appointmentId;
      const appointment = await prisma.appointment.delete({
        where: {
          id: appointmentId,
        },
      });
      res.status(200).json(appointment);
  }
};
