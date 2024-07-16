# Paginación

La paginación en bases de datos se refiere al proceso de dividir grandes conjuntos de resultados en fragmentos más pequeños o "páginas". 
Esto permite a las aplicaciones mostrar y procesar un subconjunto limitado de datos a la vez, mejorando la eficiencia y la experiencia del
usuario al trabajar con grandes volúmenes de información. En el contexto de Node.js y bases de datos, la paginación se implementa para obtener
y mostrar resultados de consultas de manera incremental.

## Parámetros de Paginación

- **Número de página (page):** Indica la página específica que se desea recuperar.
- **Tamaño de la página (pageSize):** Especifica la cantidad de elementos que se deben incluir en cada página.

## Implementación en Aplicaciones Node.js

La implementación de paginación puede variar según el tipo de base de datos utilizada (relacional o no relacional), pero el concepto general 
es el mismo. En una aplicación Node.js, puedes implementar paginación en la ruta `/usuarios` de la consulta enviando parámetros
opcionales `page` y `pageSize`.

## Ventajas de la Paginación

La paginación es especialmente útil en aplicaciones web donde los conjuntos de datos son extensos. Permite cargar datos de manera incremental, 
mejorando así el rendimiento al evitar la carga completa de datos de una sola vez. Además, facilita la implementación de interfaces de usuario 
que permiten a los usuarios navegar por los resultados de manera más manejable y eficiente.