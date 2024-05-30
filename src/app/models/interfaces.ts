export interface CadenaI {
  name: string;
  code: String;
}

export interface RestauranteI {
  name: string;
  code: String;
}

export interface multiSelectI {
  name: string;
  select: boolean;
  children: optionsToSelectI[];
  time?: string;
}

export interface optionsToSelectI {
  name: string;
  code: string;
  parent?: string;
  select: boolean;
  time?: string;
  allCompleteSubCategoria?: boolean;
  allCompleteSubProducto?: boolean;
  children?: optionsToSelectI[];
}

export interface menuItemI {
  id: number;
  rstName: string;
  channelName: string;
  status: string;
  createdAtFormat: string;
}

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface automaticSync {
  id?: string;
  syncMaxPoint: boolean;
  syncTime: string | null;
  aggregators: Array<AggregatorI>;
}

export interface AggregatorI {
  id?: string;
  code: number;
  name: string;
  active?: true;
}