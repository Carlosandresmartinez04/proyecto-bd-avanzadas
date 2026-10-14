# 🅿️ Sistema de Control de Parqueaderos - Sede El Aljibe
**Corporación Universitaria Autónoma del Cauca**
**Integrantes:** Carlos Andrés Martínez (Ingeniería de Software - 8mo Semestre)

---

## 📋 Tabla de Historias de Usuario y Funcionalidades (MVP)

| N.º | Historia de Usuario | Funcionalidad | Endpoint y Método |
| :--- | :--- | :--- | :--- |
| 1 | Como **Administrador**, quiero **registrar un nuevo usuario (estudiante/docente)** en el sistema, para **almacenar sus datos institucionales y asociar su vehículo**[cite: 4]. | Registro de Propietario | `POST /api/propietarios` |
| 2 | Como **Vigilante**, quiero **registrar el ingreso de una moto o bicicleta** asignando un ticket y cascos, para **controlar el acceso en la sede El Aljibe**[cite: 4]. | Registro de Ingreso | `POST /api/parqueadero/ingreso` |
| 3 | Como **Vigilante**, quiero **consultar todos los vehículos actualmente estacionados**, para **saber qué cupos siguen ocupados en tiempo real**[cite: 4]. | Listar Activos | `GET /api/parqueadero/activos` |
| 4 | Como **Vigilante**, quiero **buscar un vehículo específico por su número de placa**, para **verificar rápidamente su propietario y hora de entrada**[cite: 4]. | Buscar por Placa | `GET /api/parqueadero/vehiculo/:placa` |
| 5 | Como **Administrador**, quiero **filtrar los vehículos estacionados según el programa académico**, para **analizar qué facultad usa más el parqueadero**[cite: 4]. | Filtrar por Programa | `GET /api/parqueadero/programa/:programa` |
| 6 | Como **Vigilante**, quiero **registrar la salida de un vehículo actualizando su hora de salida y estado**, para **liberar el cupo en el sistema**[cite: 4]. | Registrar Salida | `PATCH /api/parqueadero/salida/:ticket_id` |
| 7 | Como **Estudiante**, quiero **consultar mi historial de ingresos al parqueadero usando mi código institucional**, para **hacer seguimiento a mis registros**[cite: 4]. | Historial por Código | `GET /api/parqueadero/propietario/:codigo` |
| 8 | Como **Vigilante**, quiero **actualizar los datos de un ticket (como los cascos guardados)** en caso de novedades, para **mantener la información exacta**[cite: 4]. | Modificar Ticket | `PUT /api/parqueadero/:ticket_id` |
| 9 | Como **Administrador**, quiero **eliminar un registro erróneo o duplicado de ticket**, para **mantener limpia la base de datos**[cite: 4]. | Eliminar Registro | `DELETE /api/parqueadero/:ticket_id` |
| 10 | Como **Administrador**, quiero **visualizar estadísticas del parqueadero (agrupadas por tipo de vehículo)**, para **evaluar la ocupación de la sede**[cite: 4]. | Reporte Estadístico | `GET /api/parqueadero/reportes/estadisticas` |