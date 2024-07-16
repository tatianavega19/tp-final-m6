# WinstonJS

WinstonJS es una biblioteca esencial para la gestión de registros en entornos Node.js. Facilita la implementación y configuración de registros dentro de aplicaciones, permitiendo a los desarrolladores registrar y monitorear información crucial sobre el comportamiento y estado de la aplicación en tiempo real.

## Características Clave de WinstonJS

1. **Versatilidad en los Transportes:** Permite dirigir registros a múltiples destinos como consola, archivos de registro, bases de datos y servicios externos, ofreciendo flexibilidad en la gestión de registros según los requisitos específicos de la aplicación.

2. **Gestión de Niveles de Registro:** Proporciona un sistema robusto de niveles de registro (como "info", "warn", "error") que facilita la categorización y filtrado de registros según su gravedad y relevancia.

3. **Personalización del Formato:** Permite personalizar el formato de los registros para adaptarse precisamente a las necesidades del desarrollador o de la aplicación, asegurando una presentación de datos clara y coherente.

4. **Integración de Manejo de Excepciones:** Se integra de manera fluida con el sistema de manejo de excepciones de Node.js, automatizando el registro de errores no controlados para una depuración eficiente.

5. **Configuración Flexible:** Altamente configurable, permite ajustar fácilmente parámetros como niveles de registro, formatos y destinos de salida, optimizando así la gestión y visualización de registros según los requisitos específicos del proyecto.

## Ejemplo de Uso

A continuación se muestra un ejemplo básico de configuración y uso de WinstonJS en una aplicación Node.js:

```javascript
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',  
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),  
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),  
        new winston.transports.File({ filename: 'logs/user.log' })  
    ]
});

// Ejemplo de uso del logger
logger.info('Mensaje de información');
logger.warn('Advertencia generada');
logger.error('Se produjo un error');
```