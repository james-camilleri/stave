export const double = (x: number, i: number) => x * Math.pow(2, i)

export const triple = (x: number, i: number) => x * Math.pow(3, i)

export const quadruple = (x: number, i: number) => x * Math.pow(4, i)

export const quintuple = (x: number, i: number) => x * Math.pow(5, i)

export const exponential = (x: number, i: number) => Math.pow(x, i + 1)

export const fibonacci = (x: number, i: number) => {
  let a = 1
  let b = 0

  while (i >= 0) {
    const temp = a
    a = a + b
    b = temp
    i--
  }

  return x * b
}
