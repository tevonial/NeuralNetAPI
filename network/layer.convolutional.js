const FeatureMap = require('./featuremap.js');

module.exports = class ConvolutionalLayer {
    constructor(network, layerIndex, numFeatures, featureDim) {
        this.network = network;
        this.layerIndex = layerIndex;
        this.convolutedDim = this.network.dim - featureDim + 1;

        this.features = [];
        for (let i=0; i<numFeatures; i++)
            this.features.push(new FeatureMap(this, featureDim));
    }

    feedForward(input, backprop) {
        let output = {};

        this.features.forEach(function (map) {
            output = output.concat(pool(map.filter(input)));
        });

        this.network.getLayer(this.layerIndex - 1).feedForward(output, backprop);
    }

    backPropagate(E) {
        for (let f=0; f<this.features.length; f++) {
            let convolutedSize = Math.pow(this.convolutedDim, 2) / 4;
            let index = f * convolutedSize;

            this.features[f].correct(E.slice(index, index + convolutedSize));
         }
    }
}

function pool(input) {
    let out = {};

    for (let y = 0; y < this.convolutedDim-2; y+=2) {
        for (let x = 0; x < this.convolutedDim-2; x+=2) {
            let o = Math.max(
                input[(y*this.convolutedDim + x)], Math.max(
                    input[(y*this.convolutedDim + x + 1)], Math.max(
                        input[(y+1)*this.convolutedDim + x], input[(y+1)*this.convolutedDim + x + 1]
                    )));

            out.add(o);
        }
    }

    return out;
};