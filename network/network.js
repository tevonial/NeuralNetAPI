const FullLayer = require('./layer.full.js');
const ConvolutionalLayer = require('./layer.convolutional.js');

class Network {
    constructor() {
        this.layers = this.target = [];
        this.learning_rate = 0.05;
        this.dimX = 28;
        this.dimY = 28
    }

    static buildFullyConnectedNetwork(inputSize, outputSize, hiddenLayers, hiddenSize) {
        let net = new Network();

        net.layers.push(new FullLayer(net, net.layers.length, outputSize, hiddenSize));
        for (let i = 0; i < hiddenLayers; i++)
            net.layers.push(new FullLayer(net, net.layers.length, hiddenSize, inputSize));
        net.layers.push(new FullLayer(net, net.layers.length, inputSize, 1));

        return net;
    }

    static buildConvolutionalNetwork(numFeatures, featureDimX, featureDimY, outputSize) {
        let net = new Network();

        const convolutionalOutputSize = (net.dimX - featureDimX + 1) * (net.dimY - featureDimY + 1) * numFeatures;

        net.layers.push(new FullLayer(net, net.layers.length, outputSize, convolutionalOutputSize));
        net.layers.push(new ConvolutionalLayer(net, net.layers.length, numFeatures, featureDimX, featureDimY));

        return net;
    }

    process(input, target, backprop, set) {
        this.target = target;

        let start = new Date().getTime();
        this.layers[this.layers.length - 1].feedForward(input, backprop);
        let end = new Date().getTime();

        let output = this.layers[0].feedForward(input);
        let error = 0;

        for (let i = 0; i < this.target.length; i++)
            error += this.target[i] - output[i];

        if (set != null) {
            process.stdout.write(set + " --> ");

            for (let i = 0; i < output.length; i++) {
                if (output[i] < 100) process.stdout.write(" ");
                if (output[i] < 10) process.stdout.write(" ");
                if (output[i] >= 0) process.stdout.write(" ");
                process.stdout.write(output[i].toFixed(4));
            }

            if (error < 0) process.stdout.write(" \terror: " + error.toFixed(2));
            else process.stdout.write(" \terror:  " + error.toFixed(2));

            process.stdout.write(" \t" + (end - start).toFixed(2) + " ms\n");
        }

        return output;
    }

    static activate(x) {
        return (1 / ( 1 + Math.exp(-1 * x)));
    }

    static activatePrime(x) {
        return x * (1.0 - x);
    }
}

module.exports = {Network};