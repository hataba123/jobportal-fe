export interface Category {
  id?: string | number;
  name: string;
  description?: string; // description of the category
  icon?: string; // icon name, path, hoặc component
  color?: string; // mã màu hoặc tên màu cho category
}
