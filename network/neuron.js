const Network = require('./network.js');

module.exports = class Neuron {
    constructor(network, index, numInputs) {
        this.network = network;
        this.index = index;
        this.numInputs = numInputs;
        this.weights = [];
        this.delta = 0;

        for (let i = 0; i <= numInputs; i++)  // <= for bias
            this.weights.push(Math.random() - Math.random());
    }

    filter(input) {
        let activation = 0;

        if (this.numInputs === 1) {                         // For input layer
            this.input = [];
            this.input.push(input[this.index]);
        } else {                                            // For all other layers
            this.input = input;
        }

        for (let i = 0; i < this.input.length; i++)
            activation += this.weights[i] * this.input[i];

        activation += this.weights[this.weights.length - 1];        // bias weight * 1
        this.o = Network.activate(activation);
        
        console.log("activation: ", activation);
        console.log("weights.length = " + this.weights.length);
        console.log("input.length = " + this.input.length);
        console.log("this.o = " + this.o);
        
        return this.o;
    }

    correct(E) {
        this.delta = E * Network.activatePrime(this.o);
        let delta = this.delta * this.network.learning_rate * -1;

        for (let i = 0; i < this.weights.length; i++)
            this.weights[i] = this.weights[i] + delta;
    }
};