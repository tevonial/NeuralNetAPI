const FullLayer = require('./layer.full.js');
const ConvolutionalLayer = require('./layer.convolutional.js');

module.exports = class Network {
    constructor() {
        this.layers = this.target = [];
        this.learning_rate = 0.01;
        this.dim = 28;
    }

    static buildFullyConnectedNetwork(inputSize, outputSize, hiddenLayers, hiddenSize) {
        const net = new Network();

        net.layers.push(new FullLayer(net, 0, outputSize, hiddenSize));
        for(let i=0; i<hiddenLayers; i++)
            net.layers.push(new FullLayer(net, net.layers.length, inputSize, 1));
        net.layers.push(new FullLayer(net, net.layers.length, inputSize, 1));

        return net;
    }

    static buildConvolutionalNetwork(numFeatures, featureDim, outputSize) {
        const net = new Network();

        const convolutionalOutputSize = Math.pow((net.dim - featureDim + 1), 2) * numFeatures;

        net.layers.push(new FullLayer(net, net.layers.length, outputSize, convolutionalOutputSize));
        net.layers.push(new ConvolutionalLayer(net, net.layers.length, numFeatures, featureDim));

        return net;
    }

    getLayer(index) {
        if (index === -1 || index >= this.layers.length)
            return null;
        else
            return this.layers[index];
    }

    getTarget(index) {
        return this.target[index];
    }

    process(input, target, backprop, digit) {
        this.target = target;
        this.layers[this.layers.length-1].feedForward(input, backprop);

        const output = this.layers[0].getOutput();

        if (digit != null) {
            console.log(set + " --> ");
            output.forEach(function (o) {
                console.log(o.toFixed(2) * 100.0 + ' ');
            });
        }

        return output;
    }

    activate(x) {
        return (1 / ( 1 + Math.exp(-1 * x)));                   //SIGMOID
        //return Math.log(1 + Math.exp(x));                     //ReLU

        /*if (x <= 0) {                                         //Leaky ReLU
            return x * 0.01;
        } else {
            return x;
        }*/
    }

    activatePrime(x) {
        return x * (1.0 - x);                                  //SIGMOID
        //return  1.0 / (1.0 + Math.exp(-1 * x));              //ReLU

        /*if (x <= 0) {                                        //Leaky ReLU
            return  0.01;
        } else {
            return 1;
        }*/
    }
};