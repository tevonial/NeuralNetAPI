const FeatureMap = require('./featuremap.js');

module.exports = class ConvolutionalLayer {
    constructor(network, layerIndex, numFeatures, featureDimX, featureDimY) {
        this.network = network;
        this.index = layerIndex;
        this.convolutedDimX = this.network.dimX - featureDimX + 1;
        this.convolutedDimY = this.network.dimY - featureDimY + 1;
        this.factorX = this.factorY = 2;

        this.features = [];
        for (let i = 0; i < numFeatures; i++)
            this.features.push(new FeatureMap(i, this, featureDimX, featureDimY));
    }

    feedForward(input, backprop) {
        let output = [];

        this.features.forEach(function (map) {
            output = output.concat(pool(map.filter(input)));
        });

        this.network.layers[this.index - 1].feedForward(output, backprop);
    }

    backPropagate(E) {
        for (let f = 0; f < this.features.length; f++) {
            let convolutedSize = (this.convolutedDimX * this.convolutedDimY) / (this.factorX * this.factorY);
            let index = f * convolutedSize;

            this.features[f].correct(E.slice(index, index + convolutedSize));
         }
    }
};

function pool(input) {
    let out = [];
    let poolDimX = (this.convolutedDimX - this.factorX) / this.factorX;
    let poolDimY = (this.convolutedDimY - this.factorY) / this.factorY;

    for (let y = 0; y < poolDimY; y += this.factorY) {
        for (let x = 0; x < poolDimX; x += this.factorX) {
            let max = 0;

            for (let y2 = 0; y2 < this.factorY; y2++)
                for (let x2 = 0; x2 < this.factorX; y2++) {
                    max = Math.max(max, input[(y + y2) * this.convolutedDimX + x + x2]);
                    out.push(max);
                }
        }
    }

    return out;
}