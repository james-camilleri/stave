export function fibonacci(positions = 15) {
  return new Array(positions).fill(1).reduce<number[]>((sequence, _, i) => {
    sequence.push(i <= 1 ? i : sequence[i - 2] + sequence[i - 1])
    return sequence
  }, [])
}
