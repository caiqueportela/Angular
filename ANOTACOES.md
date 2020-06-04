# Anotações

Anotações sobre todo conteúdo visto sobre Angular e dicas.

## TypeScript

- Ele não irá compilar, se usar as opções corretas, se houver algum erro de sintaxe, acesso, etc.

### Instalação

Dentro da pasta do projeto, precisamos criar o arquivo de configuração:
```
npm init
```
*Enter* em todas opções.

Instalando o TypeScript:
```
npm install typescript --save-dev
```

Agora precisa configurar o typescript. Criando o arquivo *tsconfig.json* na raiz do projeto e colocando o conteúdo:
```
{
    "compilerOptions": {
        "target": "es6",
        "outDir": "app/js",
        "noEmitOnError": true
    },
    "include": [
        "app/ts/**/*"
    ]
}
```
Ele basicamente fala pra pegar todos arquivos typescript (*.ts) dentro da pasta 'app/ts/' e converter em EcmaScript6 (Poderia usar qualquer outra versão) e o resultado colocar em 'app/js/'.

O navegador não reconhece TypeScript, apenas JavaScript, então precisa ocorrer essa compilação.

Para complicar, para facilitar, deve-se adicionar ao *package.json* um comando extra para facilitar o processo.
Dentro da tag *scripts* adicionar:
```
"compile": "tsc"
```

Agora para compilar o código, basta executar:
```
npm run compile
```

Para compilar em tempo real, adicione o script:
```
"start": "tsc -w"
```
Para iniciar o watch, basta rodar *npm start*

Para impedir que variáveis recebam valor *null* e *undefined*:
```
"strictNullChecks": true
```

Para remover comentários na compilação:
```
"removeComments": true,
```

### Classe

Diferentemente de JS, é necessário declarar os atributos de uma classe previamente:
```typescript
class Pessoa {

    nome;
    sobrenome;

    constructor(nome, sobrenome) {
        this.nome = nome;
        this.sobrenome = sobrenome;
    }
}
```

Ele implementa os modificadores de acesso. Assim podemos limitar o acesso a um atributo sem utilizar o underline:
```typescript
class Pessoa {

    private nome;
    private sobrenome;

    constructor(nome, sobrenome) {
        this.nome = nome;
        this.sobrenome = sobrenome;
    }
}

const pessoa = new Pessoa('Caique', 'Portela');
pessoa.nome = 'Outro nome'; // Gera erro de compilação
```

Eu posso declarar atributos e atribuir valores pelo construtor:
```typescript
class Pessoa {

    constructor(
        private _nome: string,
        private _sobrenome: string
    ) { }
}
```
Dessa forma, as variáveis serão criadas como privadas e receberão o valor passado via construtor.

Se eu tenho atributos que pode ser lidos mas não alterados, ao invés de defini-los como private e criar getters, posso fazer:
Eu posso declarar atributos e atribuir valores pelo construtor:
```typescript
class Pessoa {

    constructor(
        readonly nome: string,
        readonly sobrenome: string
    ) { }
}
```

Posso declarar um parametro como opcional:
```typescript
class Pessoa {

    constructor(
        readonly nome: string,
        readonly sobrenome?: string
    ) { }
}
```
Basta adicionar **?** após seu nome, antes da declaração do tipo.

### Tipagem

O Typescript adiocina a tipagem de variáveis, arumentos e retorno de funções.

Por padrão, se nada for informado, ele adiciona implicitamente o typo *any* a todas variáveis.

Para impedir o tipo implicito e gerar erro de compilação, deve-se adicionar a configuração ao arquivo *tsconfig.json*:
```
"noImplicitAny": true
```
Dentro do objeto *compilerOptions*.

Para declarar o tipo, basta adicionar dois pontos e o valor após a variável:
```typescript
class Pessoa {

    private nome: string;
    private sobrenome: string;

    constructor(nome: string, sobrenome: string) {
        this.nome = nome;
        this.sobrenome = sobrenome;
    }
}
```

Para fazer o *casting* de valores, utiliza-se do sinal de maior e menor (< e >):
```typescript
class NegociacaoController {
    
    private _input: HTMLInputElement;

    constructor() {
        this._input = <HTMLInputElement>document.querySelector('#input');
    }

}
```

### Bibliotecas

A grande maioria das bibliotecas de JavaScript adicionam objetos ao escopo global, porem por padrão o TypeScript não sabe disso.

Para corrigir, há duas possibilidades:
```typescript
declare var $: any;
```
Nesse caso, estou declarando o *$* que é utilizado pelo JQuery e dessa forma conseguirei utiliza-lo sem problemas. Porém perco a sugestão e complemento de código.

Outra possibilidade é instalar a *tipagem* da biblioteca, caso existe. Ex:
```
npm i @types/jquery
```
Com isso o VSCode já reconheceria o JQuery para completar código e o compilador não daria erro.

### namespace

Com TypeScript posso declarar namespace:
```typescript
namespace Humanoides {

    export class Homem {

        // código omitido 
    }    

    export class Monstro {

        // código omitido 
    }        

    export class Hibrido {

        // código omitido 
    }            
}
```
Quando declaro namespace, preciso exportar as classes que fazem parte dele.

Não preciso clicar as classes no mesmo arquivo, posso separa-las mas sempre colocar dentro do namespace:
```typescript
namespace Humanoides {

    export class Homem {

        // código omitido 
    }

}

namespace Humanoides {

    export class Monstro {

        // código omitido 
    }        

}

namespace Humanoides {

    export class Hibrido {

        // código omitido 
    }

}
```

Para utilizar uma classe que faz parte de um namespace:
```typescript
namespace Humanoides {

    export class Homem {

        // código omitido 
    }

}

const homem = new Humanoides.Homem();
```

### decorators

O JS possui a discussão sobre a implementação de decorators, e o Typescript já permite o uso.
Com eles, podemos alterar o uso de funções e classes.

Isso está em modo experimental no TypeScript, e para habilitar o uso devemos adicionar:
```
"experimentalDecorators": true
```
Dentro de *compilerOptions* do tsconfig.json.

Apesar de experimental, é amplamente utilizado por frameworks, como Angular e React.

Como exemplo, um decorator para mostar o tempo de execução de um método:
```typescript
class Loops {

    @tempoExecucao()
    loopGrande() {
        // Código da função
    }

}
```
Da forma acima, estou adicionando um decorator que poderá alterar a implementação do método.

E a implementação do decorator:
```typescript
export function tempoExecucao(emSegundos: boolean = false) {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const metodoOriginal = descriptor.value;

        descriptor.value = function(...args: any[])  {
            let unidade = 'ms';
            let divisor = 1;
            if (emSegundos) {
                unidade = 's';
                divisor = 1000;
            }

            const t1 = performance.now();
            const retorno = metodoOriginal.apply(this, args);
            const t2 = performance.now();

            console.log(`O método ${propertyKey} demorou ${(t2 - t1) / divisor} ${unidade}`);
            
            return retorno;
        }

        return descriptor;        
    }

}
```
Um decorator é uma função que retorna outra função. Ele pode receber parametros.

A função retornada, quando em método, deve receber três parametros:

- **target**: Instancia de onde o decorator foi usado
- **propertyKey**: Nome do método onde o decorator foi usado
- **descriptor**: Informações do método que recebeu o decorator

Em **descriptor.value** está o código do método original. Devemos alterar a sua implementação para alterar o uso do método.
Ele deve receber uma nova função que pode receber 0 a N parametros, pois a função pode ter nenhum, um, ou vários parametros

Dentro dessa função podemos executar códigos antes e depois do método.

Para efetivamente chamar o método original, devemos preservar em uma váriavel o valor original, e depois chamar:
```typescript
const metodoOriginal = descriptor.value;

const retorno = metodoOriginal.apply(this, args);
```
O retorno do método deve ser guardado e retornado, para que seu funcionamento base se mantenha.

No final a função deve retornar o descriptor alterado.

Podemos também criar decorators de classe, que permite alterar o construtor da mesma:
```typescript
export function decorandoClasse() {

    return function(constructor: any) {
        const original = constructor;

        const novo: any = function (...args: any[]) {
            console.log("Criando uma instância com New: " + original.name); 
            return new original(...args);
        }

        novo.prototype = original.prototype;

        return novo;
    }
}

@decorandoClasse()
export class Loops {
   // Implementação da classe
}
```
Um decorator de classe, assim como de função, retorna uma função que deve receber seu construtor e armazena-lo.
Essa função deve poder receber N argumentos.

No final da alteração do construtor deve retornar uma instancia da classe.

Deve manter o mesmo protoype. **Importante!**.
Retorna a inteancia.

## Angular

### CLI

Interface de linha de comando do Angular que auxilia na criação e gerenciamento de projetos.

Para instalar, basta executar o comando:
```
npm install -g @angular/cli
```
Ele irá instalar o pacote globalmente no PC, ficando disponível em qualquer diretório, em qualquer projeto.

Para criar um novo projeto:
```
ng new nomeDoProjeto
```

Para iniciar o projeto:
```
ng serve --open
```
A opção **--open** é opcional e serve para abrir o navegador com a aplicação em execução.

