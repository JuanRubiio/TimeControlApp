# Definition of Ready — puerta previa a desarrollo

**Aplicación:** obligatoria antes de mover una historia a `Lista para desarrollo`. No sustituye la aprobación del PO ni la Definition of Done.

Una historia está lista sólo si todas las respuestas son afirmativas o existe una excepción explícita aprobada por el PO:

- [ ] Tiene ID, épica, problema, usuario/rol y beneficio observable.
- [ ] Expresa alcance y exclusiones; no contradice límites aprobados del producto.
- [ ] Sus criterios de aceptación son verificables y contemplan el resultado esperado y los fallos relevantes.
- [ ] Identifica riesgo legal, privacidad, seguridad, accesibilidad y operación, indicando revisiones necesarias.
- [ ] Enumera dependencias, módulos/tablas/rutas propietarios y bloqueos; no colisiona con trabajo paralelo.
- [ ] Vincula contrato, ADR o decisión existente; si falta una decisión duradera, se abrió una decisión/ADR antes de implementar.
- [ ] Tiene plan de pruebas, fixtures exclusivamente sintéticos y evidencia esperada.
- [ ] Tiene responsable humano, roles necesarios, modelo/clase orientativa y revisor independiente cuando el riesgo lo exige.
- [ ] El PO aprobó alcance, prioridad y riesgo inicial de forma trazable.
- [ ] La rama/base y la estrategia de commits se pueden preparar conforme al [workflow Git](../development/git-workflow.md).

Si un punto falla, la historia vuelve a `Refinamiento`, `Diseño/ADR` o `Bloqueada`; nunca se inicia desarrollo “para avanzar”.
