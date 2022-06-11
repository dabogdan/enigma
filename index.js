const alphabet = ["A", "B", "C", "D", 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const listOfPunctuationMarks = [" ", "!", "?", "-", ",", "+", ";", ":", "(", ")"];
//rotors random but hardcoded arrays
const rotorCyphers = [
    ["E", "K", "M", "F", "L", "G", "D", "Q", "V", "Z", "N", "T", "O", "W", "Y", "H", "X", "U", "S", "P", "A", "I", "B", "R", "C", "J"],
    ["A", "J", "D", "K", "S", "I", "R", "U", "X", "B", "L", "H", "W", "T", "M", "C", "Q", "G", "Z", "N", "P", "Y", "F", "V", "O", "E"],
    ["B", "D", "F", "H", "J", "L", "C", "P", "R", "T", "X", "V", "Z", "N", "Y", "E", "I", "W", "G", "A", "K", "M", "U", "S", "Q", "O"]
]
const reflector = ["Y", "R", "U", "H", "Q", "S", "L", "D", "P", "X", "N", "G", "O", "K", "M", "I", "E", "B", "F", "Z", "C", "W", "V", "J", "A", "T"];
let punctuation = [];
//variable to store array of rotors, make it global
let arrayOfRotors = [];
let encrypted = [];


//object for every rotor, with its own properties and methods
class Rotor {
    constructor(offset, valuesArr) {
        let self = this;
        //this property gives us the length from 1 to ..., rather than from 0 to ...
        this.length = alphabet.length;
        //initial position of the wheel. By default we take length modulo of the offset input, but we transform
        // it to fit to the length of the wheel, if user puts 0, exceeds the length or choose length.
        this.offset =
            offset === 0 && 1 ||
            offset % this.length === 0 && this.length ||
            offset % this.length;
        //random letter values on the rotor
        this.values = valuesArr;
    }
}

//storing punctuation
class PunctuationMark {
    constructor(mark, index) {
        this.mark = mark;
        this.index = index;
    }
}

function encrypt(offset1, offset2, offset3, str) {
    //1. function to make an array of a string, and store all punctuation in a separate array of ojbects
    const string = [...str.toUpperCase()].filter((e, i) => removeAndStorePunctuation(e, i));

    //2. Make an array of objects of rotors. Now each object in the array has its own offset and values.
    [offset1, offset2, offset3].forEach((e, i) => arrayOfRotors.push(new Rotor(e, rotorCyphers[i])));

    //3. main permutation logic
    for (const letter of string) {
        //set index initially to the letter index
        let index = alphabet.indexOf(letter);

        // 3.1. traverse the rotors and encode the letters TOWARDS reflector
        const permuteToReflector = permute(arrayOfRotors, index);
        // 3.2. get letter by index on reflector
        let permuteWithReflector = reflector[permuteToReflector];
        //copy array of rotors
        let sliced = arrayOfRotors.slice();
        // 3.3 traverse the wheels in the reverse order and encode letters FROM reflector
        let permuteFromReflector = permuteReverse(sliced.reverse(), permuteWithReflector.toString())

        //3.4. store the result letter in an array
        encrypted.push(permuteFromReflector);

        //3.5. make one move of the wheel. Initial index set to 0, because we always move
        // wheel No1 (which is 0 in the arrayOfRotors)
        tick(arrayOfRotors, 0);
    }
    console.log(encrypted)
    return encrypted;
}

function permute(arrayOfRotors, index) {
    // let result;
    this.index = index;
    //traverse through the rotors
    for (let rotor of arrayOfRotors) {
        // obtain changed letter on each iteration.
        //add the offset of the wheel to the index and take a modulo,
        // - 1 because array begins with 0, while rotor offset with 1
        let rotorPosition = rotor.offset - 1;
        let modulo = (this.index + rotorPosition) % 26;
        let result = rotor.values[modulo];
        // set index to the result letter index in the alphabet
        this.index = alphabet.indexOf(result);

    }
    return this.index;
}

function permuteReverse(arrayOfRotors, letter) {
    this.letter = letter;
    //traverse through the rotors
    for (let rotor of arrayOfRotors) {
        // obtain changed letter on each iteration.
        // subtract the offset from the wheel index,
        // rotor position - 1 because array begins with 0, while rotor offset with 1
        let index = rotor.values.indexOf(this.letter)
        let rotorPosition = rotor.offset - 1;
        let result = (index - rotorPosition);
        //make sure it is not negative
        if (result < 0) {
            result += 26
        }
        // set letter to the alphabet index of the result
        this.letter = alphabet[result];
    }
    return this.letter;
}

// Logic for the wheels' tick. Recursion for each next wheel is used instead of the loop
// to save machine resources: Recursion happens only when the wheel makes the full round,
// whereas loops would make iterations through all of the wheels array each time regardless.
function tick(arrayOfRotors, i) {
    if (arrayOfRotors[i].offset % arrayOfRotors[i].length === 0) {
        arrayOfRotors[i].offset = 1;
        return tick(arrayOfRotors, i + 1);
    } else {
        arrayOfRotors[i].offset++;
    }
    return arrayOfRotors[i].offset;
}

function removeAndStorePunctuation(letter, index) {
    if (listOfPunctuationMarks.includes(letter)) {
        punctuation.push(new PunctuationMark(letter, index));
        return false;
    } else {
        return true;
    }
}

encrypt(28, 26, 1, "mziat");