// appointment.service.ts
import { getRepository } from 'typeorm';
import { AppointmentEntity } from 'src/database/entities/appointment.entity';
import { ServiceEntity } from 'src/database/entities/service.entity';

export class AppointmentService {
  async getAppointmentAndService(appointmentId: number) {
    // Obter o repositório do agendamento
    const appointmentRepository = getRepository(AppointmentEntity);

    // Buscar o agendamento pelo ID
    const appointment = await appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['service'], // Carregar a relação com o serviço
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Retornar o agendamento e o serviço associado
    return {
      appointment,
      service: appointment.service,
    };
  }
}
