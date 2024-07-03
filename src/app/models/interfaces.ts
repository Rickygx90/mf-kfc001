export interface CadenaI {
  id: number;
  description: string;
  tradename: string
}

export interface RestauranteI {
  id: number;
  codeStore: string;
  idChain: number;
  select?: boolean;
}

export interface multiSelect2I {
  name: string;
  select: boolean;
  children: RestauranteI[];
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
  _id: Object;
  syncrosId: string;
  startTime: Date | null;
  endTime?: Date | null;
  status: string;
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