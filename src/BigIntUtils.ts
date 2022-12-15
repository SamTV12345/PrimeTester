export const BigMath = {
  abs: (x: bigint) => {
    return x < 0n ? BigInt(-x) : x
  },
  sign:(x:BigInt)=> {
    if (x === 0n) return 0n
    return x < 0n ? -1n : 1n
  }
}
