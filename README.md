# 💰 ePayco Wallet - Prueba Técnica

![Screenshot_001](/images/Screenshot_001.png)
![Screenshot_002](/images/Screenshot_002.png)

---

## 📋 Descripción General

Este proyecto es un sistema completo de **billetera virtual** desarrollado como prueba técnica para **ePayco**.
Implementa una **arquitectura de microservicios**, con separación de responsabilidades entre el acceso a datos y la lógica de negocio, garantizando escalabilidad y mantenibilidad.

---

## 🎯 Características Principales

- 🧩 **Arquitectura de Microservicios** con separación clara de responsabilidades
- 👥 **Registro y gestión de clientes** con validación completa
- 💳 **Sistema de billetera virtual** con recargas y consulta de saldo
- 🔐 **Proceso de pagos seguro** con tokens de 6 dígitos vía email
- 💻 **Frontend React** con interfaz intuitiva y responsive
- 📘 **API documentada** con Swagger/OpenAPI
- 🔁 **Comunicación entre servicios** vía HTTP REST
- 🗄️ **Base de datos MongoDB** para persistencia de datos

---

## 🏗️ Arquitectura del Sistema

```text
Frontend (React)
        ↓
Business Service (NestJS - Puerto 3002)
        ↓
Database Service (NestJS - Puerto 3001)
        ↓
MongoDB (Puerto 27017)
```

---

## 🛠️ Tecnologías Utilizadas

### 🧠 Backend

- **[NestJS](https://nestjs.com/)** – Framework para aplicaciones Node.js escalables
- **[TypeScript](https://www.typescriptlang.org/)** – Lenguaje tipado para mayor robustez
- **[MongoDB](https://www.mongodb.com/)** + **[Mongoose](https://mongoosejs.com/)** – Base de datos NoSQL y ODM
- **[Swagger](https://swagger.io/)** – Documentación automática de APIs
- **[Nodemailer](https://nodemailer.com/)** – Envío de emails con tokens
- **[Docker](https://www.docker.com/)** + **[Docker Compose](https://docs.docker.com/compose/)** – Contenerización y orquestación

### 🎨 Frontend

- **[React](https://reactjs.org/)** + **[TypeScript](https://www.typescriptlang.org/)** – Biblioteca de interfaz de usuario
- **[Tailwind CSS](https://tailwindcss.com/)** – Framework de CSS utility-first
- **[React Hook Form](https://react-hook-form.com/)** – Manejo eficiente de formularios
- **[Axios](https://axios-http.com/)** – Cliente HTTP para consumo de APIs

---

## 📋 Requisitos del Sistema

### 🔧 Prerrequisitos

- **Node.js 16+** o superior
- **Docker** y **Docker Compose**
- **Git** para clonar el repositorio

### 🔌 Puertos Requeridos

| Servicio             | Puerto |
|----------------------|--------|
| Frontend React       | 3000   |
| Database Service     | 3001   |
| Business Service     | 3002   |
| MongoDB              | 27017  |

---

## 🚀 Instalación y Configuración

### 🐳 Método 1: Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd epayco-wallet

# 2. Ejecutar con Docker Compose (todo automático)
docker-compose up --build

# 3. Acceder a la aplicación
# Frontend: http://localhost:3000
# API Docs: http://localhost:3002/api/docs
```

---

### 💻 Método 2: Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd epayco-wallet

# 2. Instalar y ejecutar Database Service
cd backend/database-service
npm install
npm run start:dev

# 3. En otra terminal, instalar y ejecutar Business Service
cd ../business-service
npm install
npm run start:dev

# 4. En otra terminal, instalar y ejecutar Frontend
cd ../../frontend
npm install
npm start

# 5. Ejecutar MongoDB (requiere MongoDB instalado localmente)
mongod
```

---

## 🎮 Uso de la Aplicación

### 🔹 Flujo de Operaciones

#### 👤 Registro de Cliente
- Ingresar documento, nombres, email y celular
- Todos los campos son obligatorios

#### 💵 Recarga de Billetera
- Especificar documento, celular y monto a recargar
- Validación de cliente existente

#### 🧾 Proceso de Pago
1. Iniciar pago con documento, celular, monto y email
2. Ingresar token de 6 dígitos recibido por email
3. Validación de saldo suficiente y sesión activa

#### 💰 Consulta de Saldo
- Verificar saldo actual con documento y celular

---

## 📊 Servicios y Endpoints

### 🖥️ Servicios en Ejecución

| Servicio          | URL                       |
|-------------------|----------------------------|
| Frontend React    | http://localhost:3000      |
| Business Service  | http://localhost:3002      |
| Database Service  | http://localhost:3001      |
| MongoDB           | localhost:27017            |

### 📘 Documentación de API

Una vez ejecutado el proyecto, accede a la documentación interactiva:
**Swagger UI:** [http://localhost:3002/api/docs](http://localhost:3002/api/docs)

---

### 🔑 Endpoints Principales

#### 👥 Clientes
- `POST /api/clients/register` → Registrar nuevo cliente
- `POST /api/clients/find` → Buscar cliente existente

#### 💳 Billetera
- `POST /api/wallet/recharge` → Recargar saldo
- `POST /api/wallet/balance` → Consultar saldo
- `POST /api/wallet/debit` → Debitar saldo

#### 💸 Pagos
- `POST /api/payments/initiate` → Iniciar proceso de pago
- `POST /api/payments/confirm` → Confirmar pago con token

---

## 🔧 Configuración para Pruebas

### 📧 Email de Prueba

El sistema utiliza **Ethereal Email** para enviar tokens:

- Los emails **no se envían realmente**
- Revisa la **consola del Business Service** para ver las credenciales
- Accede a [https://ethereal.email/](https://ethereal.email/) para ver emails de prueba

### 🧩 Datos de Ejemplo

```json
{
  "document": "123456789",
  "names": "Juan Pérez",
  "email": "test@ethereal.email",
  "cellphone": "3001234567",
  "amount": 100.50
}
```

---

## 📁 Estructura del Proyecto

```text
epayco-wallet/
├── backend/
│   ├── database-service/     # Servicio 1 - Acceso directo a BD
│   ├── business-service/     # Servicio 2 - Lógica de negocio
│   └── docker-compose.yml    # Orquestación de contenedores
├── frontend/                 # Aplicación React
├── docs/                     # Documentación
│   └── postman-collection.json
└── README.md
```

---

## 🧪 Pruebas con Postman

### 📥 Importar Colección

1. Abre Postman
2. Ve a **Import → Import File**
3. Selecciona `docs/postman-collection.json`
4. Postman creará una colección con todos los endpoints

### ✅ Flujo de Prueba Recomendado

1. Registrar un cliente nuevo
2. Recargar billetera del cliente
3. Consultar saldo para verificar
4. Iniciar proceso de pago
5. Confirmar pago con token (ver consola para token de prueba)

---

## 🐛 Solución de Problemas

### 🔴 Error: Puerto en uso
```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Terminar proceso
kill -9 <PID>
```

### 🔴 Error: Conexión a MongoDB
- Verificar que MongoDB esté ejecutándose
- Revisar variables de entorno en `docker-compose.yml`

### 🔴 Error: Servicios no se comunican
- Verificar que todos los servicios estén ejecutándose
- Revisar logs con:
```bash
docker-compose logs
```

---

## 👨‍💻 Autor

**Humberto Fernández** – Desarrollador Full Stack

---

## 📞 Soporte

Si tienes algún problema o pregunta, por favor contáctame.

---

## 📝 Notas de la Implementación

- ✅ Arquitectura en capas respetando la separación de responsabilidades
- ✅ Comunicación entre servicios vía HTTP REST
- ✅ Validaciones completas en frontend y backend
- ✅ Manejo de errores con respuestas estandarizadas
- ✅ Documentación completa con Swagger
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Contenerización con Docker para fácil despliegue

---

### 🚀 ¿Listo para comenzar?

Ejecuta:

```bash
docker-compose up --build
```

y accede a 👉 [http://localhost:3000](http://localhost:3000)
