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