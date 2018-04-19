const Network = require('./network.js');

module.exports = class FeatureMap {
    constructor(layer, network, dimX, dimY) {
        this.dimX = dimX;
        this.dimY = dimY;
        this.layer = layer;
        this.network = network;
        this.weights = [];
        this.delta = 0;

        for (let i = 0; i <= dimX * dimY; i++)  //<= for bias
            this.weights.push(Math.random() / 5.0);
    }

    filter(input) {
        this.o = [];

        for (let y = 0; y < this.layer.convolutedDimY; y++) {
            for (let x = 0; x < this.layer.convolutedDimX; x++) {
                let activation = 0;

                for (let i = 0; i < this.dimX * this.dimY; i++)
                    activation += this.weights[i] * input[i];

                activation += this.weights[this.weights.length - 1];        //bias weight * 1
                this.o.push(Network.activate(activation));
            }
        }

        return this.o;
    }

    correct(E) {
        for (let y = 0; y < this.dimY; y++) {
            for (let x = 0; x <= this.dimX; x++) {
                let d = 0;

                for (let i = 0; i < this.o.length / this.dimY; i++) {
                    for (let j = 0; j < this.o.length % this.dimX; j++) {
                        let e = E[((i / this.layer.factorY) * (this.dimY / this.layer.factorY)) + j / this.layer.factorX];

                        if (this.layer.index === this.layer.network.layers.size())
                            d += e * Network.activatePrime(this.o[((y + i) * this.layer.convolutedDimX) + x + j] * this.layer.input[((y + i) * this.layer.convolutedDimX) + x + j]);
                        else
                            d += e * Network.activatePrime(this.o[((y + i) * this.layer.convolutedDimX) + x + j]);
                    }
                }

                d *= this.layer.network.learning_rate * -1;
                this.weights[y * this.dimX + x] = this.weights[y * this.dimX + x] + d;
            }
        }
    }
};