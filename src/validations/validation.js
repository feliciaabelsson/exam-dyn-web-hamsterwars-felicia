// valideringsfunktion


// function isProperIndex(index, maxIndex) {
// 	return index >= 0 && index < maxIndex
// }


function isHamsterObject(maybe) {
  //om maybe inte är ett objekt
  if (typeof maybe !== "object") {
    return false;
  }
  // får en lista på egenskaperna
  let keys = Object.keys(maybe);
  // om någon av dessa egenskaperna saknas är det inte ett hamster-objekt
  if (
    !keys.includes("name") ||
    !keys.includes("loves") ||
    !keys.includes("games") ||
    !keys.includes("wins") ||
    !keys.includes("age") ||
    !keys.includes("favFood") ||
    !keys.includes("imgName") ||
    !keys.includes("defeats")
  ) {
    return false;
  }
  // om objekt finns med alla egenskaperna
  return true;
}



module.exports = isHamsterObject;
