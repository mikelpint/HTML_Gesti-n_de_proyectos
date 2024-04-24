// deno-lint-ignore-file no-namespace

namespace Insurance {
  export namespace ID {
    export const Regex = /^\d{8}(?=[^IÑOU])[A-Z]$/;

    // deno-lint-ignore no-explicit-any
    export function is(value: any): value is ID {
      if (typeof value != "string") return false;

      if (!Regex.test(value)) {
        return false;
      }

      return "TRWAGMYFPDXBNJZSQVHLCKE".at(
        globalThis.Number.parseInt(value.substring(0, value.length)) % 23,
      ) == value.charAt(value.length - 1);
    }
  }

  export type ID = string;

  export namespace Number {
    export const Min = 0 as const;
    export type Min = typeof Min;
  }

  export type Number = number;

  export type Expiration = string;

  export namespace Phone {
    export const Regex = /^\d{9}$/;
  }

  export type Phone = string;

  export enum Coverage {
    Basic = "Básica",
    Extended = "Ampliada",
    Premium = "Premium",
  }
}

interface Insurance {
  number: Insurance.Number;
  expiration: Insurance.Expiration;
  coverage: Insurance.Coverage;

  phone: Insurance.Phone;
  id: Insurance.ID;
}

export default Insurance;
