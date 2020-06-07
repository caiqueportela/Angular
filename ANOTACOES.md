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




### Plus ++

#### Safe navigation operator

Existe um operador chamado **Safe navigation operator** que nos auxilia quando queremos acessar uma propriedade de um objeto e ela possa não existir.

Com ele podemos checar se a propriedade existe, se não ele ignora e não da erro de acesso ao objeto.

Exemplo:
```typescript
const pessoa = {
    nome: 'Nome',
    sobrenome: 'Sobrenome'
};

console.log(pessoa.historico?.trabalho);
```
Nesse caso, ele checa se a propriedade *historico* existe no objeto pessoa.



## Angular

- Em angular, tudo é um componente.
- O *index.html* é o arquivo base da view do angular, mas só deve ser alterado para adicionar coisas ao cabeçalho da página e em casos pontuais. 
- O **App** é o primeiro componente a ser carregado, tudo deve começar por ele.
- Por convenção, os nomes dos arquivos possuem todas as palavras em minusculo separadas por hifen; E a extenção possui sempre o tipo do arquivo (modulo, componente, etc.) e no final .ts.

### Build e Deploy

O Angular CLI nos fornece um comando para realizer o build de produção do projeto, onde será aplicado várias técnicas de otimização de código para deixar ele o mais simples e menor possível.

Para que ele se comporte como uma SPA e todas as requisições a rotas sejam feitas ao Angular e não a um backend, o servidor onde está hospedado o código **SEMPRE** deverá retornar o *index.html* como resposta para as rotas.

Uma maneira de mudar isso e fazer que ele não necessite dessa mudança, é fazer com que seja adicionado uma *#* ao inicio da rota, que com isso os navegadores nunca enviarão a requisição para o servidor.

Pasa isso, no seu módulo de rota principal, onde importa as primeiras rotas, altere o import para:
```typescript
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
```
Basicamente, adicionado a opção *useHash* o problema se resolve.

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

Para gerar um componente:
```
ng generate componente nome-do-componente
```
ou 
```
ng g c nome-do-componente
```
Será gerado o componente dentro da pasta *src/app*. Será criado uma pasta nom o nome dele e dentro dela o componente.

Para gerar um serviço:
```
ng generate service nome-servico
```
ou 
```
ng g s nome-servico
```
Será gerado o serviço dentro da pasta *src/app*, sem gerar subpastas.

### Frameworks de terceiros

No Angular, para utilizar Frameworks de terceiros (bootstrap, jquery, etc.) tem um processo diferente do que adicionar ao HTML. Isso pois esses arquivos precisam fazer parte do processo e participar o processo de build.

Primeiro precisa baixar o pacote desejado pelo npm (A maioria, se não todos, devem possuir oficialmente a disponibilização por ele).

No arquivo **angular.json** existe diversas configurações que o Angular CLI utiliza para a compilação.

Há nele duas propriedades *styles* e *scripts* que servem respectivamente para definir arquivos CSS e JS para serem adicionados ao projeto. Por padrão já deve ter um CSS global adicionado.
Tudo colocado nessas propriedades será aplicado e disponibilizado de forma global ao projeto, diferentemente do que é feito nos arquivos individuais de cada componente.


### Componentes

No Angular tudo é um componente, que nada mais é que a junção do modelo, visual e CSS.

Um componente é declarado a partir de uma classe que possui o decorator **@Component**. Esse decorator receber alguns parametros, como:

- **selector**: Indica qual o seletor HTML que será usado para exibir esse componente.
- **templateUrl**: Indica qual arquivo HTML que servirá de view desse componente.
- **styleUrls**: Uma lista com os arquivos CSS que servirão de estilo pra esse componente.

**Um componente precisa obrigatoriamente fazer parte de um módulo, e exclusivamente de apenas um!**

Exemplo: 
```typescript
@Component({
    selector: 'app-cabecalho',
    templateurl: './cabecalho.component.html',
    styleUrls: [ './cabecalho.component.css' ]
})
export class CabecalhoComponent {

}
```
Por convenção esse arquivo se chamaria *cabelho.component.ts*.

Não é obrigatório a definição de um seletor.

### Data binding (Associação de dados)

Data binding é a forma de associar informações do modelo com o template (visualização).

Um exemplo de dada binding é a exibição de variáveis do modelo na visualização.

Para isso se coloca o nome da variável entre dois blocos de chaves. Ex:
```typescript
const nome = 'Angular';
```
```html
<h1>{{ nome }}</h1>
```
Esse tipo de data binding serve apenas para transferir informações (texto) do modelo para a view! É conhecido (nem tanto assim) como Angular expression (AE).

Para que esses dados sejam utilizados em atributos do HTML, utilizamos outra forma de data binding.

Para realizar isso, colocamos o atributo entre colchetes e o valor em seguida. Ex:
```typescript
const url = 'httt://exemplo.com/imagem.jpg';
const descricao = 'Imagem';
```
```html
<img [src]="url" [alt]="descricao">
```
Esse tipo de data binding é conhecido como One way data binding.

Um componente pode emitir valores de voltar, como eventos, e para isso existe um data binding. Ex:
```typescript
<app-meu (eventoDisparado)="destino($event)"></app-meu>
```
O nome do evento disparado precisa estar entre parenteses. Ele recebe o código a ser executado com os dados recebidos. Geralmente é passado uma função, mas pode atribuir valores a variaveis, etc. Ele devolve uma variavel com nome *$event* que é os valores emitidos pelos eventos.

### Módulos

Os módulos servem para organizar a aplicação, juntando componentes que se relacionam entre si e não fazem sentido um sem o outro.

Um módulo que possui componentes quw só fazem sentido juntos pode ser chamado de **feature module**.

Um módulo é uma classe que possui um decorator **@NgModule** que recebe como parametro alguns informações:

- **declarations**: Componentes, diretivas, pipes, etc. que fazem parte desse módulo.
- **imports**: Modulos que são requisitos para os componentes desse módulo funcionar.
- **exports**: Permite que os membros desse módulo possam ser utilizados por outros.

Exemplo:
```typescript
@NgModule({
    declarations: [
        MeuComponent
        MeuComponent2,
        MeuComponent3
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MeuComponent
    ]
})
export class MeuModule { }
```

Só coloca em exports componentes que serão chamados via template.

### Inbound properties

É a forma de podemos passar valores para um componente.

No componente que vai receber o parametro, declaramos ele assim:
```typescript
export class MeuComponent {
    @Input() nome = '';
}
```
Nesse caso, esse componente possui um parametro chamado *nome* que por padrão é uma variávei do componente, e por isso possui um tipo e pode ser utilizada normalmente.

Para parra esse parametro, fazemos:
```html
<app-meu nome="Caique"></app-meu>
```
Esse valor pode ser também passado por binding (entre colchetes).

### Output properties

É a forma que um model (componente) possa retornar um valor para a view (template) que chamou ele.

No model declaramos ele:
```typescript
export class SaidaComponent {
    @Output() mensagem = new EventEmitter<string>();
}
```
Ele irá sar saida ao atributo *mensagem* do tipo *string*.

Para mandar o valor, precisamos emitir o valor:
```typescript
mensagem.emit('eu sou a mensagem');
```

Para receber o valor, utiliza o event binding:
```html
<app-saida (mensagem)="exibeMensagem($event)"></app-saida>
```

### ng-content

Um componente possui uma tag de abertura e fechamento como uma tag HTML, mas diferentemente de uma tag do HTML, se colocarmos qualquer conteudo entre a abertura e o fechamento da tag do seletor do componente, esse conteúdo não é exibido.

Para exibir esse conteudo, devemos inserir **\<ng-content\>\</ng-content\>** onde queremos exibir esse conteúdo.

### Diretivas

São formas de alterar o comportamento de um componente.

#### ngFor

A diretiva ***ngFor** permite que um bloco de código seja repedido N vezes, assim como um for normal de qualquer linguagem.

Exemplo de uso:
```typescript
const numeros = [1, 2, 3, 4];
```
A partir de uma lista de itens.
```html
<ul>
    <li *ngFor="let n of numeros">{{ n }}</li>
</ul>
```
Declaremos a variável que vai recever cada item da lista (*n*) e indicamos em qual lista vamos nos basear.

#### ngIf

A diretiva ***ngIf** serve para a exibição ou não de um componente depender de uma condição retornar true, assim como um if normal.

Exemplo de uso:
```typescript
const numero = 3;
```
```html
<p *ngIf="numero % 2 === 0">
    O número é par!
</p>
```

Esse if pode ter um else, mas dessa forma precisará adicionar o elemento *<ng-template>* para funcionar.

Exemplo de uso:
```typescript
const numero = 3;
```
```html
<p *ngIf="numero % 2 === 0; else numeroImpar">
    O número é par!
</p>
<ng-template #numeroImpar>
    O número é impar!
</ng-template>
```

#### Diretiva customizada

Uma diretiva é uma classe que possui o decorator **@Directive** e receber um objeto com configurações, sendo *seletor* como obrigatório para definir como ele será utilizado.

Para utilizar a diretiva como se fosse um atributo do elemento, o nome do seletor precisa ser inserido entre colchetes.

A diretiva se asemelha a um componente, mas diferentemente não possui um template, mas precisa ser declarado no módulo, e exportado se necessário utilizar fora dele.

Podemos adicionar ao contrutor a injeção de dependencia de referência ao elemente onde ela foi utilizada.

Exemplo:
```typescript
@Directive({
    selector: '[log]'
})
export class LogDirective {

    contructor(
        private el: ElementRef
    ) { }

}
```
Assim, ele seria usada *\<p log\>\</p\>* em qualquer elemento.

Um exemplo de uso de diretiva é adicionar a escuta a eventos que possa ocorrer nesse componente e adicionar ações para tal.

```typescript
@Directive({
    selector: '[log]'
})
export class LogDirective {

    contructor(
        private el: ElementRef
    ) { }

    @HostListener('mouseover')
    logPassouMouse() {
        console.log('passando o mouse...');
    }

}
```
Faz um console.log sempre que passar o mouse sobre o componente.

Uma diretiva customizada pode receber parametros. Exemplo:
```typescript
@Directive({
    selector: '[log]'
})
export class LogDirective {

    @Input() mensagem = '';

    contructor(
        private el: ElementRef
    ) { }

    @HostListener('mouseover')
    logPassouMouse() {
        console.log(`passando o mouse... ${mensagem}`);
    }

}
```
E para utiliza-la:
```html
<p log mensagem="no parágrafo :P"></p>
```

### Injeção de dependencia

No angular, uma classe pode receber a instância de outra classe via injeção de dependência. Isso facilita a não precisar se preocupar em criar uma instância da classe e no que ela precisa pra funcionar. O Angular trata tudo isso para nós.

Para isso funciona, basta declarar o atributo que deseja via construtor. Ex:
```typescript
    constructor(
        http: HttpClient
    ) { }
```
Desse forma, receberemos uma instância da classe *HttpService* e será atribuida a propriedade http.

Se a propriedade não possuir um modificador de acesso (public, private) ela apenas estará disponível dentro do construtor.

### Serviços

Comumente, em diversas linguagens, são arquivos que isolam a lógica sobre a manipulação de dados (busca, atualização, etc.)

Um serviço é uma classe comum, que recebe um decoretor **@Injectable** para indicar que ela pode ser injetada como dependência. Ele pode receber alguns parametros, mas o principal é *providedIn* que geralmente possui o valor *root*; Esse parametro serve para indicar seu escopo, e o valor root indica que é global, ou sejam de toda a aplicação.

Exemplo de declaração de um serviço:
```typescript
@Injectable({
    providedIn: 'root'
})
export class MeuService {

    constructor(
        private http: HttpClient
    ) { }

}
```

### Pipes

Os pipes são "tubos de passagem" que alteram o valor passado. Utilizamos eles para criar padrões de formatação, alteração de textos, etc.

O Angular já possui alguns pré definidos, como por exemplo o *uppercase* que serve para transformar um texto em maisculo.

Para utiliza-lo, fazemos:
```html
<h1>{{ nome | uppercase }}</h1>
```

para criarmos nosso pipe, precisamos criar uma classe e adicionar o decorator **@Pipe** que obrigatoriamente deve receber um parametro *name* que indica o nome do pipe que será usado para chama-lo. Além disso, a classe deve implementar a intyerface **PipeTransform** que irá obrigar a implementar o método **transform** que é automaticamente chamado quando o pipe é utilizado.

Esse método recebe como primeiro parametro o valor passado ao pipe, e opcionalmente, pode ter mais N parametros, pois o pipe pode receber parametros adicionais. Esse método deve retornar o resultado da transformação.

Exemplo de um pipe:
```typescript
@Pipe({
    name: 'parOuImparPipe'
})
export class parOuImparPipe implements PipeTransform {

    transform(numbers: number[], retornarPares: boolean = true) {
        const resto = retornarPares ? 0 : 1;

        return numbers.filter(numero => numero % 2 === resto);
    }
}
```
Um exemplo de pipe que recebe uma lista de numeros e um parametro opcional de se deve retornar apenas os pares ou impares.

### Ciclo de vida

Os componente do Angular possuem ciclo de vida, ou seja, basicamente estados diferentes. E com isso, conseguimos executar códigos dependendo do estado do componente.

#### OnInit

Esse estado ocorre após o componente ser instânciado e receber os inbound properties. Para utiliza-lo, basta criar um método com o nome **ngOnInit** e seu código será executado quando ele chegar a esse estado. Mas para evitar erros no uso do método, é importando implementar a interface **OnInit** pra garantir que seu componente está corretamente implementando o uso desse ciclo.

Exemplo de uso:
```typescript
export class meuComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        console.log('Já iniciei!');
    }

}
```

#### OnChanges

Esse estado ocorre após algum inbound property sofre alteração. Chama o método **ngOnChanges** e é sempre bom implementar a interface **OnChanges**.

Esse método recebe um parametro do tipo **SimpleChanges** que possui as propriedades que foram alteradas. Assim podemos realizar ações dependendo do que foi ou não alterado. As propriedades terão o mesmo nome dos inbound properties.

Exemplo de uso:
```typescript
export class meuComponent implements OnChanges  {

    @Input() nome = '';

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nome) {
            console.log('nome mudou de valor');
        }
    }

}
```

#### OnDestroy

Esse estado ocorre ao componente ser destruido. Chama o método **ngOnDestroy** e é sempre bom implementar a interface **OnDestroy**.

Exemplo de uso:
```typescript
ngOnDestroy(): void {
    console.log('Tchau tchau...');
}
```

### RxJS

É uma biblioteca muito famosa que auxilia bastante durante o desenvolvimento da aplicação.

Uma das coisas que ela oferece, e o Angular aproveita, é o uso de Observables ao inves de Promises.

Apesar de parecidos, Observables junto ao RxJS oferece muito mais recursos e possibilidades.

Um exemplo disso é em requisições http, que no Angular por padrão retornam um Observable. Pra ele efetivamento funcionar, ele deve ter algum inscrito para que possa receber o resultado, seja de sucesso ou erro. Exemplo:
```typescript
http
    .get<Object[]>('http://api.exemplo.com')
    .subscribe(
        successResult => console.log(successResult),
        err => console.log(err)
    );
```
Um o método subscribe de um Observable pode receber duas funções como parametros, a primeira pra caso de sucesso e a segunda pra caso de erro.

O Observable pode receber inscrito diretamente no template. Isso faz sentido apenas quando a consulta vai ser única e não altera o valor a menos que recarregue a página. Este recurso de chama **async pipe**.

Exemplo:
```html
<header class="fixed-top">
    <div *ngFor="let item of data | async)">
        <p>{{ item }}</p>
    </div>
</header>
```
Partindo que **data** é uma variável que recebeu um Observable que retornará uma lista de items, nos inscrevemos nela diretamente na diretiva *ngFor*.

#### Subject

Um valor observável que pode receber inumeros inscritos que serão informados quando seu valor for alterado.

Ele precisa ser criado declarando o tipo do valor que ele irá receber. Exemplo:
```typescript
const observavel = new Subject<string>();
```

Para informar um novo valor para ele:
```typescript
observavel.next('novo valor');
```

E para criar um observável:
```typescript
observavel.subscribe(valor => console.log(`Novo valor: ${valor}));
```

**Atenção**: Se esse observável nunca se completa (ele fica sempre observando) ele fica guardado na memória mesmo se alterarmos de tela, e isso pode acabar causando um estouro de memória. O indicado é implemente um método no estado de destruição do componente para se desiscrever. Exemplo:
```typescript
observavel.unsubscribe();
```

#### BehaviorSubject

Semelhante ao **Subject** mas com duas diferenças importantes:

- Ele precisa possuir um valor inicial a ser emitido.
- Se ninguém se inscreveu e recebeu o valor, ele armazena e vai emitir novamente quando alguem se inscrever.

Exemplo:
```typescript
const observavel = new BehaviorSubject<string>(null);
observavel.next('novo valor');
```
Posso definir o valor inicial como *null* caso não tenha nada ainda.

#### pipe

Permite sequenciar varias funções onde uma depende do resultado da outra para ser executada, assim encadeando chamadas.

Exemplo:
```typescript
pipe(
    [ ...Array(10).keys() ],
    map(n => n * 2),
    filter(n => n % 2 === 0)
);
```

#### tap

Dentro de um observable, conseguimos manipular sua resposta sem afeta-la e antes mesmo de realizar o subscribe.

Exemplo:
```typescript
export class MeuService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string) {
    return this.http
      .post('http://localhost/login', {
        userName,
        password
      })
      .pipe(
        tap(res => console.log(res))
      );
  }

}
```
Pegamos a resposta de uma requisição e ainda retornamos o observable para receber uma inscrição.

#### debounceTime

Cria um observavel após o tempo especificado ter passado.

Exemplo:

```typescript
pipe(
    debounceTime(500)
)
.subscribe(() => console.log('o tempo passou'));
```

### Rotas

Um site pra ser uma SPA possui uma característica chave: Aparentar ser uma página única, que não recarrega, apenas navega entre as páginas como se fosse um aplicativo instalado na página.

Para isso funcionar, precisamos definir rotas e seus comportamentos.

Para declarar rotas, se utiliza um módulo de rotas, que geralmente vai acompanhado de um módulo de componentes (features).

Ele deve possuir a declaração de objetos que possui as regras de cada rota. Cada objeto é do tipo **Route** e a lista de rotas formam o tipo **Routes**. Ambos fazem parte do pacote *@angular/router*.

A estrutura base de uma rota é o caminho (path) e o componente base que vai representa-lo. Exemplo:
```typescript
const routes: Routes = [
    {
        path: '',
        component: HomeComponent 
    },
    {
        path: 'list',
        component: ListComponent
    }
];
```
Normalmente a variável com as rotas é denominada *routes*.

O caminho vazio (string vazia) indica a raiz daquele endereço.

Como as rotas são declaradas em um módulo de rotas, essa classe deve possuir o decorator **NgModule**.
Ele deve importar o **RouterModule** e exporta-lo, para que quem utilize-se esse módulo saiba entender as rotas.

Além disso, ao importar o **RouterModule** deve-se indicar qual a propriedade que possui as informações das rotas. Para isso deve ser chamado, a partir do módulo, o método **.forRoot(routes)** passando as rotas como atributo.

Assim, temos um arquivo de exemplo de rotas:
```typescript
const routes: Routes = [
    {
        path: '',
        component: HomeComponent 
    },
    {
        path: 'list',
        component: ListComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MeuRoutingModule { }
```

Pra essa rota funcionar, a view precisa saber onde o componente da rota deverá ser carregada.

Para isso, no local onde esse componente deverá aparecer devemos adicionar a diretiva **\<router-outlet\>\</router-outlet\>**.

Nesse local será exibido o componente da rota. Geralmente ela é colocada como único conteúdo do *app.component.html*.

#### Rota coringa

Podemos declarar uma rota coringa, pra ser chamado quando nenhuma regra de rota definida seja igual ao que foi informado.

Para isso pasta indica **\*\*** como caminho, e o componente que deve ser exibido. Exemplo:
```typescript
{
    path: '**',
    component: NotFoundComponent
}
```

#### Parametros via rota

Uma rota nem sempre possuirá apenas parametros fixos, poderá ter parte do caminho variável, assim podendo passar parametros. Exemplo de rota:
```typescript
{
    path: 'users/:userId',
    component: DetailUserComponent
}
```
Assim, se acessarmos o endereço */users/qualquer-coisa-aqui* o valor que está no local que indicamos *:userId* será variável e seu valor poderá ser acessado pelo componente de destino.

Para acessar os valores da rota, o componente precisa receber como injeção de dependencia **ActivatedRoute**.

O valor recebido, possui a propriedade *snapshot* que se refere a uma fotografia atual da rota, e essa fotografia possui então os parametros passados a ela.

Para acessarmos o valor da rota de exemplo, fariamos
```typescript
const id = this.activatedRoute.snapshot.params.userId;
```
O nome do parametro é o nome definido na rota.

#### Guarda de rotas

Normalmente será necessário proteger algumas rotas, seja porque o usuário precisa estar logado para acessa-la, ou simplesmente porque ele não possui permissão de acesso.

Para isso, precisamos criar uma classe injetável. Ela pode implementar algumas interfaces diferentes, mas nesse primeiro momento vamos ver a **CanActivate** que ajuda a definir se esse rota pode ser ativada pelo usuário.

Ao implementar a interface, ele obrigará a possuir o método **canActive** que pode retornar um booleano, um Observable do tipo booleano ou uma Promise do tipo booleano. No geral, ele deverá retornar um false caso o usuário não possa acessar, ou um true quando ele pode.
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinhaGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (Math.round(Math.random() * 10) % 2 === 0) {
      this.router.navigate(['outra', 'rota']);
      return false;
    }

    return true;
  }

}
```
O método está avaliando se um numero aleatorio gerado é par. Se for par, redireciona pra outra tela e nega acesso a atual. Caso contrário, permite acesso.

Se negar o acesso, é essencial que haja um redirecionamento ou o dado que apareceria no *router-outlet* vai ficar vazio.

No nosso arquivo de rotas, é necessário informar o uso dessa guarda.
```typescript
{
    path: '',
    component: MeuComponent,
    canActivate: [
      MinhaGuard
    ],
},
```
O *canActivate* recebe uma array pois pode receber mais de uma guarda.

#### Rotas filhas

Muitas vezes, iremos querer que um rota carregue um componente base (de um módulo do site, por exemplo) e esse componente possa ter suas próprias sub rotas (rotas filhas).

Para isso, declaramos as rotas da seguinte forma:
```typescript
{
  path: '',
  component: IndexComponent,
  children: [
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: 'register',
      component: RegisterComponent,
    },
  ]
},
```
Assim, a rota '*raiz*' por padrão carrega um componente base e essa rota possui filhos. Esses filhos definem sub rotas a partir da base do pai. Uma rota filha com o *path* vazio define o primeiro componente a ser exibido caso nenhuma sub rota seja informada.

No componente pai, adicionamos **\<router-outlet\>\</router-outlet\>** onde queremos que seja exibido as rotas filhas.

#### Navegação via template

Para navegar entre rotas da nossa aplicação um simples tag a funcionaria, porém por padrão ele causaria o recarregamento da página, o que não é esperado por uma SPA.

Para ajudar com isso, temos acesso a diretiva **routerLink** que nos ajuda com a navegação. Para utiliza-la em nosso módulos, precisamos importar o **RouterModule**.

Exemplo
```html
<a [routerLink]="['nova', 'tela']">Mudando de tela</a>
```
Assim como o *navigate* do *router* essa diretiva recebe uma array para montar o endereço de destino.



#### Lazy loading

Conforme o projeto cresce, o tamanho dos arquivos gerados também cresce, podendo ficar bem grandes. O problema disso é que o primeiro carregamento do site fica demorado, e acaba impactando na experiência do usuário.

Mas para resolver isso, podemos implementar o carregamento Lazy loading em módulos, assim os arquivos referentes a este módulo só serão carregados caso necessário, diminuindo o tempo do primeiro carregamento.

Primeiramente, pra um módulo ter um carregamento LazyLoading eme não pode ser importado por nenhum outro módulo e deve possuir seu próprio módulo de rotas.

Esse arquivo de rotas filhos poderá ser configurado como for necessário, a única necessidade é de que ao importar as rotas, não se pode mais utilizar o método *forRouter*, agora ficando ***forChield***.

Exemplo:
```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'registro',
        component: RegistroComponent,
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
```
Importando lembrar de importar esse módulo de roteamento no módulo que ele corresponde.

Agora, nosso arquivo de rota principal irá definir a rota base que apontará para esse módulo em lazy loading.

Ele basicamente define qual a rota e aplica um redirect para ela. E a partir disso, carrega o módulo filho (quando a rota for acessada).

Exemplo:
```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
```
Assim, quando for acessao a rota raiz, e der um *patchMatch* com valor *full* (Como é a rota raiz, qualquer rota daria match com ela, então o *full* agora que será exatamente a rota raiz sem nada mais) ele irá redirecionar para a rota *home*.

E a rota home, por sua vez, carregará um filho (módulo lazy loading) de um jeito um pouco diferente. É passado o caminho do arquivo módulo sem a extensão .ts, no final é adicionado um *#* e em seguida o nome do módulo.

Com isso, o angular já entender que esse módulo é lazy loading e separa em outros arquivos, que só serão carregados caso necessário.

##### providers

Ao utilizar lazy loading, existe um ponto: os **Injectables**. Isso porque quando definimos uma classe com esse decorador, definimos que ela é provida no escopo global (*root*), então mesmo sem esse módulo ter sido carregado, os serviços estarão disponíveis, e para toda a aplicação!

Para contornar isso, posso remove o objeto da declaração do decorator que cria esse escopo. Mas ai essas classes não poderão ser mais injetadas. E existe duas formas de resolver:

- Se essa classe apenas é ultilizada por um único componente, dentro da declaração do componente passamos a um atributo chamado **providers** um array contendo os Injectables que ele precisa.
- Se é utilizada por mais de um componente do módulo, ai declaramos dentro do módulo também no atributo **providers**.

### Resolvers

Ele é executado antes da contrução de um componente de uma rota e disponibiliza arquivos para esse componente.

Útil quando precisamos carregar uma tela que seus dados dependem do resultado de uma requisição. Um resolver poderia realizar a requisição, e quando tiver o resultado com os dados, disponibilizar para o componente e carrega-lo.

Ele é uma classe que possui o decorator **@Injectable** e assim como o serviço deve receber o parametro *providedIn* que geralmente possui o valor *root*.

A classe precisa implementar a interface **Resolve** que é um generic que precisa informar qual o seu retorno. Ela obriga a implementação do método **resolve** que será automaticamente invocado pra resolver a rota. Esse método recebe como parametro um snapshot da rota e um state.

Exemplo de resolver:
```typescript
@Injectable({
    providedIn: 'root'
})
export class MeuResolver implements Resolve<number[]> {

    constructor(private service: PhotoService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const qtd = route.params.quantidade;
        return [ ...Array(qtd).keys().map(n => Math.floor(Math.random() * 100)) ];
    }

}
```
O resolver vai retornar uma array com a quantidade numeros passados na rota.

Para ele funcionar, precisa ser indicado como o resolver da rota, assim sendo executado antes do componente.

Exemplo de declaração de rota:
```typescript
{
    path: 'numeros/:quantidade',
    component: NumerosComponent,
    resolve: {
        numeros: MeuResolver
    }
}
```
A propriedade resolve recebe objetos e seus valores serão Resolvers.

Após resolver, ele irá carregar o componente da rota passando o resultado.

Para acessar esse resultado, precisa acessar a propriedade *data* do snapshot da rota ativa, e dentro dessa propriedade terá outra(s) propriedade(s) que seu nome será o nome informado na propriedade que recebeu o resolver na rota, e seu valor será o resultado do resolver.

Exemplo:
```typescript
export class NumerosComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const numeros = this.activatedRoute.snapshot.data.numeros;
    }
}
```

### Decorators

O Angular possui alguns decorators pré definidos que auxiliam a adicionar ações e caracteristicas de formas mais simplificadas.

#### HostListener

Faz com que um método seja executado sempre que um evento daquele componente for disparado.

Exemplo:
```typescript
@HostListener('click')
logClick() {
    console.log('Clicou!');
}
```

#### ViewChild

Podemos acessar um elemento do DOM e realizar manipulações sobre ele. Pode receber a referência para o elemento, ou a variavel de template.

Exemplo:
```html
<input #textoInput type="text" />
```
```typescript
export class MeuComponent implements OnInit {

    @ViewChild('textoInput') textoInput: ElementRef<HTMLInputElement>;

    ngOnInit(): void {
        this.textoInput.nativeElement.focus();
    }
}
```
Ele nos retorna uma referência para o elemento (Pode receber um generic para especificar o tipo do elemento). E a partir dessa referência podemos acessar o elemento nativo e manipula-lo.

#### Injectable

Define que a classe é injetável em contrutores de classes ou em templates.

Geralmente utilizado em serviços e diretivas.

#### Inject

Auxilia na injeção de um token em uma variável.

A injeção de dependencia geralmente está associada a uma classe, mas nesse caso estamos se referindo a um valor único (stirng, number, etc.) que é fornecido por algum módulo e precisamos injeta-lo em uma classe para utilizado.

Para isso, fazermos a injeção fornecendo esse decorator passando qual valor será injetado. Exemplo:
```typescript
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlatformService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

}
```
Nesse caso estamos injetando um valor textual que o angular fornece que é referente a qual plataforma o usuário está acessando a aplicação.

### Classes

O Angular possui algumas classes que podem (e vão) ajudar...

#### Renderer2 <sub><sub>Fornecido por **CommonModule**.</sub></sub>

Permite a manipulação do DOM independente do local. Como o Angular permite a renderização do lado do servidor, isso pode impedir muitos problemas e trazer códigos universais.

#### HttpClient <sub><sub>Fornecido por **CommonModule**.</sub></sub>

Permite realização requisições http retornando um Observable.

##### post

Realizando uma requisição post:
```typescript
export class MeuService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string) {
    return this.http
      .post('http://localhost/login', {
        userName,
        password
      });
  }

}
```
Nesse caso estamos realizado uma requisição do tipo post a url informada, passado no corpo os parametros fornecidos.

Para resgatar o cabeçalho de resposta, devemos adicionar um novo parametro:
```typescript
export class MeuService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string) {
    return this.http
      .post('http://localhost/login', {
        userName,
        password
      }, { observe: 'response' })
      .pipe(
        tap(res => console.log(res.headers))
      );
  }

}
```
Adicionando o parametro **observe** com o valor *response* poderemos receber o cabeçalho de resposta.

Aproveitando os operados pipe e tap do RxJS, conseguimos pegar a resposta antes de retornar o Observable. Assim temos acesso ao cabeçalho.

#### Router <sub><sub>Fornecido por **RouterModule**.</sub></sub>

Da acesso a manipulação de rota atual. Deve ser injetado.

Com ele, podemos navegar entre rotas. E possui diferentes formas para isso.

**navigateByUrl**
```typescript
export default MeuComponent {

    constructor(
        private router: Router
    ) { }

    navegar() {
        this.router.navigateByUrl(`rota/nova`);
    }
}
```
Permite navegar passando a rota completa de destino. Dependendo do tamanho da rota, pode ficar muito comprido e confuso.

**navigate**
```typescript
export class MeuComponent {

    constructor(
        private router: Router
    ) { }

    navegar() {
        this.router.navigate(['rota', 'nova']);
    }
}
```
Recebe como primeiro parametro uma array contendo cada valor que forma a rota. Eles serão juntados separados por barra.

#### ActivatedRoute <sub><sub>Fornecido por **RouterModule**.</sub></sub>

Permite acesso aos dados da rota atual.

Propriedades interessantes:

**snapshot**
Se refere a uma fotografia atual da rota, e essa fotografia possui informações passados a ela.

```typescript
export class MeuComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        console.log(this.activatedRoute.snapshot.params);
    }

}
```
Apresentaria os parametros passados via rota.

### Modulos

O angular possui alguns módulos que serão comumente utilizados...

#### BrowserModule

Possui diversos arquivos que são necessário pro Angular funcionar, inclusive as diretivar básica (*ngFor*, *ngIf*) e ele deve ser importante uma única vez no projeto, no primeiro módulo **AppModule**.

#### CommonModule

Quando trabalhamos com vários módulos, como faremos pra usar diretivas? Bom, parte dos arquivos, incluindo as diretivas, são exportadas por esse módulo e ele pode ser importado inúmeras vezes.

#### RouterModule

Permite trabalharmos com roteamento dentro da aplicação, criando rotas personalizadas e navegando entre elas programaticamente.

### Forms

O angular possui um recurso chamado **Model Driven Forms** que permite que a validação de um formulário fique do nado do componente, não no template.

Para isso dependemos de acesso ao **ReactiveFormsModule** disponivilizado no módulo que necessita de validações.

Para iniciar, o formulário precisa ser associado a um **FormGroup** que será o responsável por realizar as validações. Para isso basta declarar a variável desse tipo e associa-la ao formulário atraves de data binding:
```typescript
export class MeuFormularioComponent {
    meuFormulario: FormGroup;
}
```
```html
<form [formGroup]="meuFormulario">

</form>
```

Um formulário pode ser grande e com muitas regras, e para nos auxiliar e disposto o **FormBuilder** que deve ser recebido via injeção de dependencia.

Esse builder nor fornece meios de declarar grupos (formulários) e controles (campos do formulário). Um grupo pode possuir inumeros controles. Esses controles recebem uma array que pode conter algumas configurações, como seu valor inicial e validações de seu conteúdo. Cada controlador deve ser associado a um input via data binding:
```typescript
export class MeuFormularioComponent implements OnInit {
    
    meuFormulario: FormGroup;
    
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.meuFormulario = this.formBuilder.group({
            campo1: ['valor aletório'],
            campo2: [123],
        });
    }

}
```
```html
<form [formGroup]="meuFormulario">
    <input formControlName="campo1" type="text" name="campo1" />
    <input formControlName="campo2" type="number" name="campo2" />
</form>
```
Nesse caso o formulário foi declarado possuindo já valores iniciais.

Os grupos e controles possui métodos e propriedades que nos auxiliam e resgatar informações sobre o formulário.

Exemplo acesso um controle dentro do grupo:
```typescript
console.log(meuFormulário.get('campo1'));
```
Através do método *get* de um grupo, conseguimos acessar o controle com o nome informado.

Para checar se um formulário está válido (todas validações passaram) ou inválido, utilizamos as propriedades *valid* e *invalid*. Exemplo:
```typescript
this.meuFormulario = this.formBuilder.group({
    senha: ['']
});

console.log(this.meuFormulario.valid);
console.log(this.meuFormulario.invalid);
```
Esses propriedades também existe em controles.

Para controlar a submissão do doumulário, podemos efetuar um binding de sua propriedade de evento *submit* e atribuir um método para realizar ações. Exemplo:
```typescript
export class MeuFormularioComponent implements OnInit {
    
    meuFormulario: FormGroup;
    
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.meuFormulario = this.formBuilder.group({
            campo1: ['']
        });
    }

    formularioEnviado() {
        console.log('O formulário foi enviado');
        console.log('Valor do campo1', this.meuFormulario.get('campo1').value);
    }

}
```
```html
<form [formGroup]="meuFormulario" (submit)="formularioEnviado()">
    <input formControlName="campo1" type="text" name="campo1" />
</form>
```

Para resgatar todos os valores do formulário, podemos utilizar:
```typescript
const formData = this.meuFormulario.getRawValue();
```

#### Validadores

Existem várias regras de validações que podem ser inseridas. E podemos criar as nossas próprias. Ex:

- **required** - Define que o campo é obrigatório.
- **minLength** - Define um tamanho minimo (apenas texto).
- **maxLength** - Define um tamanho máximo (apenas texto).
- **email** - Se é um e-mail valido
- **pattern** - Checa se passa em uma expressão regular fornecida.

Exemplo de uso de validação:
```typescript
export class MeuFormularioComponent implements OnInit {
    
    meuFormulario: FormGroup;
    
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.meuFormulario = this.formBuilder.group({
            senha: ['', Validators.required]
        });
    
    }
}
```

Podemos criar nosso próprio validador, criando uma função que recebe como parametro um **AbstractControl** que retorna *null* caso não haja erros, e em caso de erros retorna um objeto que possui uma propriedade com o nome do validador e o valor *true*.

Exemplo:
```typescript
import { AbstractControl } from '@angular/forms';

export function parValidator(control: AbstractControl) {

    if (Number.isInteger(control.value) && control.value % 2 !== 0) {
        return null;
    }

    return {
        lowerCase: true
    };
}
```
Valida se o valor digitado é um número par.

O controle pode possuir um atributo chamado *errors* que irá possuir os erros de validação que ele possui, baseado no nome das validação inseridas. Exemplo:
```typescript
this.meuFormulario = this.formBuilder.group({
    senha: ['', Validators.required]
});

console.log(this.meuFormulario.get('senha').errors?.required);
```
O atributo *errors* só existe quando há erros na validação do campo.

#### FormGroup

Podemos limpar todos os dados do formulário:
```typescript
export class MeuFormularioComponent implements OnInit {
    
    meuFormulario: FormGroup;
    
    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.meuFormulario = this.formBuilder.group({
            campo1: ['']
        });
    }

    limpar() {
        this.meuFormulario.reset();
    }

}
```
```html
<form [formGroup]="meuFormulario" (submit)="formularioEnviado()">
    <input formControlName="campo1" type="text" name="campo1" />
</form>
```

#### FormControl

Um controle possui alguns métodos e atributos que pode, e deve, nos auxiliar:

- **value** - Possui o valor digitado no campo.

### Variável de template

Podemos criar uma variável dentro de um template que só existirá dentro dele, e realizamos manipulações nele através dela.

Para criar a variável, dentro da TAG colocamos um quadrado (hashtag, jogo da velha, etc.) e em seguida o nome da variável.

Exemplo, pegando o valor:
```html
<input #nomeInput type="text" />
<p>
    Valor digitado é: {{ nomeInput.value }}
</p>
```

### Interceptor

Podemos utilizar interceptadores em requisições HTTP, tanto na requisição como na resposta.

Isso pode servir para várias coisas, como cache de resultado, padronização de conteudo, adição de cabeçalhos, etc.

O exemplo classico seria de adição do token de validação de usuário autenticado em todas requisições realizadas.

Um interceptor é uma classe com o decorator **Ijectable** que implementa a interface **HttpInterceptor**. A interface por sua vez obrigará que seja implementado o método **intercept** que recebe como parametro um **HttpRequest** e um **HttpHandler**; Ele deve retornar um Observable (afinal, é uma requisição http).

Essa função para funcionar deve retornar a chamado do método **handle** do **HttpHandler** recebido, passando como parametro o **HttpResquest**.

Antes desse retorno, pode ser feito as alterações na requisição.

Exemplo:
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();
    req = req.clone({
      setHeaders: {
        'Content-type': 'application/json',
        'Angular': 'é show'
      }
    });

    return next.handle(req);
  }

}
```
Um detalhe é que é necessário clonar a requisição antes de altera-la, e reatribuir seu novo valor.

Depois disso, para por em funcionamento o interceptor, ele precisa ser adicionado aos *providers* dos módulos onde ele será utilizado.

Exemplo:
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true
  }
]
```
Assim, definimos o tipo de provider, a classe que criamos, e a propriedade multi diz que ter vários interceptors que podem alterar a reuisição.