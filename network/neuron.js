const Network = require('./network.js');


module.exports = class Neuron {
    constructor(network, index, numInputs) {
        this.network = network;
        this.index = index;
        this.numInputs = numInputs;
        this.weights = [];

        for (let i=0; i<=numInputs; i++)  // <= for bias
            this.weights.push(Math.random() - Math.random());
    }



    getOutput(inputs) {
        let activation = 0;

        if (this.numInputs === 1) {                         // For input layer
            this.input = [];
            this.input.push(inputs[this.index]);
        } else {                                            // For all other layers
            this.input = inputs;
        }

        for (let i=0; i<this.input.length; i++) {
            try {
                activation += this.weights[i] * input[i];
            } catch (e) {
                console.log("weights.length=" + this.weights.length + "\tinput.length=" + this.input.length);
            }
        }

        activation += this.weights[this.weights.length - 1];        // bias weight * 1
        this.o = this.network.activate(activation);

        return this.o;
    }

    correct(E) {
        this.d = E * this.network.activatePrime(this.o);

        // FINAL DELTA
        let delta = this.d * (-1) * this.network.learning_rate;

        for (let i=0; i<this.weights.length; i++) {
            let deltaWeight = delta;
            try {
                deltaWeight *= input[i];
            } catch (e) {}

            this.weights[i] = this.weights[i] + deltaWeight;
        }
    }

    getWeights() {
        return this.weights;
    }

    getDelta() {
        return this.d;
    }
};