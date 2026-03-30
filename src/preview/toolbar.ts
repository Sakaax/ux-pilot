export interface ScreenVersion {
  name: string;
  file: string;
  description: string;
}

export interface Screen {
  index: number;
  total: number;
  label: string;
  versions: ScreenVersion[];
  activeVersion: string;
}

export function generateToolbarHTML(screen: Screen): string {
  const versionButtons = screen.versions
    .map((v) => {
      const active = v.name === screen.activeVersion ? ' class="active"' : "";
      return `<button${active} data-file="${v.file}" title="${v.description}">${v.name}</button>`;
    })
    .join("\n      ");

  return `<div class="toolbar">
    <div class="toolbar-section">
      <button id="prev-btn" ${screen.index <= 1 ? "disabled" : ""}>&larr; Prev</button>
      <span class="screen-name">Screen ${screen.index}/${screen.total}: ${screen.label}</span>
      <button id="next-btn" ${screen.index >= screen.total ? "disabled" : ""}>Next &rarr;</button>
    </div>
    <div class="toolbar-section">
      ${versionButtons}
    </div>
    <div class="toolbar-section">
      <button class="approve">Approve</button>
      <button class="reject">Reject</button>
    </div>
  </div>`;
}
