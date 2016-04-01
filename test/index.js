const Matrix = require('../src/index')

const data = [[1, 2, 3, 4],
              [5, 6, 7, 8],
              [9, 10,11,12]]

const matrix = Matrix(data)

exports.put = (test) => {
  const arr = matrix.clone()
    .put({coordinates:[0,1], value: 'foo'})
    .put({coordinates:[1,1], value: 'bar'})

  test.equal(arr.get([0,1]), 'foo')
  test.equal(arr.get([1,1]), 'bar')
  test.done()
}
exports.map = (test) => {
  debugger
  test.deepEqual(matrix.map(a=>1).toJS(), [[1,1,1,1],[1,1,1,1],[1,1,1,1]])
  test.deepEqual(matrix.map(a=>a).toJS(), data)
  test.done()
}
exports.reduce = (test) => {
  const coordinates = matrix.reduce((env, value, coordinates)=> env.put({coordinates, value:coordinates}), matrix.clone())
  test.deepEqual(coordinates.get([0,1]), [0,1])
  test.done()
}

exports.slice = (test) => {
  test.equal(matrix.get([3,0]), 4)
  test.deepEqual(matrix.slice({x: [0, 0], y: [3, 0]}).toJS(), [[1, 2, 3, 4]])
  test.deepEqual(matrix.slice({x: [0, 0], y: [1, 1]}).toJS(), [[1, 2], [5, 6]])
  test.done()
}


exports.neighbours = (test) => {
  const view = matrix.neighbours([1, 1], 1).toJS()
  test.deepEqual(view, [[1, 2, 3], [5,6,7], [9, 10, 11]])
  
  const newView = matrix.neighbours([2, 1], 1).toJS()
  test.equal(matrix.get([2,1]), 7)
  test.deepEqual(newView, [[ 2, 3, 4], [6,7,8], [10,11,12]])

  const edgeView = matrix.neighbours([0, 0], 1).toJS()
  test.deepEqual(edgeView, [ [1, 2], [5,6] ])

  const rightEdgeView = matrix.neighbours([3, 0], 1).toJS()
  test.deepEqual(rightEdgeView, [ [3, 4], [7,8] ])

  test.deepEqual(matrix.neighbours([0, 0], 3).toJS(), data)

  test.done()
}

exports.range = (test) =>  {
  test.deepEqual( matrix.neighbours([0,0], 10).toJS(), data)
  test.deepEqual( matrix.neighbours([2,2], 10).toJS(), data)
  test.done()
}

exports.checkOffset = (test) => {
  const checkOffset = (coordinates) => {
    test.equal(matrix.neighbours(coordinates, 1).get([0,0]), matrix.get(coordinates))
  }
  checkOffset([1,1])
  checkOffset([2,0])
  checkOffset([3,0])
  checkOffset([3,1])
  checkOffset([4,0])
  checkOffset([0,2])
  checkOffset([4,1])
  test.done()
}

const six = matrix.neighbours([1,1], 10)
exports.get = (test) => {
  test.equal(six.get([0, -1]), 2)
  test.equal(six.get([1, 0]), 7)
  test.equal(six.get([2, 0]), 8)
  test.equal(six.get([3, 0]), undefined)
  test.done()
}
