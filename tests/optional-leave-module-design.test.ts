import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const design = readFileSync('docs/mvp/38-modulo-gestion-ausencias-opcional.md', 'utf8');

describe('diseño del módulo opcional de ausencias', () => {
  it('requiere activación empresarial y mantiene la decisión humana en el ámbito correcto', () => {
    expect(design).toContain('`leave_management` es un módulo opcional por empresa');
    expect(design).toContain('el servidor deniega las rutas y operaciones del dominio');
    expect(design).toContain('el Responsable autorizado de su centro decide y rectifica una decisión con historia append-only');
  });

  it('protege el límite con fichajes, cálculo y datos sensibles', () => {
    expect(design).toContain('Nunca genera un evento de fichaje, una corrección S6, una regla S3, un cálculo S5');
    expect(design).toContain('no incluye diagnóstico, documento, adjunto, saldo, remuneración');
    expect(design).toContain('no muestra motivo, comentario, tipología sensible, adjunto, estado médico, saldo, fichajes');
  });

  it('conserva historia de tipologías y niega automatismos', () => {
    expect(design).toContain('retirar o renombrar un tipo no altere la lectura histórica');
    expect(design).toContain('No se permite importación, notificación externa, comentario obligatorio, archivo, reconocimiento automatizado');
  });
});
