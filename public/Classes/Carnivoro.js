class Carnivoro extends Organismo{
    static carnivoros = [];
   
    constructor(x, y, raio_min, vel_max, forca_max, cor, raio_deteccao_min, energia_max, cansaco_max, taxa_aum_cansaco, tempo_vida_min, tempo_vida_max){
        super(x, y, raio_min, vel_max, forca_max, cor, raio_deteccao_min, energia_max, cansaco_max, taxa_aum_cansaco, tempo_vida_min, tempo_vida_max); // referenciando o construtor da classe mãe
        
        // variável para contar quando um carnívoro poderá se reproduzir
        this.contagem_pra_reproducao = 0;
        
        // this.taxa_gasto_energia = (Math.pow(this.raio, 2) * Math.pow(this.vel.mag(), 2)) / 1000;

        Carnivoro.carnivoros.push(this);
        // console.log("C - vel máx: "+parseFloat(this.vel_max.toFixed(4))+" | raio_min: "+parseFloat(this.raio_min.toFixed(4))+" | força máx: "+parseFloat(this.forca_max.toFixed(4))+" | raio detecção: "+parseFloat(this.raio_deteccao.toFixed(4))
        // + " | vida: " + this.tempo_vida.real);
    }
    // Método de reprodução (com mutações)
    reproduzir(){
        var filho = this._reproduzir();

        return new Carnivoro(
            this.posicao.x, this.posicao.y, filho.raio_min, filho.vel_max, filho.forca_max, 
            filho.cor, filho.raio_deteccao_min, filho.energia_max, filho.cansaco_max, filho.taxa_aum_cansaco,
            filho.tempo_vida_min, filho.tempo_vida_max
        );
        
    }

    morre(){
        if(typeof this.cronometro_morte !== 'undefined') {
            clearTimeout(this.cronometro_morte); // desativar o temporizador
        }
        
        Carnivoro.carnivoros = super.remove(Carnivoro.carnivoros, this);
    }

    buscarHerbivoro(lista_herbivoros){
        this.comendo = false;
        // Var recorde: qual a menor distância (a recorde) de um herbivoro até agora
        var recorde = Infinity; // Inicialmente, setaremos essa distância como sendo infinita
        var i_mais_perto = -1; // Qual o índice na lista de herbivoros do herbivoro mais perto até agora

        // Loop que analisa cada herbivoro na lista de herbivoros
        for(var i = lista_herbivoros.length - 1; i >= 0; i--){
            // Distância d entre este organismo e o atual herbivoro sendo analisado na lista (lista_herbivoros[i])
            // var d = this.posicao.dist(lista_herbivoros[i].posicao);

            var d2 = Math.pow(this.posicao.x - lista_herbivoros[i].posicao.x, 2) + Math.pow(this.posicao.y - lista_herbivoros[i].posicao.y, 2);
            
            // Somente atualizará as variáveis se houver um herbivoro dentro do raio de detecção e o
            // tamanho do herbívoro(raio) for menor que o carnívoro + 75% do seu tamanho.
            if(d2 < Math.pow(this.raio_deteccao, 2) && lista_herbivoros[i].raio < this.raio * 1.75){
                if (d2 <= recorde){ // Caso a distância seja menor que a distância recorde,
                    recorde = d2; // recorde passa a ter o valor de d
                    i_mais_perto = i; // e o atual alimento passa a ser o i_mais_perto 
                }
            }
        }
        // Momento em que ele vai comer!
        if(recorde <= Math.pow(this.raio_deteccao, 2)){
            this.comendo = true;
            if(recorde <= 5){
                this.comeHerbivoro(lista_herbivoros, i_mais_perto);

                ///////////////////////////////////////////////////////////////////////////////
                this.contagem_pra_reproducao++;

                if(this.contagem_pra_reproducao == 3){ // se o carnívoro comer 4 herbívoros e já tiver vivido o suficiente
                    if(Math.random() < this.chance_de_reproducao ){ // chance de se reproduzir
                        this.reproduzir();
                    }
                    this.contagem_pra_reproducao = 0; // reseta a variável para que possa se reproduzir outras vezes
                }
                ///////////////////////////////////////////////////////////////////////////////
                
            } else if(lista_herbivoros.length != 0){
                this.persegue(lista_herbivoros[i_mais_perto]);
            }
        }
    }
    
    comeHerbivoro(herbivoro, i){
        // Absorção de energia ao comer o herbívoro
        // Se a energia que ele adquirá do herbívoro (10% da energia total do herbívoro)
        // for menor que o quanto falta para encher a barra de energia, ela será somada integralmente (os 10%)
        if(this.energia_max - this.energia >= herbivoro.energia_max * 0.1){
            this.energia += herbivoro.energia_max * 0.1; // O carnívoro, ao comer o herbívoro, ganha 10% da energia deste
        } else{
            this.energia = this.energia_max; // Limitanto a energia para não ultrapassar sua energia máxima
        }

        Herbivoro.herbivoros.splice(i, 1); // O herbívoro comido morre (é retirado da lista de herbívoros)
        this.aumentaTamanho();
        
    }
    aumentaTamanho(){
        if(this.raio<(this.raio_min*1.5)){
            this.raio += 0.03*this.raio;
            this.raio_deteccao += 0.02*this.raio_deteccao;
        }
       
    }
}