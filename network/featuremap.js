const Network = require('./network.js');

module.exports = class FeatureMap {
    constructor(layer, dim) {
        this.dim = dim;
        this.layer = layer;
        this.convolutedDim = layer.convolutedDim;

        this.weights = [];
        for (let i = 0; i <= dim * dim; i++)  //<= for bias
            this.weights.push((Math.random() - Math.random()) / 5.0);
    }

    filter(input) {
        this.out = [];

        for (let y = 0; y < this.convolutedDim; y++) {
            for (let x = 0; x < this.convolutedDim; x++) {
                let activation = 0;

                for (let i = 0; i < Math.pow(this.dim, 2); i++)
                    activation += this.weights[i] * input[(((i / this.dim) + y) * 28) + (i % this.dim + x)];

                activation += this.weights[this.weights.size() - 1];        //bias weight * 1
                this.out.push(this.layer.network.activate(activation));
            }
        }

        return this.out;
    }

    correct(E) {
        for (let a=0; a<this.dim; a++) {
            for (let b = 0; b<=this.dim; b++) {
                let dweight = 0;

                for (let i=0; i<this.convolutedDim; i++) {
                    for (let j=0; j<this.convolutedDim; j++) {

                        let e = E[((i / 2) * (this.convolutedDim / 2)) + j / 2];

                        try {
                            dweight += e * this.layer.network.activatePrime(this.out[(i * this.convolutedDim) + j] * this.layer.input[((i + a) * 28) + (j + b)]);
                        } catch (ex) {
                            dweight += e * this.layer.network.activatePrime(this.out[(i * this.convolutedDim) + j]);
                        }

                    }
                }

                dweight *= -1 * this.layer.network.LEARNING_RATE;
                this.weights[a * this.dim + b] = weights[a * this.dim + b] + dweight;
            }
        }
    }
};