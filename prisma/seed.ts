import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { hashPassword } from '../lib/password';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Credenciales de prueba — documentadas también en el README, tal como pide
// el enunciado. En un sistema real nunca se harían públicas así.
const ADMIN = { email: 'admin@dpsolutions.test', password: 'Admin123!' };
const USER = { email: 'usuario@dpsolutions.test', password: 'Usuario123!' };

async function upsertUser(email: string, password: string, role: 'ADMIN' | 'USER', name: string) {
  const password_hash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: password_hash, role, name },
  });
  console.log(`${role} listo: ${user.email}`);
  return user;
}

async function main() {
  const admin = await upsertUser(ADMIN.email, ADMIN.password, 'ADMIN', 'Administrador');
  await upsertUser(USER.email, USER.password, 'USER', 'Usuario Demo');

  const existing = await prisma.proyecto.findFirst({ where: { nombre: 'Proyecto demo' } });
  if (!existing) {
    const proyecto = await prisma.proyecto.create({
      data: { nombre: 'Proyecto demo', saldo: 5, creadorId: admin.id },
    });
    await prisma.movimiento.create({
      data: { proyectoId: proyecto.id, tipo: 'ENTRADA', cantidad: 5, responsableId: admin.id },
    });
    console.log('Proyecto demo creado con 5 tareas pendientes');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
