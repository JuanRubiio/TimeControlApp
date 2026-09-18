export type AdminEnvironment = {
  company: boolean;
  sites: number;
  employees: number;
  employments: number;
  calendars: number;
  rules: number;
  versions: number;
  moduleStatus?: string;
};

export function pendingEnvironmentItems(environment: AdminEnvironment) {
  return [
    !environment.company && 'Empresa',
    !environment.sites && 'Centro de trabajo',
    !environment.employees && 'Personas',
    !environment.employments && 'Relaciones laborales',
    !environment.calendars && 'Calendario laboral',
    !environment.rules && 'Regla de jornada',
    !environment.versions && 'Vigencia de regla'
  ].filter(Boolean) as string[];
}
