export interface AdapterWriteOnly<T> {

  adaptObjectReceive(obj: any): T;

  adaptObjectSend(obj: any): T;
}
