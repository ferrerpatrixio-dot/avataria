import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@avataria.com'
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.log('ADMIN_PASSWORD not set; skipping admin seed')
    return
  }

  const existingUser = await db.user.findUnique({ where: { email } })

  if (existingUser) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  await db.user.create({
    data: {
      email,
      name: 'AVATARIA Admin',
      password: await hash(password, 10),
      role: 'admin',
      isActive: true,
    },
  })

  console.log(`Created admin user: ${email}`)
}

main()
  .catch((error) => {
    console.error('Unable to initialize the admin user', error)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
