const Neuron = require('./neuron.js');

module.exports = class FullLayer {
    constructor(network, layerIndex, size, numInputs) {
        this.network = network;
        this.layerIndex = layerIndex;
        this.neurons = [];
        for (let i=0; i<size; i++)
           this.neurons.push(new Neuron(network, i, numInputs));
    }

    feedForward(input, backprop) {
        this.output = [];
        for (let i=0; i<this.neurons.length; i++)
            this.output.push(this.neurons[i].getOutput(input));

        try {
            this.network.getLayer(this.layerIndex - 1).feedForward(this.output, backprop);
        } catch (e) {
            if (backprop) this.backPropagate(null);
        }
    }

    backPropagate(E) {
        let w = [];
        let d = [];

        for (let i=0; i<this.neurons.length; i++) {
            let n = this.neurons[i];

            if (this.layerIndex === 0)
                n.correct(this.output[i] - this.network.getTarget(i));
            else
                n.correct(this.E[i]);

            d.add(n.getDelta());
            w.add(n.getWeights());
        }

        //Calculate error for previous layer, no need to rotate
        E = [];
        for (let i=0; i<w.get(0).length; i++) {
            let e = 0.0;
            for (let j=0; j<d.length; j++) {
                e += d.get(j) * w.get(j).get(i);
            }
            E.push(e);
        }

        try {
            this.network.getLayer(this.layerIndex + 1).backPropagate(E);
        } catch (e) {
            console.log(e);
        }
    }

    getOutput() {
        return this.output;
    }
};