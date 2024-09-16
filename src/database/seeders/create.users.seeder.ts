// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { DataSource } from 'typeorm';
// import { UserEntity } from '../entities/user.entity';
// import { v4 as uuidv4 } from 'uuid';
// import { hashSync as encrypt } from 'bcrypt';

// export default class UserSeeder implements Seeder {
//   public async run(
//     dataSource: DataSource,
//     factoryManager: SeederFactoryManager,
//   ): Promise<void> {
//     await dataSource.query('TRUNCATE "users" RESTART IDENTITY;');

//     const repository = dataSource.getRepository(UserEntity);
//     await repository.insert({
//       id: Buffer.from(uuidv4().replace(/-/g, ''), 'hex'),
//       name: 'Marcio Super admin',
//       email: 'superadmin@scheduling.com',
//       role: 'super-admin',
//       password: encrypt('marcio123', 15),
//       isActive: true,
//       emailVerified: true,
//     });
//     await repository.insert({
//       id: Buffer.from(uuidv4().replace(/-/g, ''), 'hex'),
//       name: 'Marcio admin',
//       email: 'admin@scheduling.com',
//       role: 'admin',
//       password: encrypt('marcio123', 15),
//       isActive: true,
//       emailVerified: true,
//     });
//     await repository.insert({
//       id: Buffer.from(uuidv4().replace(/-/g, ''), 'hex'),
//       name: 'Marcio Support',
//       email: 'superadmin@scheduling.com',
//       role: 'support',
//       password: encrypt('marcio123', 15),
//       isActive: true,
//       emailVerified: true,
//     });
//   }
// }
