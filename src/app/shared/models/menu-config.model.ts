export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
}

export interface MenuConfig {
  menuId: string;
  title: string;
  items: MenuItem[];
}
