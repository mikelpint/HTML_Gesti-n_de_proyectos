// deno-lint-ignore-file no-namespace

import Insurance from "types/Insurance.ts";
import Item from "types/Item.ts";
import Incident from "types/Incident.ts";

namespace Report {
  export namespace ID {
    export const Length = 24 as const;
    export const Regex = /^[0-9a-f]{24}$/;
  }
}

interface Report {
  id: string;
  item: Item;
  incident: Incident;
  insurance: Insurance;
}

export default Report;
