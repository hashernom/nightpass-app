# NightPass - Guía de Usuario Completa

> Manual completo para usuarios finales, staff y administradores de la plataforma NightPass

## 📖 Índice

1. [Introducción a NightPass](#introducción-a-nightpass)
2. [Registro y Cuenta](#registro-y-cuenta)
3. [Explorar Eventos](#explorar-eventos)
4. [Comprar Tickets](#comprar-tickets)
5. [Gestionar Tus Tickets](#gestionar-tus-tickets)
6. [Validación QR (Staff)](#validación-qr-staff)
7. [Panel Administrativo](#panel-administrativo)
8. [Preguntas Frecuentes](#preguntas-frecuentes)
9. [Soporte Técnico](#soporte-técnico)

## 🎯 Introducción a NightPass

NightPass es una plataforma de ticketing diseñada específicamente para la vida nocturna. Con NightPass puedes:

- **Descubrir** los mejores eventos nocturnos en tu ciudad
- **Comprar** tickets de forma rápida y segura
- **Acceder** a eventos con QR Fast Pass
- **Gestionar** establecimientos (si eres administrador)
- **Validar** entradas (si eres staff en puerta)

### Roles en la Plataforma

| Rol               | Icono | Descripción                                         |
| ----------------- | ----- | --------------------------------------------------- |
| **Usuario**       | 👤    | Personas que compran tickets para asistir a eventos |
| **Staff Scanner** | 📱    | Personal que valida QR en la entrada de eventos     |
| **Admin Venue**   | 🏢    | Administradores de establecimientos nocturnos       |

## 📝 Registro y Cuenta

### Crear una Cuenta

1. Haz clic en "Registrarse" en la esquina superior derecha
2. Completa el formulario con:
   - **Email**: Tu correo electrónico
   - **Contraseña**: Mínimo 8 caracteres
   - **Nombre**: Tu nombre completo
   - **Rol**: Selecciona "Usuario" si quieres comprar tickets
3. Confirma tu email (recibirás un correo de verificación)
4. ¡Listo! Ya puedes iniciar sesión

### Iniciar Sesión

1. Haz clic en "Iniciar Sesión"
2. Introduce tu email y contraseña
3. Opcional: Marca "Recordarme" para mantener la sesión activa
4. Serás redirigido al marketplace de eventos

### Recuperar Contraseña

Si olvidaste tu contraseña:

1. Haz clic en "¿Olvidaste tu contraseña?"
2. Introduce tu email registrado
3. Recibirás un enlace para restablecer la contraseña
4. Crea una nueva contraseña segura

### Configurar Perfil

Accede a tu perfil desde el menú desplegable (tu avatar):

- **Editar información**: Actualiza tu nombre o foto de perfil
- **Ver historial**: Revisa tus compras anteriores
- **Configuración**: Ajustes de notificaciones y privacidad

## 🔍 Explorar Eventos

### Marketplace Principal

El marketplace es donde encontrarás todos los eventos disponibles:

1. **Filtros disponibles**:
   - **Ciudad**: Bogotá, Medellín, Cali, etc.
   - **Género musical**: Electrónica, Reggaetón, Salsa, Rock
   - **Fecha**: Hoy, Esta semana, Este mes
   - **Precio**: Rango de precios
   - **Tipo**: Cover general, Mesa VIP, Evento especial

2. **Búsqueda**:
   - Usa la barra de búsqueda para encontrar eventos por nombre
   - Ejemplo: "Fiesta electrónica" o "Techno night"

3. **Ordenar resultados**:
   - Más recientes
   - Más populares
   - Precio (menor a mayor)
   - Fecha (próximos primero)

### Vista de Detalle de Evento

Al hacer clic en un evento verás:

- **Imagen del evento**: Banner principal
- **Información básica**: Nombre, fecha, hora, ubicación
- **Descripción completa**: Detalles del evento, artistas, dress code
- **Precios**: Cover general y opciones de mesas VIP
- **Mapa**: Ubicación exacta del establecimiento
- **Promociones**: Códigos de descuento disponibles
- **Comentarios**: Opiniones de otros asistentes

### Guardar Eventos Favoritos

¿Encontraste un evento interesante pero no estás listo para comprar?

1. Haz clic en el corazón ♥ en la tarjeta del evento
2. Los eventos guardados aparecen en "Mis Favoritos"
3. Recibirás recordatorios antes de que comience el evento

## 🛒 Comprar Tickets

### Proceso de Compra Paso a Paso

#### Paso 1: Seleccionar Evento

1. Navega al evento que te interesa
2. Haz clic en "Comprar Ticket" o "Reservar Mesa"
3. Selecciona la fecha (si hay múltiples fechas disponibles)

#### Paso 2: Elegir Cantidad y Tipo

1. **Ticket general**: Selecciona cantidad de personas
2. **Mesa VIP**: Elige el tipo de mesa y cantidad de personas
3. **Aplicar promoción**: Introduce código de descuento si tienes uno
4. **Ver resumen**: Revisa el total antes de continuar

#### Paso 3: Información de Pago

1. **Método de pago**:
   - **Tarjeta crédito/débito** (Stripe): Internacional
   - **PSE** (Wompi): Bancos colombianos
   - **Nequi/Daviplata** (Wompi): Billeteras digitales
2. **Datos de tarjeta**:
   - Número de tarjeta (protegido por Stripe)
   - Fecha de expiración
   - CVC
   - Nombre del titular
3. **Datos de facturación** (opcional para recibos)

#### Paso 4: Confirmación

1. Revisa todos los detalles de tu compra
2. Acepta los términos y condiciones
3. Haz clic en "Confirmar Compra"
4. ¡Listo! Tu compra está siendo procesada

### ¿Qué Sucede Después de Comprar?

1. **Procesamiento de pago** (instantáneo):
   - Recibirás confirmación en pantalla
   - Verás el estado "Pago exitoso"

2. **Generación de ticket** (menos de 10 segundos):
   - Sistema crea tu ticket con QR único
   - QR se firma con HMAC-SHA256 para seguridad

3. **Email de confirmación** (1-2 minutos):
   - Recibirás un email con:
     - Detalles de tu compra
     - QR para acceso
     - Información del evento
     - Términos y condiciones

4. **Disponibilidad en dashboard** (inmediato):
   - Tu ticket aparece en "Mis Tickets"
   - Puedes ver/descargar el QR en cualquier momento

### Promociones y Descuentos

#### Tipos de Promociones

- **Early Bird**: Descuento por compra anticipada
- **Grupo**: Descuento por cantidad de personas
- **Estudiante**: Descuento con carnet estudiantil
- **Código promocional**: Descuento con código específico

#### Cómo Aplicar un Código

1. En el paso 2 de compra, busca "¿Tienes un código promocional?"
2. Introduce el código (ej: "VERANO20")
3. Haz clic en "Aplicar"
4. Verás el descuento reflejado en el total

## 🎫 Gestionar Tus Tickets

### Acceder a Tus Tickets

1. Inicia sesión en tu cuenta
2. Haz clic en tu avatar (esquina superior derecha)
3. Selecciona "Mis Tickets"
4. Verás todos tus tickets: próximos, utilizados y expirados

### Vista de Ticket Individual

Cada ticket muestra:

- **QR principal**: Código para mostrar en la entrada
- **Información del evento**: Nombre, fecha, hora, ubicación
- **Detalles del ticket**: Número de ticket, tipo, precio
- **Estado**: Activo, Utilizado, Expirado
- **Acciones disponibles**:
  - **Ver QR ampliado**: Para mejor visualización
  - **Descargar PDF**: Incluye QR y detalles
  - **Compartir** (si el evento lo permite): Enviar a amigos
  - **Cancelar** (si aplica): Con políticas de reembolso

### QR Fast Pass - ¿Cómo Funciona?

#### Características del QR NightPass

- **Único e intransferible**: Generado específicamente para ti
- **Firmado digitalmente**: HMAC-SHA256 previene falsificaciones
- **Válido por 24 horas**: Desde la hora de inicio del evento
- **Solo un uso**: Se invalida después del escaneo
- **Funciona sin internet**: El staff puede validar offline

#### Cómo Usar Tu QR en el Evento

1. **Antes de salir**:
   - Asegúrate de tener batería en tu celular
   - Descarga el PDF o toma screenshot por si acaso
   - Lleva identificación (pueden pedirla)

2. **En la entrada**:
   - Abre la app/web de NightPass
   - Ve a "Mis Tickets" y selecciona el evento
   - Muestra el QR en pantalla completa
   - El staff lo escaneará con su dispositivo

3. **Después del escaneo**:
   - Verás pantalla verde "Acceso Permitido"
   - Tu ticket cambiará a estado "Utilizado"
   - Recibirás email de confirmación de entrada

### Problemas Comunes con QR

#### "Mi QR no se escanea"

- **Solución**: Aumenta brillo de pantalla al máximo
- **Solución alternativa**: Muestra el PDF descargado
- **Si persiste**: El staff puede introducir el código manualmente

#### "Olvidé mi celular"

- **Solución**: Muestra identificación y nombre
- **El staff** puede buscarte en la lista con tu nombre/email
- **Recomendación**: Siempre lleva identificación

#### "QR marcado como ya usado"

- **Contacta al staff**: Puede ser error de doble escaneo
- **Verifica en tu app**: Si muestra "Utilizado" es normal
- **Si es error**: El supervisor puede corregir el estado

### Cancelaciones y Reembolsos

#### Política de Cancelación

- **Hasta 24 horas antes**: Reembolso del 80%
- **Menos de 24 horas**: Reembolso del 50%
- **Después del evento**: No aplica reembolso
- **Evento cancelado**: Reembolso del 100%

#### Cómo Cancelar un Ticket

1. Ve a "Mis Tickets"
2. Selecciona el ticket que quieres cancelar
3. Haz clic en "Cancelar Ticket"
4. Selecciona motivo de cancelación
5. Confirma la cancelación
6. Recibirás email con detalles del reembolso

#### Tiempos de Reembolso

- **Tarjetas crédito/débito**: 5-10 días hábiles
- **PSE**: 2-3 días hábiles
- **Nequi/Daviplata**: 24-48 horas

## 📱 Validación QR (Staff)

### Acceso al Panel Staff

1. **Credenciales**: Debes tener cuenta con rol "STAFF_SCANNER"
2. **Iniciar sesión**: Usa email y contraseña proporcionados
3. **Evento asignado**: Solo verás eventos donde estés asignado
4. **Dispositivo**: Funciona en cualquier celular con cámara

### Interfaz del Scanner

#### Pantalla Principal

- **Evento actual**: Nombre, fecha, hora
- **Contador**: Tickets vendidos / escaneados / pendientes
- **Botón escanear**: Activa la cámara
- **Modo manual**: Para introducir código manualmente
- **Logs**: Historial de escaneos recientes

#### Proceso de Validación

1. **Activar cámara**: Haz clic en "Escanear QR"
2. **Enfocar código**: Apunta la cámara al QR del usuario
3. **Validación automática**:
   - Sistema verifica firma HMAC
   - Revisa que no esté expirado (24h)
   - Confirma que no haya sido usado antes
4. **Resultado**:
   - **✅ Verde**: Acceso permitido
   - **❌ Rojo**: Acceso denegado (con motivo)

#### Resultados Posibles

| Resultado     | Color | Significado              | Acción           |
| ------------- | ----- | ------------------------ | ---------------- |
| **VÁLIDO**    | Verde | QR correcto, primera vez | Permitir entrada |
| **DUPLICADO** | Rojo  | QR ya fue escaneado      | Denegar entrada  |
| **EXPIRADO**  | Rojo  | QR tiene más de 24h      | Denegar entrada  |
| **INVÁLIDO**  | Rojo  | Firma HMAC incorrecta    | Denegar entrada  |

#### Modo Manual (Sin Cámara)

1. Haz clic en "Introducir código manualmente"
2. Pide al usuario el código bajo el QR
3. Ingresa el código (ej: "nightpass_abc123")
4. Sistema validará igual que con cámara

### Gestión de Incidencias

#### Usuario Sin QR

1. **Verificar identificación**: Pide documento de identidad
2. **Buscar en lista**: Usa búsqueda por nombre/email
3. **Validar manualmente**: Marcar como "entrada manual"
4. **Registrar incidencia**: Anotar en observaciones

#### Disputas

1. **Usuario insiste en entrada**: Llama al supervisor
2. **Verificar en sistema**: Supervisor puede revisar logs
3. **Tomar decisión**: Basada en políticas del establecimiento
4. **Registrar incidente**: Para seguimiento posterior

#### Problemas Técnicos

- **Sin internet**: El scanner funciona en modo offline
- **Cámara no funciona**: Usar modo manual
- **App no carga**: Reiniciar navegador/celular

### Cierre de Turno

1. **Generar reporte**: Haz clic en "Finalizar turno"
2. **Revisar estadísticas**:
   - Total escaneados
   - Entradas denegadas
   - Incidentes registrados
3. **Firmar digitalmente**: Confirma fin de turno
4. **Cerrar sesión**: Importante por seguridad

## 🏢 Panel Administrativo

### Acceso al Panel Admin

1. **Rol requerido**: ADMIN_VENUE
2. **Credenciales**: Email y contraseña de administrador
3. **URL**: `https://nightpass.com/admin` (o localhost:3000/admin)

### Dashboard Principal

#### Vista General

- **Resumen financiero**: Ventas hoy, semana, mes
- **Aforo en tiempo real**: Personas dentro vs capacidad
- **Eventos activos**: Próximos y en curso
- **Alertas**: Tickets fraudulentos, capacidad al límite

#### Métricas Clave

- **Tasa de conversión**: Visitantes vs compradores
- **Ticket promedio**: Valor promedio por venta
- **Ocupación**: Porcentaje de capacidad utilizada
- **Satisfacción**: Calificaciones de eventos

### Gestión de Eventos

#### Crear Nuevo Evento

1. Haz clic en "Nuevo Evento"
2. Completa el formulario:
   - **Información básica**: Nombre, descripción, tipo
   - **Fecha y hora**: Inicio, fin, hora de apertura
   - **Precios**: Cover general, mesas VIP, early bird
   - **Capacidad**: Máximo de personas permitidas
   - **Imágenes**: Banner, fotos del venue
   - **Promociones**: Códigos de descuento
3. **Publicar**: Haz clic en "Publicar Evento"

#### Editar Evento Existente

1. Selecciona el evento de la lista
2. Haz clic en "Editar"
3. **Modificaciones permitidas**:
   - Precios (hasta 24h antes)
   - Capacidad (considerando tickets vendidos)
   - Descripción e imágenes
   - Promociones adicionales
4. **Modificaciones restringidas**:
   - Fecha/hora (solo con aprobación)
   - Cancelación (notificar a compradores)

#### Cancelar Evento

1. Selecciona el evento a cancelar
2. Haz clic en "Cancelar Evento"
3. **Opciones**:
   - **Reembolso automático**: Devolver dinero a todos
   - **Transferir tickets**: Mover a nueva fecha
   - **Crédito**: Dar crédito para futuro evento
4. **Notificación**: Sistema envía emails automáticos

### Gestión de Staff

#### Asignar Staff a Eventos

1. Ve a "Gestión de Staff"
2. Selecciona el evento
3. **Buscar usuarios**: Por nombre o email
