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
  time?: Date;
}

export interface optionsToSelectI {
  name: string;
  code?: string;
  id?: string;
  parent?: string;
  select?: boolean;
  syncTime?: Date;
  date?: string;
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
  aggregators: AggregatorI[];
}

export interface AggregatorI {
  id?: string;
  code: number;
  name: Aggregator;
  syncTime?: string;
  select?: boolean;
}

enum Aggregator {
  uber = "Uber",
  peya = "Pedidos Ya"
}