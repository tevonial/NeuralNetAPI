const Network = require('./network.js');

let target = [
    [0.2738, 0.2234, 0.32],
    [0.1738, 0.1234, 0.22],
    [0.5950, 0.8807, 0.05],
    [.2771,   .6402,    .81]
];

let nets = [
    Network.buildFullyConnectedNetwork(5, 3, 3, 25),
    Network.buildConvolutionalNetwork(5, 5, 5, 3)
];

let iterations = 200;

for (let i = 0; i <= 20; i++) {
    let input = [nets.length];
    input[0] = [20];
    input[1] = [nets[1].dimX * nets[1].dimY];

    for (let j = 0; j < nets.length; j++) {
        // for (let k = 0; k < input[j].length; k++)
        //     input[j][k] = Math.random();

        for (let k = 0; k < 20; k++)
            input[0][k] = Math.random();
        for (let k = 0; k < nets[1].dimX * nets[1].dimY; k++)
            input[j][k] = Math.random();
    }

    console.log("network input: " + + input[1].length + " " + input[1]);

    for (let j = 0; j <= iterations; j++) {
        for (let k = 0; k < nets.length; k++)
            nets[k].process(input[k], target[k], true, (j === iterations) ? k : null);
    }
}
