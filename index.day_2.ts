export type FlatCategory = {
  id: string;
  parentId: string | null;
  name: string;
  order: number;
};

export const flatCategories: FlatCategory[] = [
  { id: "c1", parentId: null, name: "Електроніка", order: 1 },
  { id: "c2", parentId: "c1", name: "Смартфони", order: 1 },
  { id: "c3", parentId: "c1", name: "Ноутбуки", order: 2 },
  { id: "c4", parentId: "c2", name: "Аксесуари для смартфонів", order: 2 },
  { id: "c5", parentId: "c2", name: "Чохли", order: 1 },
  { id: "c6", parentId: null, name: "Одяг", order: 2 },
  { id: "c7", parentId: "c6", name: "Взуття", order: 1 },
  { id: "c8", parentId: "c7", name: "Кросівки", order: 1 },
  { id: "c9", parentId: "c7", name: "Сандалі", order: 3 },
  { id: "c10", parentId: "c6", name: "Шкарпетки", order: 2 },
  { id: "c11", parentId: "c2", name: "Планшети", order: 1 },
  { id: "c12", parentId: "c11", name: "Аксесуари для планшетів", order: 1 },
  { id: "c13", parentId: "c2", name: "Планшети", order: 2 },
  { id: "c14", parentId: "c1", name: "Телевізори", order: 3 },
  { id: "c15", parentId: "c14", name: "Телевізори", order: 1 },
  { id: "c16", parentId: "c14", name: "Телевізори", order: 2 },
  { id: "c17", parentId: "c6", name: "Дитячий одяг", order: 2 },
  { id: "c18", parentId: "c17", name: "Взуття", order: 1 },
  { id: "c19", parentId: "c18", name: "Кросівки", order: 1 },
  { id: "c20", parentId: "c18", name: "Сандалі", order: 3 },
  { id: "c21", parentId: "c17", name: "Шкарпетки", order: 2 },
  { id: "c22", parentId: "c6", name: "Шкарпетки", order: 2 },
  { id: "c23", parentId: "c17", name: "Дитячий одяг", order: 2 },
  { id: "c24", parentId: "c18", name: "Взуття", order: 1 },
  { id: "c25", parentId: "c18", name: "Кросівки", order: 1 },
  { id: "c26", parentId: "c18", name: "Сандалі", order: 3 },
  { id: "c27", parentId: "c17", name: "Шкарпетки", order: 2 },
  { id: "c28", parentId: "c6", name: "Шкарпетки", order: 2 },
  { id: "c29", parentId: "c17", name: "Дитячий одяг", order: 2 },
  { id: "c30", parentId: "c18", name: "Взуття", order: 1 },
  { id: "c31", parentId: "c18", name: "Кросівки", order: 1 },
  { id: "c32", parentId: "c18", name: "Сандалі", order: 3 },
  { id: "c33", parentId: "c17", name: "Шкарпетки", order: 2 },
  { id: "c34", parentId: "c6", name: "Шкарпетки", order: 2 },
  { id: "c35", parentId: "c17", name: "Дитячий одяг", order: 2 },
  { id: "c36", parentId: "c18", name: "Взуття", order: 1 },
  { id: "c37", parentId: "c18", name: "Кросівки", order: 1 },
  { id: "c38", parentId: "c18", name: "Сандалі", order: 3 },
  { id: "c39", parentId: "c17", name: "Шкарпетки", order: 2 },
  { id: "c40", parentId: "c6", name: "Шкарпетки", order: 2 },
  { id: "c41", parentId: "c17", name: "Дитячий одяг", order: 2 },
  { id: "c42", parentId: "c18", name: "Взуття", order: 1 },
  { id: "c43", parentId: "c18", name: "Кросівки", order: 1 },
  { id: "c44", parentId: "c18", name: "Сандалі", order: 3 },
  { id: "c45", parentId: "c17", name: "Шкарпетки", order: 2 },
  { id: "c46", parentId: "c6", name: "Шкарпетки", order: 2 },
  { id: "c47", parentId: "c17", name: "Дитячий одяг", order: 2 },
  { id: "c48", parentId: "c18", name: "Взуття", order: 1 },
  { id: "c49", parentId: "c18", name: "Кросівки", order: 1 },
  { id: "c50", parentId: "c18", name: "Сандалі", order: 3 },
];

export type CategoryTreeNode = FlatCategory & {
  children: CategoryTreeNode[];
};

function buildCategoryTree(items: FlatCategory[]): CategoryTreeNode[] {
  const sorted = items.toSorted((a, b) => a.order - b.order);

  const nodeMap = new Map<string, CategoryTreeNode>();

  sorted.forEach((item) => {
    nodeMap.set(item.id, { ...item, children: [] });
  });

  const roots: CategoryTreeNode[] = [];

  sorted.forEach((item) => {
    const node = nodeMap.get(item.id)!;

    if (item.parentId === null) {
      roots.push(node);
    } else {
      const parent = nodeMap.get(item.parentId);

      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
}

console.log(JSON.stringify(buildCategoryTree(flatCategories), null, 2));
