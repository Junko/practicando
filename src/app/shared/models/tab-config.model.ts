export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component?: any;
  route?: string;
  content?: string;
}

export interface TabsConfig {
  tabs: TabConfig[];
  tabBarPosition?: 'top' | 'bottom';
  tabBarColor?: string;
}
