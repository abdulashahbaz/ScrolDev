// Scattered gallery grid. Each row holds one image, every third row holds two,
// and the column steps across the grid so the images zig-zag down the page.
// Returns one entry per cell: the image index, or -1 for an empty cell.
export function buildLayout(count: number, cols: number): number[] {
  const cells: number[] = [];
  let placed = 0;
  for (let r = 0; placed < count; r++) {
    const row = new Array<number>(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = placed++;
    if (r % 3 === 0 && placed < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = placed++;
    }
    cells.push(...row);
  }
  return cells;
}
