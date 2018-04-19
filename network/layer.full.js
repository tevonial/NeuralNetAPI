const Neuron = require('./neuron.js');

module.exports = class FullLayer {
    constructor(network, index, size, numInputs) {
        this.network = network;
        this.index = index;
        this.neurons = [];

        for (let i=0; i<size; i++)
           this.neurons.push(new Neuron(network, i, numInputs));
    }

    feedForward(input, backprop) {
        this.output = [];
        for (let i = 0; i < this.neurons.length; i++)
            this.output.push(this.neurons[i].filter(input));

        if (this.index > 0)
            this.network.layers[this.index - 1].feedForward(this.output, backprop);
        else
            if (backprop) this.backPropagate([]);

        // console.log("layer input: " + input);
        // console.log("layer output: " + this.output);
        return this.output;
    }

    backPropagate(E) {
        let w = [];
        let d = [];

        for (let i = 0; i < this.neurons.length; i++) {
            let n = this.neurons[i];

            if (this.index === 0)
                n.correct(this.output[i] - this.network.target[i]);
            else
                n.correct(E[i]);

            d.push(n.delta);
            w.push(n.weights);
        }

        //Calculate error for previous layer, no need to rotate
        let error = [];
        for (let i = 0; i < w[0].length; i++) {
            let e = 0;
            for (let j = 0; j < d.length; j++)
                e += d[j] * w[j][i];

            error.push(e);
        }

        if (this.index === this.network.layers.length)
            this.network.layer[this.index + 1].backPropagate(error);
    }
};