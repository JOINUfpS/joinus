export interface Adapter<T> {

  adaptList(list: any): T[];

  adaptObjectReceive(obj: any): T;

  adaptObjectSend(obj: any): T;
}
