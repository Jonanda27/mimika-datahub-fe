// src/types/source.ts

export interface Source {
  id: number;
  name: string;
  type: string; // bps, opd, kementerian, dll 
  icon?: string;
}

export interface SourceCreate {
  name: string;
  type: string;
  icon?: string;
}