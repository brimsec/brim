import { SearchArgs } from "../types.ts";
import { totalRecords, flatRecords, zngToZeek } from "../enhancers/mod.ts";

export function getDefaultSearchArgs(): SearchArgs {
  return {
    from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days
    to: new Date(),
    spaceId: "default",
    format: "zjson",
    controlMessages: true,
    enhancers: [zngToZeek, flatRecords, totalRecords],
  };
}
