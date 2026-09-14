# Matriz de puertas de calidad

**Regla:** las puertas se acumulan; que una revisión no aplique debe indicarse en la historia con motivo.

| Tipo de cambio | Antes de desarrollo | Antes de merge | Antes de despliegue/cierre |
|---|---|---|---|
| Documentación o copy no sensible | PO/analista; DoR proporcional | Revisor técnico | PO valida resultado |
| UI o interacción | UX + DoR + QA plan | QA + UX/a11y + revisor | Validación de producto |
| Dominio/API acotado | Arquitectura proporcional + QA plan | QA + revisor | Pruebas/validación de producto |
| Tabla/migración/evento/auditoría | Arquitectura + backend + QA + riesgo | QA independiente + revisor; seguridad si hay datos | SRE si entorno afectado; rollback/evidencia |
| Auth, MFA, RBAC, tenant o secreto | Arquitectura + seguridad/privacidad + QA | Seguridad/privacidad + QA independiente + revisor | Autoridad de entorno; no producción automática |
| Exportación, retención o dato personal | PO + seguridad/privacidad + QA + S15 si aplica | Seguridad/privacidad + QA + UX | DPO/operación/autoridad de entorno; Go/No-Go vigente |
| Infraestructura, CI/CD, backup o restore | SRE + seguridad + ADR/plan | SRE + seguridad + QA de operación | Autorización explícita de entorno y rollback |
| Claim comercial, legal o métrica | PO + marketing/datos + privacidad/jurídico cuando aplique | Revisor de cumplimiento | PO/jurídico aprueba publicación |

Un agente puede producir evidencia para una puerta; una persona con la autoridad señalada confirma el paso. `Merged` nunca elimina una puerta de despliegue, DPO o S15.
