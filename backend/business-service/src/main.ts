import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('ePayco Wallet - Business Service API')
    .setDescription(`
# 📋 ePayco Wallet API

Este es el servicio de negocio que actúa como intermediario entre el frontend React y el servicio de base de datos.

## 🔗 Arquitectura
- **Frontend** → **Business Service** (este) → **Database Service** → **MongoDB**

## 📊 Flujo de Operaciones
1. **Registro de Clientes** → Crear nuevos usuarios del sistema
2. **Recarga de Billetera** → Agregar saldo a la cuenta
3. **Proceso de Pagos** → Iniciar y confirmar pagos con token
4. **Consulta de Saldo** → Verificar saldo disponible

## 🔐 Seguridad
- Validación de datos con class-validator
- Tokens de confirmación de 6 dígitos
- Expiración de sesiones (15 minutos)
- Límite de intentos (3 máximo)

## 📧 Email
Los tokens de confirmación se envían via Ethereal Email para testing.
    `)
    .setDescription(`
# 📋 ePayco Wallet API

Este es el servicio de negocio que actúa como intermediario entre el frontend React y el servicio de base de datos.

## 🔗 Arquitectura
- **Frontend** → **Business Service** (este) → **Database Service** → **MongoDB**

## 📊 Flujo de Operaciones
1. **Registro de Clientes** → Crear nuevos usuarios del sistema
2. **Recarga de Billetera** → Agregar saldo a la cuenta
3. **Proceso de Pagos** → Iniciar y confirmar pagos con token
4. **Consulta de Saldo** → Verificar saldo disponible

## 🔐 Seguridad
- Validación de datos con class-validator
- Tokens de confirmación de 6 dígitos
- Expiración de sesiones (15 minutos)
- Límite de intentos (3 máximo)

## 📧 Email
Los tokens de confirmación se envían via Ethereal Email para testing.
    `)
    .setVersion('1.0')
    .addTag('Clientes', 'Operaciones relacionadas con clientes')
    .addTag('Billetera', 'Operaciones de recarga y consulta de saldo')
    .addTag('Pagos', 'Proceso de pagos con confirmación por token')
    .setContact('Equipo ePayco', 'https://epayco.com', 'soporte@epayco.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ePayco Wallet API Docs',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info hgroup.main h2 { color: #2563eb }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log('🚀 Business Service running on: http://localhost:3002');
  console.log('📚 Swagger Docs available on: http://localhost:3002/api/docs');
  console.log('🔗 Frontend should connect to: http://localhost:3002/api');
  console.log('📥 Para Postman: http://localhost:3002/api/docs-json');
}
bootstrap();
