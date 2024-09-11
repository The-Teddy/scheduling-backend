// appointment.controller.ts
import { Request, Response } from 'express';
import { AppointmentService } from './appointment.service';

export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  async getAppointmentDetails(req: Request, res: Response) {
    const { appointmentId } = req.params;

    try {
      const { appointment, service } =
        await this.appointmentService.getAppointmentAndService(
          Number(appointmentId),
        );

      res.json({
        appointment,
        service,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}
