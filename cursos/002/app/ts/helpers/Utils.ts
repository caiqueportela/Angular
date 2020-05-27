import { Imprimivel } from "../models/index";

export function imprime(...objetos: Imprimivel[]): void {
    objetos.forEach(objeto => objeto.paraTexto());
}