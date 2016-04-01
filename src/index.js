
const {clazz, getter, setter, alias, lens, modify} = require('persistent-clazz')

const limit = (min, val, max) => val < min ? min : (val > max ? max : val)

const newArrayWithSize = (size) => {
  this.standard = this.standard||[];
  for (var add = size-this.standard.length; add>0; add--) {
   this.standard.push(undefined)
  }
  return this.standard.slice(0,size);
}

module.exports = clazz({
  constructor (value) {
    return {value}
  },
  empty (bounds) {
    bounds = bounds || this.bounds()
    const [x, y] = bounds
    return this.setValue( newArrayWithSize(y).map(()=> newArrayWithSize(x).map(()=>undefined))).setOffset([0,0])
  },
  toJS() {
    return this.value
  },
  setValue: setter('value'),
  slice ({x:[widthFrom, heightFrom], y: [widthTo, heightTo]}){
    const value = this.value.slice(heightFrom, heightTo + 1)
      .map((row) => row.slice(widthFrom, widthTo + 1))
    return this.setValue(value)
  },
  clone () {
    return this.setValue(this.value.slice(0).map((row) => row.slice(0)))
  },
  neighbours ([x,y], range) {
    const bounds = this.bounds()
    const [boundX, boundY] = bounds
    const offsetX = (x < range ? range - (range - x): range)
    const offsetY = (y < range ? range - (range - y): range)

    const inBounds = ([boundX, boundY], [x, y]) => {
      return [limit(0, x, boundX), limit(0, y, boundY)]
    }
    return this.slice({x: inBounds(bounds, [x - range, y - range]), y: inBounds(bounds, [x + range, y + range])})
      .setOffset([offsetX, offsetY])
  },
  offset: [0, 0],
  setOffset: setter('offset'),
  get (coordinates) {
    const [x, y] = this.addOffset(coordinates)
    return this.value[y][x]
  },
  put ([x, y], value) {
    this.value[y][x] = value 
    return this
  },
  set (coordinates, value) {
    return this.clone().put(coordinates, value)
  },
  reduce (f, id) {
    const value = this.value.reduce((obj, row, y) => {
        row.forEach((element, x) => {
          obj = f(obj, element, this.removeOffset([x, y]))
        })
        return obj
    }, id) 
    return value
  },
  map (f) {
    return this.reduce((matrix, value, coordinates) => matrix.put(coordinates, f(value, coordinates)), this.empty())
  },
  bounds() {
    return [this.value[0].length, this.value.length]
  },
  removeOffset ([x, y]) {
    const [offsetX, offsetY] = this.offset
    return [(x - offsetX), (y - offsetY)]
  },
  addOffset ([x, y]) {
    const [offsetX, offsetY] = this.offset
    return [(x + offsetX), (y + offsetY)]
  }
})

