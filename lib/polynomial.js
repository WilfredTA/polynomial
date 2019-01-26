

var strip = function(list, exclude) {

  var newList = []

  for (var i = 0; i < list.length; i++) {
    if (list[i] !== exclude){
      newList.push(list[i])
    }
  }
  return newList;
}

var createBody = function(polynomial) {
  var body = '';

  if (!polynomial.coefficients.length) {
   body += '0';
  }

  for (var i = 0; i < polynomial.coefficients.length; i++){
    if (i > 1) {
      body += `${polynomial.coefficients[i]} x^${i}`
    } else if (i == 1) {
      body += `${polynomial.coefficients[i]} x`
    } else {
      body += `${polynomial.coefficients[i]}`
    }

    if (i !== polynomial.coefficients.length - 1) {
      body += ' + ';
    }

  }
  return body;
}

var allElementsUnique = function(list) {

  var seen = {};

  for (var i = 0; i < list.length; i++) {

    if (seen[list[i]]) {
      return false;
    }
    seen[list[i]] = true;
  }
  return true;
}


  // Returns array of terms representing the polynomial

  // For each point, generate a term and add term to polynomial
    // To generate a term:
    // Set targetTerm equal to identity polynomial
    // For each j in points that does not equal i,
    // Construct a polynomial such that f(x) = [(x-xj)/(xi-xj)]
    // Set targetTerm = targetTerm * above Polynomial


var singleTerm = function(points, i) {
  var currTerm = new Polynomial([1.0]);
  var xi = points[i][0];
  var yi = points[i][1];
  var xj;

  for (j = 0; j < points.length; j++) {
    if (j != i) {
      xj = points[j][0];
      var coeffOne = (-xj / (xi - xj));
      var coeffTwo = (1.0 / (xi - xj))
      currTerm = currTerm.mult(new Polynomial([coeffOne, coeffTwo]))
    }
  }
  return currTerm.mult(new Polynomial([yi]));
}


var sumPolynomials = function(polynomials, defaultValue) {
  for (var i = 0; i < polynomials.length; i++) {
    defaultValue = defaultValue.add(polynomials[i])
  }
  return defaultValue;
}
function Polynomial(coefficients) {
    this.coefficients = strip(coefficients, 0)
    this.indeterminate = 'x';
}

Polynomial.prototype.show = function() {
  var preface = 'f(' + this.indeterminate + ') = '
  var body = createBody(this);
  console.log(preface + body)
}

Polynomial.prototype.negate = function() {
  this.coefficients = this.coefficients.map(function(coeff){
    return coeff * -1;
  })
}

Polynomial.prototype.add = function(polynomial) {
  // For each coefficient at i, add the two together
  var indexOne = 0;
  var indexTwo = 0;
  var newCoefficients = [];
  var shortest = (this.coefficients.length < polynomial.coefficients.length) ? this : polynomial


  while (indexOne < shortest.coefficients.length && indexTwo < shortest.coefficients.length) {
    newCoefficients.push(this.coefficients[indexOne] + polynomial.coefficients[indexTwo]);
    indexOne++;
    indexTwo++;
  }


  if (shortest === this) {
    while (indexTwo < polynomial.coefficients.length) {
      newCoefficients.push(polynomial.coefficients[indexTwo]);
      indexTwo++;
    }
  } else if (shortest === polynomial) {
    while (indexOne < this.coefficients.length) {
      newCoefficients.push(this.coefficients[indexOne]);
      indexOne++;
    }
  }
  //console.log(newCoefficients)
  return new Polynomial(newCoefficients);
}

Polynomial.prototype.length = function() {
  return this.coefficients.length;
}
Polynomial.prototype.mult = function(polynomial) {
  // For each coefficient at i, add the two together

  var newCoefficients = new Array(this.length() + polynomial.length() - 1).fill(0)

  for (var i = 0; i < this.length(); i++) {
    for (var j = 0; j < polynomial.length(); j++) {
      newCoefficients[i+j] += this.coefficients[i] * polynomial.coefficients[j]
    }
  }


  return new Polynomial(newCoefficients);

}

Polynomial._xValues = function(points) {
  var vals = [];

  for (var i = 0; i < points.length; i++) {
    vals.push(points[i][0]);
  }
  return vals;
}

Polynomial.interpolate = function(points) {
  // return unique degree n polynomial passing through given n + 1 points
  var xValues = this._xValues(points);
  var terms = [];


  if (points.length === 0) {
    throw new Error("Must provide at least one point")
  }

  if (!allElementsUnique(xValues)) {
    throw new Error("All x values must be unique")
  }

  for (var i = 0; i < points.length; i++) {
    var temp = singleTerm(points, i);
    console.log("TERM ", i, " ", temp)
    terms.push(temp)
  }

  return sumPolynomials(terms, new Polynomial([]))

}

// Examples
/*
var poly = new Polynomial([1,2])
poly.show() // f(x) = 1 + 2x

var poly2 = new Polynomial([3,4,5])
poly2.show() // f(x) = 3 + 4x + 5x^2

var sum = poly.add(poly2);
sum.show() // f(x) = 4 + 6x + 5x^2

var product = poly.mult(poly2);
console.log('product')
product.show(); // f(x) = 3 + 10 x + 13 x^2 + 10 x^3
*/
//var ZERO = new Polynomial([])


//Polynomial.interpolate([[1,2], [3,4]]).show()
exports.default = Polynomial;
