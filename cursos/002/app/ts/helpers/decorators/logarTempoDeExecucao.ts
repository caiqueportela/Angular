export function logarTempoDeExecucao(emSegundos: boolean = false) {

    /*
        Um decorator retorna outra função
        Deve receber:
            target - Recebe instancia onde o decorator foi colocado
            propertyKey - Nome do método onde o decorator foi colocado
            decriptor - Possui informações do método que recebeu o decorator
    */
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Método onde o decorator foi colocado
        const metodoOriginal = descriptor.value;

        // Sobrescreve método original
        descriptor.value = function(...args: any[])  {
            let unidade = 'ms';
            let divisor = 1;
            if (emSegundos) {
                unidade = 's';
                divisor = 1000;
            }
            console.log('----------------------------');
            console.log(`Parametros passados para o método ${propertyKey}: ${JSON.stringify(args)}`);
            const t1 = performance.now();
            // Chama o método original no contexto do decorator
            const retorno = metodoOriginal.apply(this, args);
            const t2 = performance.now();
            console.log(`O retorno do método ${propertyKey}: ${JSON.stringify(retorno)}`);
            console.log(`O método ${propertyKey} demorou ${(t2 - t1) / divisor} ${unidade}`);
            // Retorna o retorno do método original
            return retorno;
        }

        return descriptor;        
    }

}