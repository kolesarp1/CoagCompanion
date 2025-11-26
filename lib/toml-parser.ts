import { Log } from "./types";

export const seedDataTOML = `
[[logs]]
Laboratoř = 1.06
Warfarin = 8.0
Injekce = "ráno večer 0.9 ml"
Comment = ""
date = "2025-09-05T00:00:00"

[[logs]]
Laboratoř = 1.05
"Coagu Check" = 1.1
Warfarin = 8.0
Injekce = "ráno večer 0.9 ml"
Comment = ""
date = "2025-09-06T00:00:00"
`;

export function parseSeedData(): Log[] {
  const logs: Log[] = [];

  // Simple TOML parser for our specific structure
  const logBlocks = seedDataTOML.split("[[logs]]").filter(block => block.trim());

  logBlocks.forEach((block, index) => {
    const log: Partial<Log> = {
      id: `seed-${Date.now()}-${index}`,
    };

    const lines = block.split("\n").filter(line => line.trim());

    lines.forEach(line => {
      const match = line.match(/^(.*?)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim().replace(/"/g, "");
        let value = match[2].trim().replace(/^"|"$/g, "");

        if (key === "Laboratoř") {
          log.labINR = parseFloat(value);
        } else if (key === "Coagu Check") {
          log.homeINR = parseFloat(value);
        } else if (key === "Warfarin") {
          log.warfarinDose = parseFloat(value);
        } else if (key === "Injekce") {
          log.injections = value;
        } else if (key === "Comment") {
          log.comment = value || null;
        } else if (key === "date") {
          log.date = value;
        }
      }
    });

    if (log.date) {
      logs.push(log as Log);
    }
  });

  return logs;
}
