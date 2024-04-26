export interface Interfaces {}

export interface Cadena {
  name: string;
  code: String;
}

export interface Restaurantes {
  name: string;
  code: String;
}

export interface optionsToSelect {
  name: string;
  code: string;
  select: boolean;
}

export interface multiSelectI {
  name: string;
  select: boolean;
  children: optionsToSelect[];
}
