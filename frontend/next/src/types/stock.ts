export const stockTemplateFields = [
  {
    value: 'Brand Name',
    label: 'Brand Name',
    required: true,
    type: 'text' as const
  },
  {
    value: 'Product Name',
    label: 'Product Name',
    required: true,
    type: 'text' as const
  },
  {
    value: 'Category',
    label: 'Category',
    required: true,
    type: 'text' as const
  },
  {
    value: 'Type',
    label: 'Type',
    required: false,
    type: 'text' as const
  },
  {
    value: 'Size',
    label: 'Size',
    required: true,
    type: 'text' as const
  },
  {
    value: 'Price',
    label: 'Price',
    required: true,
    type: 'text' as const
  }
] as const;

export const mutableStockTemplateFields = stockTemplateFields.map((field) => ({ ...field }));
