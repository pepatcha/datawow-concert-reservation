import dataSource from '../typeorm.config';
import { User, UserRole } from '../users/entities/user.entity';

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);

  const existingUsers = await userRepo.find();
  if (existingUsers.length > 0) {
    console.log('Users already seeded, skipping...');
    await dataSource.destroy();
    return;
  }

  await userRepo.save([
    { username: 'admin', role: UserRole.ADMIN },
    { username: 'user', role: UserRole.USER },
  ]);

  console.log('Seeded 2 users: admin, user');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
