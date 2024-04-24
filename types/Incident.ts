// deno-lint-ignore-file no-namespace

namespace Incident {
  export enum Type {
    Breakage = "Rotura",
    Theft = "Robo",
    Flood = "Inundación",
    Fire = "Incendio",
  }

  export namespace Cost {
    export const Regex = /^\d+(\.\d{1,2})?$/;
  }
}

interface Incident {
  type: Incident.Type;

  what: string;
  how: string;
  when: number;
  where?: string;

  cost: number;
  cause?: string;
}

export default Incident;
