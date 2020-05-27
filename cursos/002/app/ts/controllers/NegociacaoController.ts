import { Negociacao, Negociacoes } from "../models/index";
import { NegociacoesView, MensagemView } from "../views/index";
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoService } from '../services/index';
import { imprime } from '../helpers/index';

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');

    private _negociacaoService = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle()
    adiciona(): void {
        const data = new Date(this._inputData.val().replace(/-/g, ','));

        if (!this.ehDiaUtil(data)) {
            this._mensagemView.update('Negociações apenas podem ser realizas em dias uteis!');
            return;
        }
    
        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        this._negociacoes.adiciona(negociacao);
        imprime(negociacao, this._negociacoes);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adiciona com sucesso!');
    }

    private ehDiaUtil(data: Date) : boolean {
        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }

    @throttle()
    async importaDadados() {
        try {
            const negociacoes = await this._negociacaoService
            .obterNegociacoes(res => {
                if (res.ok)
                    return res.json();

                throw new Error(res.statusText);
            });
                
            const negociacoesExistentes = this._negociacoes.paraArray();

            negociacoes.filter(negociacao =>
                !negociacoesExistentes.some(existente =>
                    negociacao.ehIgual(existente)))
                .forEach(negociacao =>
                    this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);0
        } catch (err) {
            this._mensagemView.update(err.message);
        }
    }

}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}