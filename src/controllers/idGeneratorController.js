const random = require('random');

let randomIdNumber = random.int(0, 9) + '' + random.int(0, 9) + '' + random.int(0, 9);

function idGeneratorController(name, userID = randomIdNumber) {
    let nameSeparated = name.split(".");
    let _Id = 'BSOL' + userID + (nameSeparated[0][0] + nameSeparated[1][0]).toUpperCase();

    return _Id;
};

module.exports = idGeneratorController;